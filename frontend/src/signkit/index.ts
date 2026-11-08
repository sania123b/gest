export { default as AvatarCanvas } from './Components/AvatarCanvas';
export type { AvatarCanvasHandle, AnimationItem, BoneDelta } from './Components/AvatarCanvas';
export { default as SpeechController } from './Components/SpeechController';
export { useSignSynthesis } from './hooks/useSignSynthesis';
export { useSpeechRecognition } from './hooks/useSpeechRecognition';
export { textToSignAnimations, textToSignAnimationsWithTiming, getAvailableCharacters, isCharacterSupported } from './utils/textToSigns';
export { AvatarVideoRecorder } from './utils/videoRecorder';
export type { VideoRecorderOptions, SpeechRecognitionOptions, SpeechRecognitionState, TextToSignOptions } from './utils/types';


