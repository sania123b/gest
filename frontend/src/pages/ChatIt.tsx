import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  SendIcon,
  KeyboardIcon,
  HandIcon,
  RotateCcwIcon,
  SquareIcon,
  PlusIcon,
  SparklesIcon,
  EraserIcon,
  AlertCircleIcon,
} from 'lucide-react';
import ModuleInstructions from '../components/ModuleInstructions';
import { AvatarCanvas, useSignSynthesis } from '../signkit';
import type { AvatarCanvasHandle } from '../signkit';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { defaultPose } from '../signkit/Animations/defaultPose.js';
// Web-optimized copy of TPose.glb: 2048px textures, matte materials (~10 MB instead of 63 MB)
import humanAvatar from '../signkit/Models/TPose/TPose_web.glb';

const CHAT_API = 'http://localhost:5000/chat';
const SIGN_API = 'http://localhost:8000';
const STORAGE_KEY = 'gestura-chatit-history';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sign?: string;
  error?: boolean;
  local?: boolean; // shown in the UI only, never sent to the AI
};

type Speed = 'slow' | 'normal' | 'fast';
const SPEEDS: Record<Speed, { speed: number; pause: number; label: string }> = {
  slow: { speed: 0.12, pause: 900, label: 'Slow' },
  normal: { speed: 0.18, pause: 550, label: 'Normal' },
  fast: { speed: 0.26, pause: 300, label: 'Fast' },
};

const WELCOME: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    'Hello! I am your Gestura assistant. Ask me anything: school, work, health, technology, Deaf culture, or everyday questions. You can type, or fingerspell to the camera. I will answer in text, and the avatar will sign the key words.',
  sign: 'HELLO ASK ME ANYTHING',
  local: true,
};

const SUGGESTIONS = [
  'What can you help me with?',
  'How do I ask for a sign language interpreter at the hospital?',
  'Explain what Deaf culture is',
  'How do I prepare for a job interview?',
];

const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const loadHistory = (): ChatMessage[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (Array.isArray(parsed) && parsed.length) return parsed;
  } catch {}
  return [WELCOME];
};

const ChatIt = () => {
  const [showInstructions, setShowInstructions] = useState(true);

  return (
    <div className="w-full overflow-x-hidden">
      {/* Header Section */}
      <section className="relative py-16 px-6 bg-gradient-to-br from-violet-400/80 via-fuchsia-300/70 to-pink-300/80 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-fuchsia-400/20 blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-violet-300/20 blur-3xl"></div>
        </div>
        <div className="relative max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
            >
              <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
              <span className="text-sm font-medium text-gray-800">AI Assistant in Sign Language</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl sm:text-5xl font-bold mb-6 text-gray-800"
            >
              ChatIT -{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">
                Ask the Avatar
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-xl text-gray-700 max-w-2xl mx-auto"
            >
              Ask any question by typing or signing, and get clear answers in text and sign language
            </motion.p>
          </motion.div>
        </div>
      </section>

      {showInstructions ? (
        <div className="bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-6">
            <ModuleInstructions
              title="How ChatIT Works"
              description="ChatIT is an AI assistant built for Deaf and speech-impaired users. Ask any doubt the way you would ask a friend, and a human avatar answers you in sign language, with the full answer written in simple English."
              features={[
                'Ask questions by typing, or by fingerspelling to your camera',
                'Answers are written in short, simple English that is easy to read',
                'The 3D avatar signs the key words of every answer, with live captions',
                'Replay any answer, and choose slow, normal, or fast signing speed',
              ]}
              colorGradient="from-violet-300 to-fuchsia-300"
            />
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowInstructions(false)}
                className="px-5 py-3 bg-gradient-to-r from-violet-300 to-fuchsia-300 text-gray-800 font-medium rounded-xl transition-colors shadow-lg shadow-fuchsia-500/20"
              >
                Start Chatting
              </motion.button>
            </div>
          </div>
        </div>
      ) : (
        <ChatRoom />
      )}
    </div>
  );
};

