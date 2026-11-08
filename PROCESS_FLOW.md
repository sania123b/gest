# Gestura Project Process Flow

## 🏗️ **System Architecture Overview**

```
┌─────────────────────────────────────────────────────────────────┐
│                        GESTURA PLATFORM                        │
├─────────────────────────────────────────────────────────────────┤
│  Frontend (React + TypeScript)     │  Backend Services          │
│  ┌─────────────────────────────┐   │  ┌─────────────────────┐   │
│  │ • Home Page                 │   │  │ Node.js Server      │   │
│  │ • LearnIT Module            │   │  │ (Port 5000)         │   │
│  │ • MeetIT Module             │   │  │ • MongoDB           │   │
│  │ • SeeIT Module              │   │  │ • File Upload       │   │
│  │ • Navigation & Routing      │   │  │ • Video Processing  │   │
│  └─────────────────────────────┘   │  └─────────────────────┘   │
│                                    │  ┌─────────────────────┐   │
│                                    │  │ Python AI Server    │   │
│                                    │  │ (Port 8000)         │   │
│                                    │  │ • TensorFlow        │   │
│                                    │  │ • OpenCV            │   │
│                                    │  │ • Hand Detection    │   │
│                                    │  │ • Gesture Recognition│   │
│                                    │  └─────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 **Complete Process Flow**

### **1. Application Initialization**

```
User Opens Browser
        ↓
Loading Animation (1.5s)
        ↓
React App Initialization
        ↓
Navigation Component Loads
        ↓
Route to Home Page
        ↓
User Sees Main Dashboard
```

### **2. LearnIT Module Process Flow**

#### **2.1 Learning Mode**
```
User Clicks "LearnIT"
        ↓
Module Instructions Display
        ↓
User Clicks "Continue to Learning Platform"
        ↓
Alphabet Grid & Tips Section Load
        ↓
User Selects Letter (A-Z)
        ↓
Video Demonstration Plays
        ↓
User Clicks "Practice" Button
        ↓
Camera Access Request
        ↓
Live Video Stream Starts
```

#### **2.2 Practice & Evaluation Mode**
```
User Clicks "Record Sign (5s)"
        ↓
MediaRecorder Starts Recording
        ↓
5-Second Countdown Timer
        ↓
Video Blob Created
        ↓
"Evaluate" Button Appears
        ↓
User Clicks "Evaluate"
        ↓
POST /evaluate_video (Python Backend)
        ↓
Video Frames Extracted
        ↓
Hand Detection & Gesture Recognition
        ↓
CNN Model Prediction
        ↓
Accuracy Score Calculated
        ↓
Results Displayed to User
```

### **3. MeetIT Module Process Flow**

#### **3.1 Speech-to-Sign Translation**
```
User Clicks "MeetIT"
        ↓
Module Instructions Display
        ↓
User Clicks "Continue to Meeting Room"
        ↓
Avatar Canvas Loads (3D Model)
        ↓
User Enables Microphone
        ↓
Web Speech API Captures Audio
        ↓
Text-to-Speech Conversion
        ↓
Text Sent to Sign Language Engine
        ↓
3D Avatar Performs Sign Language
        ↓
Real-time Animation Display
```

#### **3.2 Sign-to-Text Translation**
```
User Enables Camera
        ↓
Live Video Stream Starts
        ↓
Frame Capture Every 300ms
        ↓
POST /predict_letter (Python Backend)
        ↓
Hand Detection (OpenCV + MediaPipe)
        ↓
Image Preprocessing
        ↓
CNN Model Prediction
        ↓
Rule-based Classification
        ↓
Letter/Word Accumulation
        ↓
Text Display in Real-time
```

### **4. SeeIT Module Process Flow**

#### **4.1 Video Upload & Processing**
```
User Clicks "SeeIT"
        ↓
Module Instructions Display
        ↓
User Clicks "Continue to Video Generation"
        ↓
File Upload Interface
        ↓
User Selects Video File
        ↓
POST /process-video (Node.js Backend)
        ↓
Video File Stored in MongoDB
        ↓
Audio Extraction Simulation
        ↓
Text Generation Based on Filename
        ↓
Extracted Text Returned
```

#### **4.2 Sign Language Video Generation**
```
Avatar Canvas Loads (3D Model)
        ↓
Text-to-Sign Animation Mapping
        ↓
Video Recording Starts
        ↓
3D Avatar Performs Animations
        ↓
Video Blob Generated
        ↓
Download Link Provided
        ↓
User Downloads Generated Video
```

## 🔧 **Technical Process Details**

### **Frontend Architecture**
```
React App (Port 5173)
├── App.tsx (Main Router)
├── Navigation.tsx (Top Navigation)
├── Home.tsx (Landing Page)
├── LearnIt.tsx (Learning Module)
├── MeetIt.tsx (Meeting Module)
├── SeeIt.tsx (Video Generation)
└── Components/
    ├── ModuleInstructions.tsx
    ├── Sidebar.tsx
    └── signkit/
        ├── AvatarCanvas.tsx
        ├── Animations/
        └── Utils/
