import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CameraIcon, CheckIcon, RefreshCwIcon, SparklesIcon, ZapIcon, ListIcon } from 'lucide-react';
import axios from 'axios';
import ModuleInstructions from '../components/ModuleInstructions';

// Import alphabet videos using dynamic imports
import videoA from '../utils/a.mp4';
import videoB from '../utils/b - Made with Clipchamp.mp4';
import videoC from '../utils/c - Made with Clipchamp.mp4';
import videoD from '../utils/d - Made with Clipchamp.mp4';
import videoE from '../utils/e - Made with Clipchamp.mp4';
import videoF from '../utils/f - Made with Clipchamp.mp4';
import videoG from '../utils/g - Made with Clipchamp.mp4';
import videoH from '../utils/h - Made with Clipchamp.mp4';
import videoI from '../utils/i - Made with Clipchamp.mp4';
import videoJ from '../utils/j - Made with Clipchamp.mp4';
import videoK from '../utils/k - Made with Clipchamp.mp4';
import videoL from '../utils/l - Made with Clipchamp.mp4';
import videoM from '../utils/m - Made with Clipchamp.mp4';
import videoN from '../utils/n - Made with Clipchamp.mp4';
import videoO from '../utils/o - Made with Clipchamp.mp4';
import videoP from '../utils/p - Made with Clipchamp.mp4';
import videoQ from '../utils/q - Made with Clipchamp.mp4';
import videoR from '../utils/r - Made with Clipchamp.mp4';
import videoS from '../utils/s - Made with Clipchamp.mp4';
import videoT from '../utils/t - Made with Clipchamp.mp4';
import videoU from '../utils/u - Made with Clipchamp.mp4';
import videoV from '../utils/v - Made with Clipchamp.mp4';
import videoW from '../utils/w - Made with Clipchamp.mp4';
import videoX from '../utils/x - Made with Clipchamp.mp4';
import videoY from '../utils/y - Made with Clipchamp.mp4';
import videoZ from '../utils/z - Made with Clipchamp.mp4';

// Create alphabet videos object
const alphabetVideos = {
  'A': videoA,
  'B': videoB,
  'C': videoC,
  'D': videoD,
  'E': videoE,
  'F': videoF,
  'G': videoG,
  'H': videoH,
  'I': videoI,
  'J': videoJ,
  'K': videoK,
  'L': videoL,
  'M': videoM,
  'N': videoN,
  'O': videoO,
  'P': videoP,
  'Q': videoQ,
  'R': videoR,
  'S': videoS,
  'T': videoT,
  'U': videoU,
  'V': videoV,
  'W': videoW,
  'X': videoX,
  'Y': videoY,
  'Z': videoZ,
};

