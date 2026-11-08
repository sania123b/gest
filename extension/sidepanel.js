// Gestura Extension Sidepanel Script
console.log("🎭 Gestura Sidepanel loaded");

// DOM elements
let statusText = document.getElementById("status");
let sideVideo = document.getElementById("sideVideo");
let statusIndicator = document.getElementById("statusIndicator");
let syncInfo = document.getElementById("syncInfo");
let videoInfo = document.getElementById("videoInfo");

// State management
let currentVideoId = null;
let isVideoLoaded = false;
let lastSyncTime = 0;

// Helper to safely play video (handles autoplay policies)
async function safePlay() {
    if (!sideVideo) return;
    try {
        sideVideo.muted = true; // ensure autoplay allowed
        const playPromise = sideVideo.play();
        if (playPromise && typeof playPromise.then === 'function') {
            await playPromise;
        }
    } catch (err) {
        console.warn("⚠️ sideVideo.play() was blocked:", err);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 Sidepanel initialized");
    updateStatus("Ready", "idle");
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message) => {
    console.log("📨 Sidepanel received message:", message);

    if (!sideVideo || !statusText) return;

    if (message.status) {
        handleVideoStatus(message);
    }
});

// Handle video status updates from YouTube
function handleVideoStatus(message) {
    const { status, currentTime, playbackRate } = message;
    
    switch (status) {
        case "VideoDetected":
            updateStatus("YouTube video detected", "syncing");
            syncInfo.innerHTML = `<p>YouTube video found. Ready for synchronization.</p>`;
            break;
            
        case "Playing":
            if (isVideoLoaded) {
                safePlay();
                updateStatus("Playing", "syncing");
                syncInfo.innerHTML = `<p>Playing at ${currentTime}s (${playbackRate}x speed)</p>`;
            }
            break;
            
        case "Paused":
            if (isVideoLoaded) {
                sideVideo.pause();
                updateStatus("Paused", "syncing");
                syncInfo.innerHTML = `<p>Paused at ${currentTime}s</p>`;
            }
            break;
            
        case "Seeked":
        case "SyncCheck":
            if (isVideoLoaded && currentTime !== undefined) {
                syncVideoTime(currentTime);
                updateStatus("Syncing", "syncing");
                syncInfo.innerHTML = `<p>Synced to ${Number(currentTime).toFixed(1)}s (${playbackRate}x)</p>`;
            }
            break;
            
        case "SpeedChanged":
            if (isVideoLoaded) {
                sideVideo.playbackRate = playbackRate;
                updateStatus("Speed changed", "syncing");
                syncInfo.innerHTML = `<p>Speed adjusted to ${playbackRate}x</p>`;
            }
            break;
            
        default:
            console.log("Unknown status:", status);
    }
}

// Sync the sign language video time with YouTube video
function syncVideoTime(targetTime) {
    // Coerce to number to avoid string math
    const target = Number(targetTime) || 0;
    const timeDiff = Math.abs((sideVideo.currentTime || 0) - target);
    
    // Only sync if difference is significant (more than 0.3 seconds)
    if (timeDiff > 0.3) {
        console.log(`🔄 Syncing sign video to: ${target}s (diff: ${timeDiff.toFixed(2)}s)`);
        sideVideo.currentTime = target;
        lastSyncTime = Date.now();
    }
}

// Update status display
function updateStatus(message, type = "idle") {
    statusText.textContent = message;
    
    // Update status indicator
    statusIndicator.className = `status-indicator ${type}`;
    
    console.log(`📊 Status: ${message} (${type})`);
}

// Fetch video from backend using Video ID
document.getElementById("fetchVideoBtn").addEventListener("click", async () => {
    const videoId = document.getElementById("videoIdInput").value.trim();
    
    if (!videoId) {
        showMessage("Please enter a valid Video ID!", "error");
        return;
    }

    // Validate Video ID format
    if (!videoId.startsWith('GESTURA-')) {
        showMessage("Please enter a valid Gestura Video ID (starts with GESTURA-)", "error");
        return;
    }

    try {
        updateStatus("Loading sign language video...", "loading");
        showMessage("Fetching video from server...", "info");
        
        const response = await fetch(`http://localhost:5000/video/${videoId}`);
        const data = await response.json();

        if (data.success) {
            // Load the video
            document.getElementById("videoSource").src = data.videoUrl;
            sideVideo.load();
            
            currentVideoId = videoId;
            isVideoLoaded = true;
            
            // Update video info
            videoInfo.innerHTML = `
                <p><strong>Creator:</strong> ${data.metadata.creatorName}</p>
                <p><strong>YouTube Link:</strong> <a href="${data.metadata.youtubeLink}" target="_blank">View Original</a></p>
                <p><strong>Created:</strong> ${new Date(data.metadata.createdAt).toLocaleDateString()}</p>
            `;
            
            updateStatus("Sign language video loaded", "syncing");
            showMessage("Sign language video loaded successfully! Play a YouTube video to see synchronization.", "success");
            
            console.log("✅ Video loaded successfully:", data);
        } else {
            updateStatus("Video not found", "error");
            showMessage(data.message || "Video not found!", "error");
            console.error("❌ Video not found:", data);
        }
    } catch (error) {
        updateStatus("Connection error", "error");
        showMessage("Failed to connect to server. Make sure the Gestura backend is running.", "error");
        console.error("❌ Error fetching video:", error);
    }
});

// Show temporary messages
function showMessage(message, type = "info") {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.error-message, .success-message, .info-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message`;
    messageDiv.textContent = message;
    
    // Insert after the input section
    const inputSection = document.querySelector('.input-section');
    inputSection.appendChild(messageDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Handle video loading events
sideVideo.addEventListener('loadeddata', () => {
    console.log("📹 Sign language video data loaded");
});

sideVideo.addEventListener('canplay', () => {
    console.log("▶️ Sign language video ready to play");
});

sideVideo.addEventListener('error', (e) => {
    console.error("❌ Sign language video error:", e);
    updateStatus("Video playback error", "error");
    showMessage("Failed to load sign language video. Please check the Video ID.", "error");
});

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && document.activeElement.id === 'videoIdInput') {
        document.getElementById('fetchVideoBtn').click();
    }
});

console.log("✅ Gestura Sidepanel script loaded successfully");