```

### **Backend Services**

#### **Node.js Server (Port 5000)**
```
Express.js Application
├── MongoDB Connection
├── Multer File Upload
├── Routes:
│   ├── POST /upload (Sign Language Videos)
│   ├── GET /video/:videoId
│   ├── POST /process-video (Text Extraction)
│   └── GET /videos (All Videos)
└── Error Handling Middleware
```

#### **Python AI Server (Port 8000)**
```
FastAPI Application
├── HandGesturePredictor Class
├── CNN Model Loading
├── OpenCV Integration
├── Routes:
│   ├── POST /evaluate_video
│   ├── POST /predict_letter
│   └── POST /clear_text
└── CORS Middleware
```

## 📊 **Data Flow Patterns**

### **1. Video Processing Flow**
```
Video File Upload
        ↓
Multer Storage (Node.js)
        ↓
MongoDB Document Creation
        ↓
File Path Storage
        ↓
Public URL Generation
        ↓
Client Access via URL
```

### **2. AI Prediction Flow**
```
Image/Video Frame
        ↓
Base64 Encoding (Frontend)
        ↓
HTTP POST Request
        ↓
Base64 Decoding (Python)
        ↓
OpenCV Image Processing
        ↓
Hand Detection (MediaPipe)
        ↓
Image Preprocessing
        ↓
CNN Model Prediction
        ↓
Rule-based Classification
        ↓
JSON Response
        ↓
Frontend Display
```

### **3. Real-time Communication Flow**
```
User Input (Audio/Video)
        ↓
Web APIs (Speech/Camera)
        ↓
Frame/Audio Capture
        ↓
Backend Processing
        ↓
AI Model Inference
        ↓
Result Processing
        ↓
UI Update
        ↓
User Feedback
```

## 🎯 **Key Integration Points**

### **1. Frontend ↔ Node.js Backend**
- **Purpose**: File uploads, video storage, text extraction
- **Protocol**: HTTP/HTTPS
- **Data Format**: JSON, FormData
- **Port**: 5000

### **2. Frontend ↔ Python AI Backend**
- **Purpose**: Hand gesture recognition, accuracy evaluation
- **Protocol**: HTTP/HTTPS
- **Data Format**: JSON, Base64 images
- **Port**: 8000

### **3. Node.js ↔ MongoDB**
- **Purpose**: Video metadata storage, user data
- **Protocol**: MongoDB Native Driver
- **Database**: Gestura
- **Collections**: Videos, Users

### **4. Python ↔ AI Models**
- **Purpose**: Machine learning inference
- **Models**: CNN for gesture recognition
- **Libraries**: TensorFlow, OpenCV, MediaPipe
- **File**: cnn8grps_rad1_model.h5

## 🔄 **State Management Flow**

### **LearnIT State Flow**
```
showInstructions → showPractice → isRecording → showEvaluateButton → accuracy
```

### **MeetIT State Flow**
```
isSignDetecting → signText → signConfidence → isPlaying → avatarLoaded
```

### **SeeIT State Flow**
```
file → extractedText → generating → progress → generated → videoBlob
```

## 🚀 **Performance Optimizations**

### **1. Frontend Optimizations**
- React.memo for component re-rendering
- useCallback for event handlers
- Lazy loading for video components
- Debounced API calls

### **2. Backend Optimizations**
- Connection pooling for MongoDB
- File size limits (100MB)
- Temporary file cleanup
- CORS configuration

### **3. AI Model Optimizations**
- Model caching in memory
- Batch processing for multiple frames
- Confidence threshold filtering
- Error handling for invalid inputs

## 🔐 **Security Considerations**

### **1. File Upload Security**
- File type validation
- Size limits
- Virus scanning (recommended)
- Secure file storage

### **2. API Security**
- CORS configuration
- Input validation
- Error message sanitization
- Rate limiting (recommended)

### **3. Data Privacy**
- No persistent storage of user videos
- Temporary file cleanup
- Secure data transmission
- User consent for camera/microphone access

## 📈 **Monitoring & Logging**

### **1. Frontend Logging**
- Console logs for debugging
- Error boundaries for React errors
- Performance monitoring
- User interaction tracking

### **2. Backend Logging**
- Request/response logging
- Error logging with stack traces
- Database operation logging
- File upload tracking

### **3. AI Model Logging**
- Prediction accuracy tracking
- Processing time monitoring
- Error handling for model failures
- Confidence score distribution

## 🔧 **Deployment Considerations**

### **1. Environment Variables**
```bash
# Node.js Backend
MONGODB_URI=mongodb://...
PORT=5000

# Python Backend
MODEL_PATH=./cnn8grps_rad1_model.h5
PORT=8000

# Frontend
VITE_API_URL=http://localhost:5000
VITE_AI_URL=http://localhost:8000
```

### **2. Production Setup**
- Load balancing for multiple instances
- Database clustering
- CDN for static assets
- SSL/TLS certificates
- Health check endpoints

### **3. Scaling Considerations**
- Horizontal scaling for Python AI server
- Database sharding for large datasets
- Caching layer (Redis)
- Message queues for async processing

---

This comprehensive process flow documentation covers all aspects of the Gestura platform, from user interaction to technical implementation details.