// ASL Alphabet Tips
const alphabetTips = {
  'A': [
    'Make a fist with your thumb resting alongside the index finger—not tucked in.',
    'Keep your palm facing outward.',
    'Avoid curling your fingers too tightly; the thumb should be visible.'
  ],
  'B': [
    'Extend your four fingers straight up together.',
    'Fold your thumb across your palm (it should lie flat below your fingers).',
    'Keep your wrist straight and palm facing forward.'
  ],
  'C': [
    'Curve your fingers and thumb to form a "C" shape, like holding a small cup.',
    'The opening faces to the side.',
    'Maintain even spacing between thumb and fingers.'
  ],
  'D': [
    'Touch the tip of your thumb and middle finger together to form a circle.',
    'Point your index finger straight up—this makes the "D" outline.',
    'Other fingers stay curled in toward your palm.'
  ],
  'E': [
    'Curl your fingers slightly so the tips touch your thumb.',
    'Don\'t squeeze tight—think "gentle bend."',
    'Keep your palm facing forward.'
  ],
  'F': [
    'Touch the tip of your thumb and index finger together to form a small circle.',
    'The other three fingers are raised and spread slightly.',
    'Keep the circle visible from the front.'
  ],
  'G': [
    'Hold your index finger and thumb parallel, about an inch apart—like showing a small gap.',
    'Palm faces sideways.',
    'Keep the remaining fingers curled down loosely.'
  ],
  'H': [
    'Extend your index and middle fingers together, side by side.',
    'Thumb holds the other fingers down.',
    'Palm faces sideways, with fingertips pointing outward.'
  ],
  'I': [
    'Raise your pinky finger straight up; curl the others down into a fist.',
    'Palm faces outward.',
    'Make sure the pinky stands tall and not bent.'
  ],
  'J': [
    'Start with the "I" handshape (pinky up).',
    'Trace the letter "J" in the air with your pinky.',
    'The motion should curve down and then up smoothly.'
  ],
  'K': [
    'Raise your index and middle fingers like a peace sign.',
    'Place your thumb between them, touching the base of the middle finger.',
    'Palm faces forward; keep fingers firm, not floppy.'
  ],
  'L': [
    'Extend your thumb and index finger to make an "L" shape.',
    'Other fingers stay closed.',
    'Palm faces outward clearly so the shape is visible.'
  ],
  'M': [
    'Rest your thumb under your top three fingers (index, middle, ring).',
    'The pinky stays out of the way, resting alongside.',
    'You should see three finger bumps above your thumb.'
  ],
  'N': [
    'Similar to "M," but tuck the thumb under only two fingers (index and middle).',
    'Keep ring and pinky resting down.',
    'Two bumps visible = "N."'
  ],
  'O': [
    'Touch your fingers and thumb tips together to form an "O."',
    'Palm faces forward.',
    'Keep the circle round, not squished.'
  ],
  'P': [
    'Start like "K" (index and middle up, thumb in between).',
    'Tilt your hand downward so the index finger points forward and down.',
    'It looks like an upside-down "K."'
  ],
  'Q': [
    'Start with "G" handshape (index and thumb parallel).',
    'Turn the hand downward so the index points down.',
    'Keep spacing the same as "G."'
  ],
  'R': [
    'Cross your middle finger over your index finger.',
    'Keep them straight and pressed gently together.',
    'Palm faces forward; don\'t twist sideways.'
  ],
  'S': [
    'Make a fist with the thumb crossing in front of your fingers.',
    'Palm faces outward.',
    'Keep it firm, not clenched.'
  ],
  'T': [
    'Make a fist, but place your thumb between the index and middle finger.',
    'Palm faces outward.',
    'Ensure thumb tip sticks out slightly—not hidden.'
  ],
  'U': [
    'Raise your index and middle fingers together (side by side).',
    'Thumb holds the other fingers down.',
    'Palm faces forward, fingers close—not in a "V" shape.'
  ],
  'V': [
    'Same as "U" but spread the two fingers apart into a "V."',
    'Palm forward.',
    'Keep fingers straight and slightly tense.'
  ],
  'W': [
    'Raise your index, middle, and ring fingers.',
    'Keep them spread into a "W" shape.',
    'Thumb and pinky are tucked in.'
  ],
  'X': [
    'Curl your index finger into a hook shape.',
    'Thumb rests against the side of the fist.',
    'Palm faces forward.'
  ],
  'Y': [
    'Extend your thumb and pinky while keeping other fingers closed.',
    'Palm faces sideways, like a "hang loose" gesture.',
    'Don\'t over-stretch; keep it relaxed.'
  ],
  'Z': [
    'Raise your index finger.',
    'Draw a "Z" shape in the air—left to right, diagonal down, back left.',
    'Keep your wrist loose and the motion quick but clear.'
  ]
};

