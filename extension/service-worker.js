// Service Worker for Gestura Extension
console.log("🔧 Gestura Service Worker loaded");

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
    console.log("✅ Gestura extension installed");
});

// Handle messages from content script and sidepanel
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("📨 Message received:", message);
    
    // Forward messages between content script and sidepanel
    if (message.status) {
        // Forward to sidepanel if it exists
        chrome.runtime.sendMessage(message, (response) => {
            if (chrome.runtime.lastError) {
                console.log("⚠️ Sidepanel not available:", chrome.runtime.lastError.message);
            }
        });
    }
    
    sendResponse({ received: true });
});

// Handle side panel opening
chrome.sidePanel.onOpened.addListener(() => {
    console.log("📱 Side panel opened");
});

// Handle tab updates (YouTube navigation)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && tab.url.includes('youtube.com')) {
        console.log("🔄 YouTube tab updated:", tab.url);
    }
});
