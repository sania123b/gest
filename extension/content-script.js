console.log("🎥 Gestura Content Script Loaded!");

// Wait until a video element is found on YouTube
function detectVideo() {
    let video = document.querySelector("video");

    if (video) {
        console.log("✅ YouTube Video Found! Setting up synchronization...");

        // Send status messages to the extension sidepanel
        function sendStatus(action, time = null, speed = null) {
            chrome.runtime.sendMessage({ 
                status: action, 
                currentTime: time, 
                playbackRate: speed,
                videoUrl: window.location.href
            }, (response) => {
                if (chrome.runtime.lastError) {
                    console.warn("⚠️ Side Panel may not be open yet.");
                }
            });
        }

        // Sync play/pause with sign language video
        video.addEventListener("play", () => {
            console.log("▶️ YouTube video playing");
            sendStatus("Playing", video.currentTime, video.playbackRate);
        });
        
        video.addEventListener("pause", () => {
            console.log("⏸️ YouTube video paused");
            sendStatus("Paused", video.currentTime, video.playbackRate);
        });

        // Sync seeking with sign language video
        video.addEventListener("seeked", () => {
            if (!isNaN(video.currentTime)) {
                console.log(`⏩ YouTube video seeked to: ${video.currentTime}s`);
                sendStatus("Seeked", video.currentTime, video.playbackRate);
            } else {
                console.warn("⚠️ Invalid currentTime detected.");
            }
        });

        // Sync playback speed changes
        video.addEventListener("ratechange", () => {
            console.log(`⚡ YouTube playback speed changed: ${video.playbackRate}x`);
            sendStatus("SpeedChanged", video.currentTime, video.playbackRate);
        });

        // Continuous synchronization check (every second)
        setInterval(() => {
            sendStatus("SyncCheck", video.currentTime, video.playbackRate);
        }, 1000);

        // Send initial video info
        sendStatus("VideoDetected", video.currentTime, video.playbackRate);
        
    } else {
        // Retry if video not found (YouTube might still be loading)
        setTimeout(detectVideo, 1000);
    }
}

// Start video detection
detectVideo();

// Listen for page changes (YouTube is a SPA)
let lastUrl = location.href;
new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        console.log("🔄 YouTube page changed, re-detecting video...");
        // Re-detect video after page change
        setTimeout(detectVideo, 2000);
    }
}).observe(document, { subtree: true, childList: true });
