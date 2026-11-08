// Type definitions for signkit utilities

export interface VideoRecorderOptions {
  width?: number;
  height?: number;
  frameRate?: number;
  quality?: number;
  format?: string;
}

export interface SpeechRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  language?: string;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

export interface SpeechRecognitionState {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
}

export interface TextToSignOptions {
  speed?: number;
  pauseMs?: number;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
}

// Extend Window interface for speech recognition
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}
