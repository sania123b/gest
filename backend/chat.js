// ChatIT - conversational assistant for Deaf / hard-of-hearing users.
// Returns a plain-English reply plus a short "sign" version the 3D avatar signs.
//
// Provider: Google Gemini when GEMINI_API_KEY is set in backend/.env, otherwise Claude (ANTHROPIC_API_KEY).
const express = require("express");
const Anthropic = require("@anthropic-ai/sdk").default;
const { GoogleGenAI, ThinkingLevel, ApiError: GeminiApiError } = require("@google/genai");

const router = express.Router();

const useGemini = () => Boolean(process.env.GEMINI_API_KEY);

// Clients are created on first use so a missing key never stops the rest of the backend from starting.
let claudeClient = null;
let geminiClient = null;
const getClaude = () => (claudeClient ||= new Anthropic());
const getGemini = () =>
  (geminiClient ||= new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    // The SDK's default is 5 attempts with growing waits (up to a minute per model).
    // Fail fast instead and let askGemini() move on to a backup model.
    httpOptions: { timeout: 15000, retryOptions: { attempts: 1 } },
  }));

const SETUP_MESSAGE =
  "The chat service is not set up yet. Add GEMINI_API_KEY (or ANTHROPIC_API_KEY) to backend/.env and restart the backend.";

const CLAUDE_MODEL = process.env.CHAT_MODEL || "claude-opus-5-5";
// gemini-3.5-flash answered in ~3s on the free tier; 3.7/3.8-flash were often overloaded or rate limited.
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash";
const MAX_HISTORY = 40; // messages kept per request
const MAX_CHARS = 4000; // per message

const SYSTEM_PROMPT = `You are Gestura's friendly assistant inside ChatIT. The people you talk with are Deaf, hard of hearing, or speech-impaired. Many of them use sign language as their first language and English as a second language, so clear writing matters more than usual.

How to write the "reply":
- Use plain, simple English: short sentences, common words, no idioms, sarcasm, or wordplay.
- Answer the question directly first, then add only the detail that helps. Keep it under about 120 words unless the person asks for more.
- Short numbered steps or bullet points are fine when they make something easier to follow. Avoid other formatting.
- Be warm and patient. Never talk down to the person, and never assume they cannot do something because they are Deaf.
- When it is relevant, mention accessible options (captions, text relay, video relay, sign language interpreters, visual alerts), but do not force this into unrelated answers.
- For medical, legal, or emergency questions, give helpful general information and suggest a professional. In an emergency, tell them to use text-to-911 or their local emergency text service.

Messages may come from a camera that reads fingerspelling. Those can arrive in capital letters, with missing spaces or wrong letters (for example "HOWAREYOU" or "WHAT IS DEAF CLTURE"). Work out the most likely meaning and answer it. If you truly cannot tell, ask a short, simple question back.

How to write "sign":
- This is what the 3D avatar will sign. The avatar fingerspells, so it must be very short.
- Give 2 to 5 key words that carry the core meaning of your reply, in sign-language gloss style (topic first, no filler words like "the", "a", "is").
- Use only capital letters A-Z and spaces. No numbers, punctuation, or symbols; write numbers as words.
- Examples: "HELLO NICE MEET YOU", "DOCTOR APPOINTMENT TEXT FIRST", "YES CAPTIONS FREE".`;

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    reply: { type: "string" },
    sign: { type: "string" },
  },
  required: ["reply", "sign"],
  additionalProperties: false,
};

function cleanHistory(raw) {
  if (!Array.isArray(raw)) return null;
  const messages = raw
    .filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim()
    )
    .map((m) => ({ role: m.role, content: m.content.trim().slice(0, MAX_CHARS) }))
    .slice(-MAX_HISTORY);
  // The conversation must start with a user turn and end with one.
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== "user") return null;
  return messages;
}

function toSignGloss(text) {
  return String(text || "")
    .toUpperCase()
    .replace(/[^A-Z\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 6)
    .join(" ");
}

// Each returns { text: JSON string matching RESPONSE_SCHEMA, refused: boolean }
async function askClaude(messages) {
  const response = await getClaude().beta.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 16000,
    // If a safety classifier declines, the API retries on a fallback model.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: SYSTEM_PROMPT,
    messages,
    output_config: {
      effort: "low", // conversational answers - keeps replies fast
      format: { type: "json_schema", schema: RESPONSE_SCHEMA },
    },
  });
  if (response.stop_reason === "refusal") return { text: "", refused: true };
  const textBlock = response.content.find((b) => b.type === "text");
  return { text: textBlock ? textBlock.text : "", refused: false };
}