const LearnIt = () => {
  const [showInstructions, setShowInstructions] = useState(true);
  const [selectedWord, setSelectedWord] = useState('Hello');
  const [showPractice, setShowPractice] = useState(false);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<Blob | null>(null);
  const [showEvaluateButton, setShowEvaluateButton] = useState(false);
  const [countdown, setCountdown] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  
  // Create alphabet array
  const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

  // Set up camera when practice mode is enabled
  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      if (!showPractice) return;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: { ideal: 640 }, height: { ideal: 360 }, frameRate: { ideal: 24, max: 30 } }, 
          audio: false 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
      } catch (e) {
        console.error('Camera error:', e);
      }
    };
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [showPractice]);

  const handleCheckAccuracy = async () => {
    console.log('[Check Accuracy] Button clicked');
    
    if (!showPractice) {
      setShowPractice(true);
      return;
    }

    if (!videoRef.current) {
      console.log('[Check Accuracy] videoRef missing');
      return;
    }

    setAccuracy(null);
    setIsMeasuring(true);
    setIsRecording(true);
    setShowEvaluateButton(false);

    try {
      const stream = videoRef.current.srcObject as MediaStream;
      const chunks: Blob[] = [];
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setRecordedVideo(blob);
        setShowEvaluateButton(true);
        setIsRecording(false);
        setIsMeasuring(false);
      };
      
      mediaRecorder.start();
      console.log('Started recording...');
      
      // Start countdown
      let timeLeft = 5;
      const timer = setInterval(() => {
        timeLeft--;
        setCountdown(timeLeft);
        
        if (timeLeft === 0) {
          clearInterval(timer);
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
          }
        }
      }, 1000);
      
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
      }, 5000);
      
    } catch (error) {
      console.error('[Check Accuracy] Error recording video:', error);
      setIsMeasuring(false);
      setIsRecording(false);
    }
  };

  const handleEvaluate = async () => {
    console.log('[Evaluate] Starting evaluation...');
    if (!recordedVideo) {
      console.error('No recorded video available');
      return;
    }

    setIsMeasuring(true);
    setAccuracy(null);

    try {
      const formData = new FormData();
      formData.append('file', recordedVideo, 'video.webm');

      console.log('[Evaluate] Sending request to backend...');
      const response = await axios.post('http://localhost:8000/evaluate_video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('[Evaluate] Response received:', response.data);
      if (response.data && typeof response.data.accuracy === 'number') {
        console.log('[Evaluate] Setting accuracy:', response.data.accuracy);
        setAccuracy(response.data.accuracy);
      } else {
        console.log('[Evaluate] Invalid response data:', response.data);
        setAccuracy(0); // No hand detected
      }
    } catch (error) {
      console.error('Error evaluating video:', error);
      setAccuracy(0); // Error case
    } finally {
      setIsMeasuring(false);
      setShowEvaluateButton(false);
    }
  };

  return (
    <div className="w-full overflow-x-hidden">
      {/* Header Section */}
      <section className="relative py-16 px-6 bg-gradient-to-br from-amber-400/80 via-orange-300/70 to-amber-200/80 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-orange-300/20 blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-amber-300/20 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-amber-300/10 blur-3xl"></div>
        </div>
        <div className="relative max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
            >
              <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
              <span className="text-sm font-medium text-gray-800">
                Interactive Learning
              </span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl sm:text-5xl font-bold mb-6 text-gray-800"
            >
              LearnIT -{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
                Sign Language Learning
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-xl text-gray-700 max-w-2xl mx-auto"
            >
              Learn and practice sign language with real-time feedback
            </motion.p>
          </motion.div>
        </div>
      </section>

      {showInstructions && (
        <div className="bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-6">
            <ModuleInstructions 
              title="How LearnIT Works" 
              description="LearnIT is an interactive sign language learning platform that helps you learn and practice sign language with real-time feedback." 
              features={[
                'Type any word or phrase and see the AI avatar perform the corresponding sign',
                '"Try it Yourself" feature lets you practice in front of a camera with real-time accuracy feedback',
                'Learn common words and phrases with our curated library of sign language examples',
                'Makes learning sign language fun, interactive, and accessible to everyone'
              ]} 
              colorGradient="from-amber-500 to-orange-500" 
            />
            <div className="flex justify-center">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowInstructions(false)}
                className="px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-gray-800 font-medium rounded-xl transition-colors shadow-lg shadow-amber-500/20"
              >
                Continue to Learning Platform
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {!showInstructions && (
        <section className="relative py-12 px-6 bg-gray-50 overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-20">
            <svg className="absolute left-0 top-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="rgba(245, 158, 11, 0.2)" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots)" />
            </svg>
          </div>
          <div className="relative max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Word selection - 1/3 width on large screens */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-300/70 to-orange-300/70 rounded-2xl blur-sm opacity-50"></div>
                <div className="relative bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-amber-100 p-6">
                  <h2 className="text-xl font-semibold mb-5 text-amber-800 flex items-center">
                    <ListIcon size={20} className="mr-2 text-amber-600" />
                    Basics
                  </h2>
                  <div className="mb-5">
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Search for a word or phrase..." 
                        className="w-full px-4 py-3 pr-10 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white/70" 
                      />
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-3 top-3.5 text-gray-400">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                    </div>
                  </div>
                  
                  {/* Alphabet Section */}
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-amber-700 mb-2">Alphabet (A-Z)</h3>
                    <div className="grid grid-cols-6 gap-1 mb-4">
                      {alphabet.map((letter, index) => (
                        <motion.button
                          key={letter}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 + index * 0.02 }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedWord(letter);
                            setAccuracy(null);
                            setShowPractice(false);
                          }}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center ${
                            selectedWord === letter
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20'
                              : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          }`}
                        >
                          {letter}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Tips section - moved below alphabets */}
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="relative"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-300/40 to-orange-300/40 rounded-2xl blur-sm opacity-50"></div>
                    <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-xl border border-amber-100 p-6">
                      <h2 className="text-xl font-semibold mb-5 text-amber-800 flex items-center">
                        <ZapIcon size={20} className="mr-2 text-amber-600" />
                        Tips for "{selectedWord}"
                      </h2>
                      <div className="space-y-4">
                        {(() => {
                          // Get tips based on selection
                          const tips = selectedWord.length === 1 && alphabetTips[selectedWord as keyof typeof alphabetTips] 
                            ? alphabetTips[selectedWord as keyof typeof alphabetTips]
                            : [
                                'Position your hand in front of your chest, palm facing forward.',
                                'Touch your fingers to your forehead and move outward in a slight arc.',
                                'Make sure your movement is smooth and natural, not stiff.',
                                'Practice the sign while looking in a mirror to see how it looks.'
                              ];
                          
                          return tips.map((tip, index) => (
                            <motion.div 
                              key={index} 
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.5 + index * 0.1 }}
                              className="flex items-start"
                            >
                              <motion.div 
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-semibold mr-3 mt-0.5 shadow-md"
                              >
                                {index + 1}
                              </motion.div>
                              <p className="text-gray-700 pt-1">{tip}</p>
                            </motion.div>
                          ));
                        })()}
                      </div>
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="mt-6 pt-6 border-t border-amber-200"
                      >
                        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-amber-100 shadow-sm">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-3">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="16" x2="12" y2="12"></line>
                                <line x1="12" y1="8" x2="12.01" y2="8"></line>
                              </svg>
                            </div>
                            <p className="text-amber-800 font-medium">
                              Did you know? Sign languages vary by region and
                              country, just like spoken languages!
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
              
              {/* Avatar video and practice area - 2/3 width on large screens */}
              <div className="lg:col-span-2 space-y-6">
                {/* Learning section */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="relative"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-300/70 to-orange-300/70 rounded-2xl blur-sm opacity-50"></div>
                  <div className="relative bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-amber-100 p-6">
                    <div className="flex items-center justify-between mb-5">
                      <h2 className="text-xl font-semibold text-amber-800 flex items-center">
                        <SparklesIcon size={20} className="mr-2 text-amber-600" />
                        Learning:{' '}
                        <span className="ml-2 text-gray-800 bg-amber-50 px-3 py-1 rounded-lg">
                          {selectedWord}
                        </span>
                      </h2>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowPractice(!showPractice)}
                        className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium rounded-xl transition-colors flex items-center shadow-lg shadow-amber-500/20"
                      >
                        {showPractice ? (
                          <>
                            <RefreshCwIcon size={16} className="mr-2" />
                            Watch Demo
                          </>
                        ) : (
                          <>
                            <CameraIcon size={16} className="mr-2" />
                            Practice
                          </>
                        )}
                      </motion.button>
                    </div>
                    
                    {!showPractice ? (
                      <div className="max-w-xl mx-auto aspect-video bg-gradient-to-br from-amber-50/80 to-orange-50/80 rounded-xl flex items-center justify-center border border-amber-100 shadow-inner overflow-hidden">
                        {/* Show actual sign language video if it's an alphabet letter */}
                        {selectedWord.length === 1 && alphabetVideos[selectedWord as keyof typeof alphabetVideos] ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="w-full h-full relative"
                          >
                            <video
                              key={selectedWord}
                              className="w-full h-full object-cover rounded-xl"
                              controls
                              autoPlay
                              loop
                              muted
                              src={alphabetVideos[selectedWord as keyof typeof alphabetVideos]}
                            >
                              Your browser does not support the video tag.
                            </video>
                            <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                              Letter: {selectedWord}
                            </div>
                          </motion.div>
                        ) : (
                          <div className="text-center">
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                              className="relative"
                            >
                              <motion.div 
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-full blur-xl"
                              />
                              <div className="w-32 h-32 bg-amber-100/80 rounded-full mx-auto mb-4 flex items-center justify-center relative">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                                  <path d="M23 7l-7 5 7 5V7z"></path>
                                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                                </svg>
                              </div>
                            </motion.div>
                            <p className="text-gray-700 font-medium">
                              Sign language demonstration for "{selectedWord}"
                            </p>
                            <p className="text-gray-500 text-sm mt-1">
                              {selectedWord.length === 1 ? 'Watch the alphabet sign' : 'Watch carefully and practice the movements'}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-5">
                        <div className="max-w-xl mx-auto aspect-video bg-gradient-to-br from-amber-50/80 to-orange-50/80 rounded-xl flex items-center justify-center border border-amber-100 shadow-inner overflow-hidden">
                          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                        </div>
                        
                        {isMeasuring ? (
                          <div className="text-center">
                            <div className="inline-flex items-center gap-3 px-4 py-2 bg-amber-50 rounded-xl border border-amber-200 text-amber-800">
                              <span className="w-3 h-3 rounded-full bg-amber-400 animate-pulse"></span>
                              {isRecording ? `Recording... ${countdown}s` : 'Processing video...'}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center text-sm text-gray-600">
                            {showPractice ? 'Click "Record Sign" and hold the sign steady for 5 seconds.' : 'Click "Practice" to enable camera.'}
                          </div>
                        )}
                        
                        <div className="flex justify-center">
                          <div className="flex gap-4">
                            <motion.button 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleCheckAccuracy}
                              disabled={isMeasuring || showEvaluateButton}
                              className="px-5 py-3 bg-gradient-to-r from-amber-500/80 to-orange-500/80 hover:from-amber-600/80 hover:to-orange-600/80 text-white font-medium rounded-xl transition-colors flex items-center shadow-lg shadow-amber-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                              {isRecording ? (
                                <>
                                  <CameraIcon size={18} className="mr-2" />
                                  Recording... {countdown}s
                                </>
                              ) : (
                                <>
                                  <CheckIcon size={18} className="mr-2" />
                                  Record Sign (5s)
                                </>
                              )}
                            </motion.button>

                            {showEvaluateButton && (
                              <motion.button
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleEvaluate}
                                disabled={isMeasuring}
                                className="px-5 py-3 bg-gradient-to-r from-green-500/80 to-emerald-500/80 hover:from-green-600/80 hover:to-emerald-600/80 text-white font-medium rounded-xl transition-colors flex items-center shadow-lg shadow-green-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
                              >
                                <SparklesIcon size={18} className="mr-2" />
                                Evaluate
                              </motion.button>
                            )}
                          </div>
                        </div>
                        
                        {accuracy !== null && (
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ type: 'spring', damping: 20 }}
                            className="bg-white rounded-xl border border-amber-100 p-6 text-center shadow-md"
                          >
                            <h3 className="text-lg font-semibold mb-4 text-amber-800">
                              Your Accuracy
                            </h3>
                            <div className="w-32 h-32 mx-auto relative">
                              <svg viewBox="0 0 100 100" className="w-full h-full">
                                <circle cx="50" cy="50" r="45" fill="none" stroke="#E2E8F0" strokeWidth="10" />
                                <motion.circle 
                                  cx="50" 
                                  cy="50" 
                                  r="45" 
                                  fill="none" 
                                  stroke={accuracy >= 90 ? '#48BB78' : accuracy >= 70 ? '#4299E1' : '#F56565'} 
                                  strokeWidth="10" 
                                  strokeDasharray={`${accuracy * 2.83} 283`} 
                                  strokeDashoffset="0" 
                                  transform="rotate(-90 50 50)" 
                                  initial={{ strokeDasharray: '0 283' }}
                                  animate={{ strokeDasharray: `${accuracy * 2.83} 283` }}
                                  transition={{ duration: 1, ease: 'easeOut' }}
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <motion.span 
                                  className="text-3xl font-bold" 
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.6 }}
                                >
                                  {accuracy}%
                                </motion.span>
                              </div>
                            </div>
                            <motion.p 
                              className="text-gray-700 mt-3" 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.8 }}
                            >
                              {accuracy >= 90 ? "Excellent! You've mastered this sign." : accuracy >= 70 ? 'Good job! Keep practicing to improve.' : "Keep practicing! You'll get better."}
                            </motion.p>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      )}
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default LearnIt;