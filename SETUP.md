# Gestura Setup Guide

This guide will help you set up the complete Gestura platform with backend, frontend, and browser extension.

## 🚀 Quick Setup

### Option 1: Using Batch Files (Windows)

1. **Start Backend Server**
   ```bash
   # Double-click start-backend.bat
   # Or run in Command Prompt:
   start-backend.bat
   ```

2. **Start Frontend**
   ```bash
   # Double-click start-frontend.bat
   # Or run in Command Prompt:
   start-frontend.bat
   ```

3. **Install Browser Extension**
   - Open Chrome/Edge
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `extension/` folder

### Option 2: Manual Setup

#### 1. Backend Setup

```bash
cd backend
npm install
npm start
```

Backend will run on: `http://localhost:5000`

#### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on: `http://localhost:5173`

#### 3. Extension Setup

1. Open Chrome/Edge browser
2. Navigate to `chrome://extensions/`
3. Toggle "Developer mode" (top right)
4. Click "Load unpacked"
5. Select the `extension/` folder
6. Pin the extension to your toolbar

## 🔧 Configuration

### MongoDB Connection

The backend is configured to connect to MongoDB Atlas. If you want to use a local MongoDB instance:

1. Install MongoDB locally
2. Update the connection string in `backend/server.js`:
   ```javascript
   mongoose.connect("mongodb://localhost:27017/gestura", {
     useNewUrlParser: true,
     useUnifiedTopology: true,
   })
   ```

### ChatIT (AI Assistant) API Key

ChatIT can use either Google Gemini (has a free tier) or Claude. Create `backend/.env` with one of these keys:

```env
# Google Gemini - get a free key at https://aistudio.google.com/apikey
GEMINI_API_KEY=...

# or Claude - https://platform.claude.com (needs account credit)
ANTHROPIC_API_KEY=sk-ant-...
```

If `GEMINI_API_KEY` is set, Gemini is used. Set `GEMINI_MODEL` to change the Gemini model.

Restart the backend after adding it. The key stays on the server and is never sent to the browser. `.env` is already in `.gitignore`.

Optional: set `CHAT_MODEL` in the same file to use a different Claude model (the default is `claude-opus-5-5`).

ChatIT's **Sign** input reuses the MeetIT sign recognition server, so start `meet-it/server.py` (port 8000) if you want to ask questions by fingerspelling. Typing works without it.

### Port Configuration

- **Backend**: Port 5000 (configurable in `server.js`)
- **Frontend**: Port 5173 (configurable in `vite.config.ts`)

To change ports:
1. Backend: Modify `PORT` variable in `server.js`
2. Frontend: Update API calls in `SeeIt.tsx` to match new backend port

## 📱 Testing the Platform

### 1. Test Backend

```bash
# Health check
curl http://localhost:5000/

# Should return:
{
  "message": "Gestura Backend Server is running!",
  "version": "1.0.0",
  "endpoints": {...}
}
```

### 2. Test Frontend

1. Open `http://localhost:5173`
2. Navigate to `/seeit/link-video`
3. Fill out the form and upload a test video
4. Verify you get a Video ID (starts with `GESTURA-`)

### 3. Test Extension

1. Go to any YouTube video
2. Open the Gestura extension side panel
3. Enter the Video ID from step 2
4. Click "Load Sign Video"
5. Play the YouTube video - sign language video should sync!

## 🐛 Troubleshooting

### Common Issues

#### Backend Won't Start
- **Issue**: MongoDB connection error
- **Solution**: Check internet connection and MongoDB Atlas credentials
- **Alternative**: Use local MongoDB instance

#### Frontend API Errors
- **Issue**: "Failed to connect to server"
- **Solution**: Ensure backend is running on port 5000
- **Check**: Open `http://localhost:5000` in browser

#### Extension Not Working
- **Issue**: "Video not found" error
- **Solution**: Verify Video ID is correct and backend is running
- **Check**: Open browser console (F12) for error messages

#### PowerShell Execution Policy Error
- **Issue**: "npm cannot be loaded because running scripts is disabled"
- **Solution**: Use the provided `.bat` files instead of PowerShell
- **Alternative**: Run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

### Debug Mode

#### Backend Debugging
```bash
# Run with debug logs
cd backend
DEBUG=* npm start
```

#### Frontend Debugging
- Open browser Developer Tools (F12)
- Check Console tab for errors
- Check Network tab for API calls

#### Extension Debugging
- Right-click extension icon → "Inspect popup"
- Check Console for content script and sidepanel logs
- Look for messages starting with 🎥, 🎭, or 🔧

## 📁 File Structure Overview

```
gestura-cbit/
├── backend/                 # Express.js server
│   ├── models/Video.js     # Database schema
│   ├── uploads/            # Video storage (auto-created)
│   ├── server.js           # Main server file
│   └── package.json        # Backend dependencies
├── frontend/               # React application
│   ├── src/pages/SeeIt.tsx # Main video interface
│   └── package.json        # Frontend dependencies
├── extension/              # Browser extension
│   ├── manifest.json       # Extension config
│   ├── content-script.js   # YouTube integration
│   ├── sidepanel.*         # Extension UI
│   └── service-worker.js   # Background messaging
├── start-backend.bat       # Windows startup script
├── start-frontend.bat      # Windows startup script
└── README.md              # Main documentation
```

## 🔄 Development Workflow

### Making Changes

1. **Backend Changes**
   - Edit files in `backend/`
   - Restart server: `npm start`
   - Test API endpoints

2. **Frontend Changes**
   - Edit files in `frontend/src/`
   - Hot reload should update automatically
   - Test in browser

3. **Extension Changes**
   - Edit files in `extension/`
   - Go to `chrome://extensions/`
   - Click refresh icon on Gestura extension
   - Test on YouTube

### Adding New Features

1. **New API Endpoint**
   - Add route in `backend/server.js`
   - Update frontend API calls in `SeeIt.tsx`
   - Test with Postman or curl

2. **New Extension Feature**
   - Update `content-script.js` for YouTube integration
   - Update `sidepanel.js` for UI changes
   - Update `manifest.json` if permissions needed

3. **New Frontend Component**
   - Create in `frontend/src/components/`
   - Import and use in `SeeIt.tsx`
   - Style with Tailwind CSS

## 🚀 Production Deployment

### Backend Deployment
1. Set up MongoDB Atlas production database
2. Update connection string in `server.js`
3. Deploy to Heroku, Railway, or similar
4. Set environment variables

### Frontend Deployment
1. Build: `npm run build`
2. Deploy to Vercel, Netlify, or similar
3. Update API endpoints to production URLs

### Extension Distribution
1. Package extension folder
2. Submit to Chrome Web Store
3. Or distribute as developer extension

## 📞 Support

If you encounter issues:

1. Check this setup guide
2. Review the main README.md
3. Check browser console for errors
4. Verify all services are running
5. Test each component individually

---

**Happy coding! 🎭✨**