// Free-tier Gemini models are often busy (503) or rate limited (429), so fall back to other models.
const GEMINI_BACKUP_MODELS = ["gemini-3.5-flash-lite", "gemini-3.1-flash-lite", "gemini-3.8-flash"];
const RETRYABLE_STATUS = new Set([404, 429, 500, 503, 504]);

async function askGemini(messages) {
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  const models = [GEMINI_MODEL, ...GEMINI_BACKUP_MODELS.filter((m) => m !== GEMINI_MODEL)];

  let lastError;
  for (const model of models) {
    const started = Date.now();
    try {
      const response = await getGemini().models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: "application/json",
          responseJsonSchema: RESPONSE_SCHEMA,
          // Short chat answers don't need long reasoning - keeps replies fast.
          // Gemini 2.x uses a token budget; Gemini 3.x uses a thinking level.
          thinkingConfig: model.startsWith("gemini-2") ? { thinkingBudget: 0 } : { thinkingLevel: ThinkingLevel.LOW },
        },
      });
      console.log(`💬 Chat answered by ${model} in ${((Date.now() - started) / 1000).toFixed(1)}s`);
      const text = response.text;
      // No text usually means the answer was blocked by Gemini's safety filters.
      return { text: text || "", refused: !text };
    } catch (error) {
      lastError = error;
      const status = error instanceof GeminiApiError ? error.status : null;
      // Timeouts surface as plain errors; treat them like a busy model.
      const isTimeout = !status && /abort|timeout/i.test(String(error && error.name) + String(error && error.message));
      if (!RETRYABLE_STATUS.has(status) && !isTimeout) throw error;
      console.warn(`⚠️  Gemini ${model} unavailable (${status || "timeout"}) after ${((Date.now() - started) / 1000).toFixed(1)}s, trying next model...`);
    }
  }
  throw lastError;
}

// POST /chat  { messages: [{ role: "user" | "assistant", content: string }] }
router.post("/", async (req, res) => {
  const messages = cleanHistory(req.body && req.body.messages);
  if (!messages) {
    return res.status(400).json({
      success: false,
      message: "Send a 'messages' array that ends with a user message.",
    });
  }

  try {
    const { text, refused } = useGemini() ? await askGemini(messages) : await askClaude(messages);

    if (refused) {
      return res.json({
        success: true,
        reply: "Sorry, I can't help with that question. Please try asking something else.",
        sign: "SORRY TRY OTHER QUESTION",
      });
    }

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { reply: text, sign: "" };
    }

    const reply = String(parsed.reply || "").trim();
    if (!reply) {
      return res.status(502).json({ success: false, message: "The assistant returned an empty answer. Please try again." });
    }

    return res.json({
      success: true,
      reply,
      sign: toSignGloss(parsed.sign) || toSignGloss(reply.split(/\s+/).slice(0, 4).join(" ")),
    });
  } catch (error) {
    if (error instanceof GeminiApiError) {
      console.error(`❌ Chat (Gemini) error ${error.status}:`, error.message);
      if (error.status === 429) {
        return res.status(429).json({
          success: false,
          message: "The free Gemini limit was reached. Please wait a minute and try again.",
        });
      }
      if (error.status === 400 || error.status === 401 || error.status === 403) {
        return res.status(500).json({ success: false, message: "The Gemini API key was not accepted. Check GEMINI_API_KEY in backend/.env." });
      }
      return res.status(502).json({ success: false, message: "The assistant is having trouble right now. Please try again." });
    }
    if (error instanceof Anthropic.AuthenticationError) {
      console.error("❌ Chat: invalid ANTHROPIC_API_KEY");
      return res.status(500).json({ success: false, message: SETUP_MESSAGE });
    }
    if (error instanceof Anthropic.RateLimitError) {
      return res.status(429).json({ success: false, message: "Too many questions at once. Please wait a moment and try again." });
    }
    if (error instanceof Anthropic.APIError) {
      console.error(`❌ Chat API error ${error.status}:`, error.message);
      return res.status(502).json({ success: false, message: "The assistant is having trouble right now. Please try again." });
    }
    if (!useGemini() && !process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) {
      // The request never left the server - most likely no credentials are configured.
      console.error("❌ Chat: no ANTHROPIC_API_KEY set -", error.message);
      return res.status(500).json({ success: false, message: SETUP_MESSAGE });
    }
    console.error("❌ Chat error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
  }
});

module.exports = router;
