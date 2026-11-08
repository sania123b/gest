import React, { useEffect, useRef, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { VideoIcon, MicIcon, MicOffIcon, VideoOffIcon, PhoneIcon, MessageSquareIcon, SettingsIcon, SparklesIcon } from 'lucide-react';
import ModuleInstructions from '../components/ModuleInstructions';
import { AvatarCanvas, SpeechController } from '../signkit';
import type { AvatarCanvasHandle } from '../signkit';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { defaultPose } from '../signkit/Animations/defaultPose.js';
// Web-optimized copy of TPose.glb: 2048px textures, matte materials (~10 MB instead of 63 MB)
import humanAvatar from '../signkit/Models/TPose/TPose_web.glb';
import axios from 'axios';
const MeetIt = () => {
  const navigate = useNavigate();
  return <Routes>
      <Route path="/" element={<MeetingRoom />} />
    </Routes>;
};
const MeetingRoom = () => {
  const navigate = useNavigate();
  const avatarRef = useRef<AvatarCanvasHandle | null>(null);
  const [mode, setMode] = useState<'sign-to-text' | 'audio-to-sign'>('sign-to-text');
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);
  const [segments, setSegments] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [activeProgress, setActiveProgress] = useState<number>(0);
  const selfVideoRef = useRef<HTMLVideoElement | null>(null);
  const selfStreamRef = useRef<MediaStream | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  
  // Sign-to-text state
  const [signText, setSignText] = useState<string>('');
  const [currentLetter, setCurrentLetter] = useState<string>('');
  const [isSignDetecting, setIsSignDetecting] = useState<boolean>(false);
  const [signConfidence, setSignConfidence] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sign-to-text functions
  const captureFrame = () => {
    if (!selfVideoRef.current || !canvasRef.current) return null;
    
    const video = selfVideoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;
    
    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Flip the image horizontally for better user experience
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    ctx.restore();
    
    // Convert canvas to blob
    return new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 0.8);
    });
  };

  const predictSign = async () => {
    try {
      const frameBlob = await captureFrame();
      if (!frameBlob) return;

      const formData = new FormData();
      formData.append('file', frameBlob, 'frame.jpg');

      const response = await axios.post('http://localhost:8000/predict_letter', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

          const { letter, confidence, accumulated_text } = response.data;
          
          if (letter) { // Display all detected letters for debugging
            setCurrentLetter(letter);
            setSignConfidence(confidence);
            
            // Use accumulated text from backend state management
            if (accumulated_text !== undefined) {
              setSignText(accumulated_text);
            }
          }
    } catch (error) {
      console.error('Error predicting sign:', error);
    }
  };

  const startSignDetection = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    setIsSignDetecting(true);
    intervalRef.current = setInterval(predictSign, 300); // Check every 300ms for faster response
  };

  const stopSignDetection = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsSignDetecting(false);
    setCurrentLetter('');
    setSignConfidence(0);
  };

  const clearSignText = async () => {
    try {
      await axios.post('http://localhost:8000/clear_text');
      setSignText('');
      setCurrentLetter('');
      setSignConfidence(0);
    } catch (error) {
      console.error('Error clearing text:', error);
      // Fallback to local clear
      setSignText('');
      setCurrentLetter('');
      setSignConfidence(0);
    }
  };

  const requestCamera = React.useCallback(async () => {
    try {
      if (selfStreamRef.current) {
        selfStreamRef.current.getTracks().forEach(t => t.stop());
        selfStreamRef.current = null;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640, max: 1280 },
          height: { ideal: 360, max: 720 },
          frameRate: { ideal: 24, max: 30 },
          facingMode: 'user'
        },
        audio: false
      });
      selfStreamRef.current = stream;
      if (selfVideoRef.current) {
        selfVideoRef.current.srcObject = stream;
        await selfVideoRef.current.play().catch(() => {});
      }
      setVideoError(null);
    } catch (err: any) {
      console.error('Error accessing webcam:', err);
      let message = 'Unable to access camera';
      if (err?.name === 'NotAllowedError') message = 'Camera permission denied. Allow access in your browser.';
      if (err?.name === 'NotFoundError') message = 'No camera device found.';
      if (err?.name === 'NotReadableError') message = 'Camera is in use by another application.';
      setVideoError(message);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const setup = async () => {
      if (showInstructions || !videoEnabled) {
        if (selfStreamRef.current) {
          selfStreamRef.current.getTracks().forEach(t => t.stop());
          selfStreamRef.current = null;
        }
        if (selfVideoRef.current) {
          selfVideoRef.current.srcObject = null;
        }
        setVideoError(null);
        return;
      }
      if (selfStreamRef.current) return; // already set
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640, max: 1280 },
            height: { ideal: 360, max: 720 },
            frameRate: { ideal: 24, max: 30 },
            facingMode: 'user'
          },
          audio: false
        });
        if (cancelled) return;
        selfStreamRef.current = stream;
        if (selfVideoRef.current) {
          selfVideoRef.current.srcObject = stream;
          await selfVideoRef.current.play().catch(() => {});
        }
        setVideoError(null);
      } catch (err: any) {
        console.error('Error accessing webcam:', err);
        let message = 'Unable to access camera';
        if (err?.name === 'NotAllowedError') message = 'Camera permission denied. Allow access in your browser.';
        if (err?.name === 'NotFoundError') message = 'No camera device found.';
        if (err?.name === 'NotReadableError') message = 'Camera is in use by another application.';
        setVideoError(message);
      }
    };
    setup();
    return () => {
      cancelled = true;
      if (selfStreamRef.current) {
        selfStreamRef.current.getTracks().forEach(t => t.stop());
        selfStreamRef.current = null;
      }
      // Clean up sign detection
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [videoEnabled, showInstructions]);

  // Clean up sign detection when component unmounts
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  return <div className="w-full overflow-x-hidden">
      {/* Header Section */}
      <section className="relative py-16 px-6 bg-gradient-to-br from-blue-400/80 via-cyan-300/70 to-blue-300/80 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-cyan-400/20 blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-blue-300/20 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-300/10 blur-3xl"></div>
        </div>
        <div className="relative max-w-6xl mx-auto">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5
        }} className="text-center mb-8">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: 0.1
          }} className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
              <span className="text-sm font-medium text-gray-800">
                Real-Time Communication
              </span>
            </motion.div>
            <motion.h1 initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: 0.2
          }} className="text-4xl sm:text-5xl font-bold mb-6 text-gray-800">
              MeetIT -{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">
                Virtual Meeting Room
              </span>
            </motion.h1>
            <motion.p initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: 0.3
          }} className="text-xl text-gray-700 max-w-2xl mx-auto">
              Real-time communication with sign language translation
            </motion.p>
          </motion.div>
        </div>
      </section>
      {showInstructions && <div className="bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-6">
            <ModuleInstructions title="How MeetIT Works" description="MeetIT is an online meeting platform with dynamic speech-to-sign and sign-to-speech conversion, enabling fully bidirectional, real-time communication." features={['Deaf users can sign naturally, and the AI translates it into audio for others', 'Hearing users speak normally, and the AI converts it into sign language', 'Reduces reliance on human interpreters for meetings and conversations', 'Enables seamless communication between hearing and non-hearing participants']} colorGradient="from-cyan-300 to-blue-300" />
            <div className="flex justify-center">
              <motion.button whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.98
          }} onClick={() => setShowInstructions(false)} className="px-5 py-3 bg-gradient-to-r from-cyan-300 to-blue-300 text-gray-800 font-medium rounded-xl transition-colors shadow-lg shadow-blue-500/20">
                Continue to Meeting Room
              </motion.button>
            </div>
          </div>
        </div>}
      {!showInstructions && <section className="relative py-12 px-6 bg-gray-50/70 overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full">
              {[...Array(10)].map((_, i) => <div key={i} className="absolute rounded-full bg-blue-300/30" style={{
            width: `${Math.random() * 300 + 50}px`,
            height: `${Math.random() * 300 + 50}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.3,
            filter: `blur(${Math.random() * 50 + 10}px)`
          }} />)}
            </div>
          </div>
          <div className="relative max-w-6xl mx-auto">
            {/* Main meeting area - Changed to grid layout for side-by-side */}
            <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8
        }} className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Video grid - Takes 2/5 of the width */}
              <div className="lg:col-span-2 relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-300/70 to-cyan-300/70 rounded-2xl blur-sm opacity-50"></div>
                <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 shadow-xl h-full flex flex-col">
                  <div className="grid grid-cols-2 gap-1 p-1 flex-grow">
                    <motion.div initial={{
                  opacity: 0,
                  scale: 0.95
                }} animate={{
                  opacity: 1,
                  scale: 1
                }} transition={{
                  duration: 0.5,
                  delay: 0.4
                }} className="relative bg-gray-800 rounded-lg overflow-hidden">
                      <div className="absolute inset-0">
                        <video ref={selfVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                        {!videoEnabled && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-sm">Video Off</div>
                        )}
                        {videoEnabled && videoError && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white text-sm p-3 gap-2">
                            <div>{videoError}</div>
                            <button className="px-3 py-1 rounded bg-white/20 hover:bg-white/30" onClick={requestCamera}>Retry</button>
                          </div>
                        )}
                      </div>
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-sm rounded">
                        You
                      </div>
                    </motion.div>
                    <motion.div initial={{
                  opacity: 0,
                  scale: 0.95
                }} animate={{
                  opacity: 1,
                  scale: 1
                }} transition={{
                  duration: 0.5,
                  delay: 0.5
                }} className="relative bg-gray-800 rounded-lg overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div whileHover={{
                      scale: 1.1
                    }} className="w-20 h-20 rounded-full bg-blue-500/80 flex items-center justify-center text-2xl text-white font-semibold shadow-lg shadow-blue-900/30">
                          JD
                        </motion.div>
                      </div>
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-sm rounded">
                        John Doe
                      </div>
                    </motion.div>
                    <motion.div initial={{
                  opacity: 0,
                  scale: 0.95
                }} animate={{
                  opacity: 1,
                  scale: 1
                }} transition={{
                  duration: 0.5,
                  delay: 0.6
                }} className="relative bg-gray-800 rounded-lg overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div whileHover={{
                      scale: 1.1
                    }} className="w-20 h-20 rounded-full bg-green-500/80 flex items-center justify-center text-2xl text-white font-semibold shadow-lg shadow-green-900/30">
                          AS
                        </motion.div>
                      </div>
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-sm rounded">
                        Alice Smith
                      </div>
                    </motion.div>
                    <motion.div initial={{
                  opacity: 0,
                  scale: 0.95
                }} animate={{
                  opacity: 1,
                  scale: 1
                }} transition={{
                  duration: 0.5,
                  delay: 0.7
                }} className="relative bg-gray-800 rounded-lg overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div whileHover={{
                      scale: 1.1
                    }} className="w-20 h-20 rounded-full bg-yellow-500/80 flex items-center justify-center text-2xl text-white font-semibold shadow-lg shadow-yellow-900/30">
                          RJ
                        </motion.div>
                      </div>
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-sm rounded">
                        Robert Johnson
                      </div>
                    </motion.div>
                  </div>
                  {/* Meeting controls */}
                  <div className="bg-gray-800/80 backdrop-blur-sm p-4 flex items-center justify-center space-x-4">
                    <motion.button whileHover={{
                  scale: 1.1
                }} whileTap={{
                  scale: 0.9
                }} onClick={() => setMicEnabled(!micEnabled)} className={`w-10 h-10 rounded-full flex items-center justify-center ${micEnabled ? 'bg-gray-700/90 hover:bg-gray-600/90' : 'bg-red-500/90 hover:bg-red-600/90'} transition-colors shadow-lg`}>
                      {micEnabled ? <MicIcon size={18} className="text-white" /> : <MicOffIcon size={18} className="text-white" />}
                    </motion.button>
                    <motion.button whileHover={{
                  scale: 1.1
                }} whileTap={{
                  scale: 0.9
                }} onClick={() => setVideoEnabled(!videoEnabled)} className={`w-10 h-10 rounded-full flex items-center justify-center ${videoEnabled ? 'bg-gray-700/90 hover:bg-gray-600/90' : 'bg-red-500/90 hover:bg-red-600/90'} transition-colors shadow-lg`}>
                      {videoEnabled ? <VideoIcon size={18} className="text-white" /> : <VideoOffIcon size={18} className="text-white" />}
                    </motion.button>
                    <motion.button whileHover={{
                  scale: 1.1
                }} whileTap={{
                  scale: 0.9
                }} className="w-12 h-12 rounded-full bg-red-500/90 hover:bg-red-600/90 flex items-center justify-center transition-colors shadow-lg">
                      <PhoneIcon size={20} className="text-white" />
                    </motion.button>
                    <motion.button whileHover={{
                  scale: 1.1
                }} whileTap={{
                  scale: 0.9
                }} className="w-10 h-10 rounded-full bg-gray-700/90 hover:bg-gray-600/90 flex items-center justify-center transition-colors shadow-lg">
                      <MessageSquareIcon size={18} className="text-white" />
                    </motion.button>
                    <motion.button whileHover={{
                  scale: 1.1
                }} whileTap={{
                  scale: 0.9
                }} className="w-10 h-10 rounded-full bg-gray-700/90 hover:bg-gray-600/90 flex items-center justify-center transition-colors shadow-lg">
                      <SettingsIcon size={18} className="text-white" />
                    </motion.button>
                  </div>
                </div>
              </div>
              {/* Translation area - Takes 2/5 of the width */}
              <motion.div initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.8,
            delay: 0.4
          }} className="lg:col-span-3 relative h-full">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-200/70 to-cyan-200/70 rounded-2xl blur-sm opacity-50"></div>
                <div className="relative bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-blue-100 p-6 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-blue-800">
                      {mode === 'sign-to-text' ? 'Sign Language to Text' : 'Audio to Sign Language'}
                    </h2>
                    <div className="flex bg-blue-50 rounded-lg p-0.5">
                      <motion.button whileHover={{
                    scale: 1.05
                  }} onClick={() => setMode('sign-to-text')} className={`px-3 py-1.5 text-sm rounded-md transition-colors ${mode === 'sign-to-text' ? 'bg-white shadow-md text-blue-700' : 'text-blue-600 hover:text-blue-800'}`}>
                        Sign to Text
                      </motion.button>
                      <motion.button whileHover={{
                    scale: 1.05
                  }} onClick={() => setMode('audio-to-sign')} className={`px-3 py-1.5 text-sm rounded-md transition-colors ${mode === 'audio-to-sign' ? 'bg-white shadow-md text-blue-700' : 'text-blue-600 hover:text-blue-800'}`}>
                        Audio to Sign
                      </motion.button>
                    </div>
                  </div>
                  {mode === 'sign-to-text' ? <div className="bg-gradient-to-br from-gray-50 to-blue-50/70 rounded-lg p-4 flex-grow flex flex-col border border-blue-100 shadow-inner">
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-3">
                         
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={isSignDetecting ? stopSignDetection : startSignDetection}
                              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                                isSignDetecting 
                                  ? 'bg-red-500 text-white hover:bg-red-600' 
                                  : 'bg-green-500 text-white hover:bg-green-600'
                              }`}
                            >
                              {isSignDetecting ? 'Stop Detection' : 'Start Detection'}
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={clearSignText}
                              className="px-3 py-1.5 text-sm rounded-md bg-gray-500 text-white hover:bg-gray-600 transition-colors"
                            >
                              Clear
                            </motion.button>
                          </div>
                        </div>
                        
                        {/* Current detection status */}
                        {isSignDetecting && (
                          <div className="mb-3 p-2 bg-blue-100 rounded-lg">
                            <div className="flex items-center gap-2 text-sm text-blue-800">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span>Detecting signs...</span>
                              {currentLetter && (
                                <span className="ml-2 font-semibold">
                                  Current: {currentLetter} ({signConfidence.toFixed(1)}%)
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Text output area */}
                      <div className="flex-1 bg-white rounded-lg p-4 border border-blue-200 min-h-[200px]">
                        <div className="text-sm text-gray-600 mb-2">Translated Text:</div>
                        <div className="text-lg text-gray-800 whitespace-pre-wrap break-words min-h-[150px]">
                          {signText || 'Start sign detection to see translated text here...'}
                        </div>
                      </div>
                      
                      {/* Hidden canvas for frame capture */}
                      <canvas ref={canvasRef} className="hidden" />
                    </div> : <div className="bg-gradient-to-br from-gray-50 to-blue-50/70 rounded-lg p-4 flex-grow flex flex-col items-stretch justify-start border border-blue-100 shadow-inner">
                      <div className="mb-3 text-sm text-blue-800 font-medium">Audio to Sign - live</div>
                      {/* Avatar - full panel width, tall fixed height */}
                      <div className="relative rounded-lg overflow-hidden bg-white/60 border border-blue-100" style={{ height: '520px' }}>
                        <div className="absolute inset-0">
                          <AvatarCanvas
                            ref={avatarRef}
                            initialModelUrl={humanAvatar}
                            defaultPose={defaultPose}
                            className="w-full h-full"
                            onAddText={(t) => {
                              const clean = String(t).trim();
                              if (!clean) return;
                              setSegments((prev) => [...prev, clean]);
                              setActiveIndex((idx) => (idx === -1 ? 0 : idx));
                            }}
                            onSegmentEnd={() => {
                              setActiveIndex((idx) => Math.min((idx < 0 ? 0 : idx) + 1, segments.length));
                              setActiveProgress(1);
                            }}
                            onSegmentProgress={(p) => setActiveProgress(p)}
                          />
                        </div>
                      </div>
                      {/* Transcript strip below avatar */}
                      <div className="mt-3 bg-white/80 rounded-lg border border-blue-100 p-3 overflow-auto max-h-[130px]">
                        <div className="text-xs text-blue-800 mb-1 font-semibold">Transcript</div>
                        <div className="px-3 py-2 rounded-md text-sm bg-blue-50 text-blue-900 whitespace-pre-wrap break-words mb-2">
                          {liveTranscript || 'Speak to start transcript…'}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {segments.map((seg, i) => (
                            <span key={i} className="px-2 py-1 rounded-md text-sm bg-gray-200 text-gray-700">
                              {seg.toLowerCase()}
                            </span>
                          ))}
                        </div>
                      </div>
                      <SpeechController avatarRef={avatarRef} micEnabled={micEnabled} onTranscriptUpdate={setLiveTranscript} />
                    </div>}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>}
    </div>;
};
export default MeetIt;