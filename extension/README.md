# Gestura Browser Extension

This browser extension enables synchronized playback of sign language videos alongside YouTube content, making videos accessible to the deaf and hard-of-hearing community.

## Features

- 🎯 **Automatic Video Detection**: Detects YouTube videos and syncs with sign language content
- ⏯️ **Real-time Synchronization**: Play, pause, seek, and speed changes are mirrored
- 🎭 **Side Panel Interface**: Clean, user-friendly interface for video management
- 🔗 **Video ID Integration**: Easy linking with Gestura video IDs
- 📱 **Responsive Design**: Works seamlessly across different screen sizes

## Installation

### For Development/Testing:

1. **Download the Extension**
   - Navigate to the `/extension` folder in this project
   - Download or clone the entire folder

2. **Load in Chrome/Edge**
   - Open Chrome or Edge browser
   - Go to `chrome://extensions/` (or `edge://extensions/`)
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the extension folder

3. **Pin the Extension**
   - Click the puzzle piece icon in your browser toolbar
   - Find "Gestura - Sign Language Video Sync"
   - Click the pin icon to keep it visible

## Usage

### Getting Started:

1. **Get a Video ID**
   - Go to the Gestura web app at `/seeit/link-video`
   - Upload your sign language video and link it to a YouTube video
   - Copy the generated Video ID (starts with `GESTURA-`)

2. **Use the Extension**
   - Go to any YouTube video
   - Click the Gestura extension icon
   - Enter your Video ID in the side panel
   - Click "Load Sign Video"
   - Play the YouTube video - the sign language video will sync automatically!

### How Synchronization Works:

- **Play/Pause**: Sign language video mirrors YouTube video playback
- **Seeking**: When you skip forward/backward, both videos stay in sync
- **Speed Changes**: Playback speed adjustments are synchronized
- **Real-time Updates**: Continuous monitoring ensures perfect sync

## Technical Details

### File Structure:
```
extension/
├── manifest.json          # Extension configuration
├── content-script.js      # YouTube video detection & messaging
├── service-worker.js      # Background message handling
├── sidepanel.html         # Extension UI
├── sidepanel.css          # Styling
├── sidepanel.js           # Side panel functionality
├── icon.png              # Extension icon
└── README.md             # This file
```

### Key Components:

- **Content Script**: Monitors YouTube videos and sends status updates
- **Service Worker**: Handles communication between content script and side panel
- **Side Panel**: User interface for video ID input and sign language video playback
- **Message Passing**: Real-time communication between YouTube and extension

### API Integration:

The extension connects to the Gestura backend server running on `localhost:5000`:
- `GET /video/:videoId` - Fetches sign language video by ID
- Real-time synchronization via Chrome extension messaging

## Troubleshooting

### Common Issues:

1. **"Video not found" error**
   - Verify the Video ID is correct (starts with `GESTURA-`)
   - Ensure the backend server is running on port 5000
   - Check that the video was uploaded successfully

2. **Extension not syncing**
   - Make sure you're on a YouTube page with a video
   - Check that the side panel is open and video is loaded
   - Refresh the YouTube page and try again

3. **Side panel not opening**
   - Right-click the extension icon and select "Open side panel"
   - Ensure the extension is enabled in browser settings

### Debug Mode:

Open browser Developer Tools (F12) and check the Console tab for detailed logs:
- Content script logs start with 🎥
- Side panel logs start with 🎭
- Service worker logs start with 🔧

## Development

### Making Changes:

1. Edit the relevant files in the extension folder
2. Go to `chrome://extensions/`
3. Click the refresh icon on the Gestura extension
4. Test your changes

### Adding Features:

- **Content Script**: Add new video event listeners in `content-script.js`
- **Side Panel**: Update UI and functionality in `sidepanel.js`
- **Styling**: Modify `sidepanel.css` for visual changes

## Support

For issues or questions:
1. Check the browser console for error messages
2. Verify the backend server is running
3. Ensure all required permissions are granted
4. Try reloading the extension

## Permissions

The extension requires these permissions:
- `activeTab`: Access to current YouTube tab
- `scripting`: Inject content script into YouTube pages
- `sidePanel`: Display the extension interface
- `tabs`: Monitor tab changes for YouTube navigation
- `notifications`: Display status updates (optional)
- `host_permissions`: Access to YouTube.com domain

These permissions are necessary for the core functionality and are clearly explained in the extension store.
