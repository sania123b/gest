# Gestura - Sign Language Learning & Translation Platform

![Gestura Logo](https://img.shields.io/badge/Gestura-Sign%20Language%20Platform-blue?style=for-the-badge&logo=accessibility)

A comprehensive web application that bridges the communication gap between hearing and deaf communities through AI-powered sign language learning, real-time translation, and video generation.

## 🌟 Features

### 🎓 LearnIT - Interactive Learning Platform
- **Real-time Practice**: Practice sign language with live camera feedback
- **Accuracy Assessment**: Get instant accuracy scores for your sign language gestures
- **Alphabet Learning**: Master the ASL alphabet with video demonstrations
- **Interactive Tips**: Detailed guidance for each letter and gesture

### 🤝 MeetIT - Virtual Meeting Room
- **Real-time Translation**: Convert speech to sign language in real-time
- **Sign-to-Text**: Convert sign language gestures to text
- **Multi-participant Support**: Support for multiple users in virtual meetings
- **Live Communication**: Seamless communication between hearing and deaf participants

### 👁️ SeeIT - Video Translation
- **Video Upload**: Upload any video for sign language translation
- **AI Avatar Generation**: Generate 3D avatar videos performing sign language
- **Audio Extraction**: Extract and convert audio to text
- **Downloadable Content**: Download generated sign language videos

### 💬 ChatIT - AI Assistant in Sign Language
- **Ask Anything**: Chat with an AI assistant the way you would with any chatbot
- **Type or Sign**: Type your question, or fingerspell it to the camera
- **Answers in Sign**: A human avatar signs the key words of every answer, with live captions
- **Simple English**: Full answers are written in short, clear sentences
- **Replay & Speed Control**: Replay any answer, signed slow, normal, or fast

## 🚀 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Framer Motion** for smooth animations
- **Tailwind CSS** for styling
- **Three.js** for 3D avatar rendering
- **Web Speech API** for speech recognition
- **MediaRecorder API** for video recording

### Backend
- **Node.js** with Express.js
- **MongoDB** for data storage
- **Multer** for file uploads
- **CORS** for cross-origin requests

### AI/ML
- **TensorFlow/Keras** for hand gesture recognition
- **OpenCV** for computer vision
- **Custom CNN Model** for sign language classification
- **Real-time prediction** with confidence scoring

## 📁 Project Structure

```
gestura-cbit/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/          # Main application pages
│   │   ├── signkit/        # 3D avatar and animation system
│   │   ├── utils/          # Utility functions
│   │   └── App.tsx         # Main application component
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── backend/                # Node.js backend server
│   ├── models/            # MongoDB data models
│   ├── uploads/           # File upload directory
│   └── server.js          # Main server file
├── meet-it/               # Python AI/ML backend
│   ├── predictor.py       # Hand gesture prediction
│   ├── server.py          # FastAPI server
│   ├── final_pred.py      # Reference prediction script
│   └── cnn8grps_rad1_model.h5  # Trained CNN model
├── extension/             # Browser extension
└── README.md             # This file
```

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **MongoDB** (local or cloud instance)
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/gestura-cbit.git
cd gestura-cbit
```

### 2. Backend Setup (Node.js)
```bash
cd backend
npm install
npm start
```
The backend server will run on `http://localhost:5000`

### 3. AI/ML Backend Setup (Python)
```bash
cd meet-it
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python server.py
```
The AI backend will run on `http://localhost:8000`

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:5173`

## 🎯 Usage Guide

### LearnIT - Learning Sign Language
1. Navigate to the LearnIT page
2. Select a letter from the alphabet grid
3. Click "Practice" to enable your camera
4. Perform the sign language gesture
5. Click "Record Sign" to capture your gesture
6. View your accuracy score and get feedback

### MeetIT - Real-time Communication
1. Navigate to the MeetIT page
2. Enable your camera and microphone
3. **For Speech-to-Sign**: Speak normally - the avatar will translate to sign language
4. **For Sign-to-Text**: Perform sign language gestures - see text appear in real-time
5. Use the meeting controls to manage your session

### SeeIT - Video Translation
1. Navigate to the SeeIT page
2. Click "Generate Sign Language Video"
3. Upload your video file
4. Wait for audio extraction and processing
5. Download the generated sign language video

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

### Model Configuration
The AI model can be configured in `meet-it/predictor.py`:
- Confidence thresholds
- Hand detection parameters
- Classification rules

## 📊 API Endpoints

### Backend (Node.js - Port 5000)
- `POST /upload` - Upload sign language video
- `GET /video/:videoId` - Retrieve video by ID
- `POST /process-video` - Process video for text extraction
- `POST /chat` - ChatIT: send `{ messages: [{ role, content }] }`, get `{ reply, sign }` (needs `ANTHROPIC_API_KEY` in `backend/.env`)

### AI Backend (Python - Port 8000)
- `POST /evaluate_video` - Evaluate video accuracy
- `POST /predict_letter` - Predict sign language letter
- `POST /clear_text` - Clear accumulated text

## 🎨 Customization

### Adding New Sign Language Gestures
1. Add new animation functions in `frontend/src/signkit/Animations/`
2. Update the alphabet mapping in `frontend/src/signkit/utils/textToSigns.ts`
3. Retrain the model with new data

### Styling Customization
- Modify `frontend/src/index.css` for global styles
- Update component-specific styles in individual `.tsx` files
- Customize color schemes in Tailwind configuration

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm run test
```

### Backend Testing
```bash
cd backend
npm test
```

### AI Model Testing
```bash
cd meet-it
python test_model.py
```

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy the dist/ folder
```

### Backend Deployment (Heroku/Railway)
```bash
cd backend
# Configure production environment variables
# Deploy using your preferred platform
```

### AI Backend Deployment (Railway/Google Cloud)
```bash
cd meet-it
# Install production dependencies
# Configure environment variables
# Deploy using your preferred platform
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **ASL Community** for sign language resources
- **Three.js** for 3D graphics capabilities
- **TensorFlow** for machine learning framework
- **OpenCV** for computer vision tools

## 📞 Support

For support, email support@gestura.com or join our Discord community.

## 🔮 Roadmap

- [ ] Support for multiple sign languages
- [ ] Mobile app development
- [ ] Advanced gesture recognition
- [ ] Real-time collaboration features
- [ ] Integration with video conferencing platforms

## 📈 Performance Metrics

- **Accuracy**: 85%+ for common gestures
- **Latency**: <200ms for real-time translation
- **Uptime**: 99.9% availability
- **Support**: 50+ sign language gestures

---

**Made with ❤️ for the deaf and hard-of-hearing community**