const ChatRoom = () => {
  const avatarRef = useRef<AvatarCanvasHandle | null>(null);
  const { signText } = useSignSynthesis(avatarRef);

  const [messages, setMessages] = useState<ChatMessage[]>(loadHistory);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputMode, setInputMode] = useState<'type' | 'sign'>('type');
  const [autoSign, setAutoSign] = useState(true);
  const [speed, setSpeed] = useState<Speed>('normal');

  // Avatar signing state
  const [signingId, setSigningId] = useState<string | null>(null);
  const [signWords, setSignWords] = useState<string[]>([]);
  const [activeWord, setActiveWord] = useState(-1);

  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Keep a copy of the conversation in this browser
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-60)));
    } catch {}
  }, [messages]);

  // Scroll the message list (not the page) to the newest message
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  // Apply signing speed
  useEffect(() => {
    avatarRef.current?.setSpeed(SPEEDS[speed].speed);
    avatarRef.current?.setPauseMs(SPEEDS[speed].pause);
  }, [speed]);

  const playSign = useCallback(
    (msg: ChatMessage) => {
      const gloss = (msg.sign || '').trim();
      if (!gloss || !avatarRef.current) return;
      avatarRef.current.clear();
      avatarRef.current.setSpeed(SPEEDS[speed].speed);
      avatarRef.current.setPauseMs(SPEEDS[speed].pause);
      setSignWords(gloss.toUpperCase().split(/\s+/).filter(Boolean));
      setActiveWord(-1);
      setSigningId(msg.id);
      signText(gloss);
    },
    [signText, speed],
  );

  const stopSigning = () => {
    const handle = avatarRef.current;
    if (!handle) return;
    handle.clear();
    const compat = handle.getCompatRef();
    if (compat) defaultPose(compat); // return the hands to a resting position
    setSigningId(null);
    setActiveWord(-1);
  };

  // Note: AvatarCanvas keeps the first callbacks it receives, so these only use state setters / refs
  const handleAddText = useCallback(() => setActiveWord((i) => i + 1), []);
  const handleSegmentEnd = useCallback(() => {
    const queue = avatarRef.current?.getCompatRef()?.animations;
    if (!queue || queue.length === 0) {
      setSigningId(null);
    }
  }, []);

  const sendMessage = async (text: string) => {
    const question = text.trim();
    if (!question || loading) return;

    const userMsg: ChatMessage = { id: newId(), role: 'user', content: question };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const history = nextMessages
        .filter((m) => !m.local && !m.error)
        .map((m) => ({ role: m.role, content: m.content }));
      const { data } = await axios.post(CHAT_API, { messages: history }, { timeout: 120000 });
      const reply: ChatMessage = { id: newId(), role: 'assistant', content: data.reply, sign: data.sign };
      setMessages((prev) => [...prev, reply]);
      if (autoSign) playSign(reply);
    } catch (err: any) {
      const serverMsg = err?.response?.data?.message;
      const content = serverMsg
        ? serverMsg
        : 'I could not reach the chat server. Make sure the backend is running (cd backend, then npm start).';
      setMessages((prev) => [...prev, { id: newId(), role: 'assistant', content, error: true, local: true }]);
    } finally {
      setLoading(false);
      if (inputMode === 'type') inputRef.current?.focus();
    }
  };

  const newChat = () => {
    stopSigning();
    setMessages([WELCOME]);
    setInput('');
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const signingMessage = messages.find((m) => m.id === signingId);
  const showSuggestions = messages.filter((m) => m.role === 'user').length === 0;

  return (
    <section className="relative py-12 px-4 sm:px-6 bg-gray-50/70 overflow-hidden">
      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-6"
        >
          {/* Avatar panel */}
          <div className="lg:col-span-2 relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-300/70 to-fuchsia-300/70 rounded-2xl blur-sm opacity-50"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-violet-100 p-4 flex flex-col h-full">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-violet-800">Sign Avatar</h2>
                <div className="flex bg-violet-50 rounded-lg p-0.5" role="group" aria-label="Signing speed">
                  {(Object.keys(SPEEDS) as Speed[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSpeed(s)}
                      aria-pressed={speed === s}
                      className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                        speed === s ? 'bg-white shadow text-violet-700 font-semibold' : 'text-violet-600 hover:text-violet-800'
                      }`}
                    >
                      {SPEEDS[s].label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative rounded-lg overflow-hidden bg-white/60 border border-violet-100 h-[420px] lg:h-[480px]">
                <div className="absolute inset-0">
                  <AvatarCanvas
                    ref={avatarRef}
                    initialModelUrl={humanAvatar}
                    defaultPose={defaultPose}
                    className="w-full h-full"
                    onAddText={handleAddText}
                    onSegmentEnd={handleSegmentEnd}
                  />
                </div>
                {/* Live caption of what the avatar is signing */}
                <AnimatePresence>
                  {signingId && signWords.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 flex flex-wrap justify-center gap-x-2 gap-y-1"
                      aria-live="polite"
                    >
                      {signWords.map((w, i) => (
                        <span
                          key={i}
                          className={`text-lg font-bold tracking-wide transition-colors ${
                            i === activeWord ? 'text-fuchsia-300' : i < activeWord ? 'text-white/50' : 'text-white'
                          }`}
                        >
                          {w}
                        </span>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-3 flex items-center justify-between gap-2">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoSign}
                    onChange={(e) => setAutoSign(e.target.checked)}
                    className="w-4 h-4 accent-violet-500"
                  />
                  Sign answers automatically
                </label>
                {signingId ? (
                  <button
                    onClick={stopSigning}
                    className="px-3 py-1.5 text-sm rounded-md bg-red-500 text-white hover:bg-red-600 flex items-center gap-1"
                  >
                    <SquareIcon size={14} /> Stop
                  </button>
                ) : (
                  <span className="text-xs text-gray-500">Press "Sign again" on any answer</span>
                )}
              </div>
              {signingMessage && (
                <p className="mt-2 text-xs text-gray-500">The avatar signs the key words. The full answer is in the chat.</p>
              )}
            </div>
          </div>

          {/* Chat panel */}
          <div className="lg:col-span-3 relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-fuchsia-200/70 to-violet-200/70 rounded-2xl blur-sm opacity-50"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-violet-100 flex flex-col h-[640px] lg:h-full lg:min-h-[600px]">
              <div className="flex items-center justify-between px-5 py-3 border-b border-violet-100">
                <div className="flex items-center gap-2">
                  <SparklesIcon size={18} className="text-fuchsia-500" />
                  <h2 className="text-lg font-semibold text-violet-800">Chat</h2>
                </div>
                <button
                  onClick={newChat}
                  className="px-3 py-1.5 text-sm rounded-md text-violet-700 hover:bg-violet-50 flex items-center gap-1"
                >
                  <PlusIcon size={16} /> New chat
                </button>
              </div>

              {/* Messages */}
              <div ref={listRef} className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-4" aria-live="polite">
                {messages.map((m) => (
                  <MessageBubble
                    key={m.id}
                    message={m}
                    isSigning={signingId === m.id}
                    onReplay={() => playSign(m)}
                  />
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-violet-50 border border-violet-100 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5" aria-label="Assistant is thinking">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="w-2 h-2 rounded-full bg-violet-400"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                        />
                      ))}
                      <span className="ml-2 text-sm text-violet-700">Thinking…</span>
                    </div>
                  </div>
                )}
                {showSuggestions && !loading && (
                  <div className="pt-2">
                    <div className="text-xs text-gray-500 mb-2">Try asking:</div>
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTIONS.map((s) => (
                        <button
                          key={s}
                          onClick={() => sendMessage(s)}
                          className="px-3 py-1.5 text-sm rounded-full border border-violet-200 bg-white text-violet-700 hover:bg-violet-50"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Input area */}
              <div className="border-t border-violet-100 p-3 sm:p-4">
                <div className="flex bg-violet-50 rounded-lg p-0.5 mb-3 w-fit" role="tablist" aria-label="How do you want to ask?">
                  <button
                    role="tab"
                    aria-selected={inputMode === 'type'}
                    onClick={() => setInputMode('type')}
                    className={`px-3 py-1.5 text-sm rounded-md flex items-center gap-1.5 transition-colors ${
                      inputMode === 'type' ? 'bg-white shadow text-violet-700' : 'text-violet-600 hover:text-violet-800'
                    }`}
                  >
                    <KeyboardIcon size={16} /> Type
                  </button>
                  <button
                    role="tab"
                    aria-selected={inputMode === 'sign'}
                    onClick={() => setInputMode('sign')}
                    className={`px-3 py-1.5 text-sm rounded-md flex items-center gap-1.5 transition-colors ${
                      inputMode === 'sign' ? 'bg-white shadow text-violet-700' : 'text-violet-600 hover:text-violet-800'
                    }`}
                  >
                    <HandIcon size={16} /> Sign
                  </button>
                </div>

                {inputMode === 'sign' && <SignInput onText={setInput} />}

                <div className="flex items-end gap-2">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    rows={2}
                    placeholder={inputMode === 'sign' ? 'Your signed letters appear here. You can edit them before sending.' : 'Type your question… (Enter to send, Shift+Enter for a new line)'}
                    className="flex-1 resize-none rounded-xl border border-violet-200 bg-white px-4 py-3 text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-300"
                    aria-label="Your question"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => sendMessage(input)}
                    disabled={!input.trim() || loading}
                    className="h-12 px-4 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium flex items-center gap-2 shadow-lg shadow-fuchsia-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Send question"
                  >
                    <SendIcon size={18} />
                    <span className="hidden sm:inline">Send</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

type BubbleProps = {
  message: ChatMessage;
  isSigning: boolean;
  onReplay: () => void;
};

const MessageBubble: React.FC<BubbleProps> = ({ message, isSigning, onReplay }) => {
  const isUser = message.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-br-sm'
            : message.error
            ? 'bg-red-50 border border-red-200 text-red-800 rounded-bl-sm'
            : `bg-violet-50 border text-gray-800 rounded-bl-sm ${isSigning ? 'border-fuchsia-300 ring-2 ring-fuchsia-200' : 'border-violet-100'}`
        }`}
      >
        {message.error && (
          <div className="flex items-center gap-1.5 text-sm font-semibold mb-1">
            <AlertCircleIcon size={16} /> Problem
          </div>
        )}
        <div className="text-base leading-relaxed whitespace-pre-wrap break-words">{message.content}</div>
        {!isUser && !message.error && message.sign && (
          <div className="mt-2 pt-2 border-t border-violet-100 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-violet-700">
              <span className="font-semibold">Signed:</span> {message.sign}
            </span>
            <button
              onClick={onReplay}
              className="text-xs px-2 py-1 rounded-md bg-white border border-violet-200 text-violet-700 hover:bg-violet-100 flex items-center gap-1"
            >
              <RotateCcwIcon size={12} /> {isSigning ? 'Signing…' : 'Sign again'}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Fingerspelling input: reuses the MeetIT sign-recognition server (meet-it/server.py, port 8000)
const SignInput: React.FC<{ onText: (text: string) => void }> = ({ onText }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);
  const busyRef = useRef(false);

  const [cameraError, setCameraError] = useState<string | null>(null);
  const [serverError, setServerError] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [letter, setLetter] = useState('');
  const [confidence, setConfidence] = useState(0);

  const stopDetection = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setDetecting(false);
    setLetter('');
  };

  // Camera on while this panel is open
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 360 }, facingMode: 'user' },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
      } catch (err: any) {
        let message = 'Unable to access camera.';
        if (err?.name === 'NotAllowedError') message = 'Camera permission denied. Allow camera access in your browser.';
        if (err?.name === 'NotFoundError') message = 'No camera found.';
        if (err?.name === 'NotReadableError') message = 'The camera is being used by another app.';
        setCameraError(message);
      }
    })();
    return () => {
      cancelled = true;
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, []);

  const captureFrame = (): Promise<Blob | null> => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !video.videoWidth) return Promise.resolve(null);
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return Promise.resolve(null);
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    ctx.restore();
    return new Promise((resolve) => canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.8));
  };

  const predict = async () => {
    if (busyRef.current) return; // skip a tick if the last request is still running
    busyRef.current = true;
    try {
      const frame = await captureFrame();
      if (!frame) return;
      const form = new FormData();
      form.append('file', frame, 'frame.jpg');
      const { data } = await axios.post(`${SIGN_API}/predict_letter`, form);
      setServerError(false);
      if (data.letter) {
        setLetter(data.letter);
        setConfidence(data.confidence || 0);
      }
      if (typeof data.accumulated_text === 'string') {
        onText(data.accumulated_text);
      }
    } catch {
      setServerError(true);
      stopDetection();
    } finally {
      busyRef.current = false;
    }
  };

  const startDetection = async () => {
    // Start each question from a clean slate
    try {
      await axios.post(`${SIGN_API}/clear_text`);
      setServerError(false);
    } catch {
      setServerError(true);
      return;
    }
    onText('');
    setDetecting(true);
    intervalRef.current = window.setInterval(predict, 300);
  };

  const clearText = async () => {
    try {
      await axios.post(`${SIGN_API}/clear_text`);
    } catch {}
    onText('');
    setLetter('');
  };

  return (
    <div className="mb-3 grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-3 items-start">
      <div className="relative rounded-lg overflow-hidden bg-gray-900 aspect-video">
        <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover -scale-x-100" />
        {cameraError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white text-xs p-2 text-center">
            {cameraError}
          </div>
        )}
        {detecting && letter && (
          <div className="absolute top-1 right-1 px-2 py-0.5 rounded bg-black/60 text-white text-sm font-bold">{letter}</div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>
      <div className="text-sm">
        <div className="flex flex-wrap gap-2 mb-2">
          <button
            onClick={detecting ? stopDetection : startDetection}
            disabled={!!cameraError}
            className={`px-3 py-1.5 rounded-md text-white transition-colors disabled:opacity-40 ${
              detecting ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {detecting ? 'Stop signing' : 'Start signing'}
          </button>
          <button onClick={clearText} className="px-3 py-1.5 rounded-md bg-gray-500 text-white hover:bg-gray-600 flex items-center gap-1">
            <EraserIcon size={14} /> Clear
          </button>
        </div>
        {detecting ? (
          <p className="text-gray-600 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Reading your fingerspelling…
            {letter && <span className="font-semibold">Current: {letter} ({Number(confidence).toFixed(0)}%)</span>}
          </p>
        ) : (
          <p className="text-gray-600">Fingerspell your question letter by letter. Stop when you are done, check the text, then press Send.</p>
        )}
        {serverError && (
          <p className="mt-2 text-red-600 text-xs">
            The sign recognition server is not running. Start it with <code className="bg-red-50 px-1 rounded">cd meet-it</code> then{' '}
            <code className="bg-red-50 px-1 rounded">python server.py</code>, or switch to Type.
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatIt;
