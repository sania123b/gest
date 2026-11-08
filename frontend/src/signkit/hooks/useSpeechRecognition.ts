import { useState, useEffect, useCallback } from 'react';

interface SpeechRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  language?: string;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

interface SpeechRecognitionState {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
}

export const useSpeechRecognition = (options: SpeechRecognitionOptions = {}) => {
  const {
    continuous = true,
    interimResults = true,
    language = 'en-US',
    onResult,
    onError,
    onStart,
    onEnd
  } = options;

  const [state, setState] = useState<SpeechRecognitionState>({
    isSupported: false,
    isListening: false,
    transcript: '',
    interimTranscript: '',
    error: null
  });

  // Check if speech recognition is supported
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    setState(prev => ({ ...prev, isSupported: !!SpeechRecognition }));
  }, []);

  const startListening = useCallback(() => {
    if (!state.isSupported) {
      setState(prev => ({ ...prev, error: 'Speech recognition not supported' }));
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = language;

    recognition.onstart = () => {
      setState(prev => ({ 
        ...prev, 
        isListening: true, 
        error: null,
        transcript: '',
        interimTranscript: ''
      }));
      onStart?.();
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setState(prev => ({
        ...prev,
        transcript: prev.transcript + finalTranscript,
        interimTranscript
      }));

      onResult?.(finalTranscript + interimTranscript, !!finalTranscript);
    };

    recognition.onerror = (event: any) => {
      const error = `Speech recognition error: ${event.error}`;
      setState(prev => ({ ...prev, error, isListening: false }));
      onError?.(error);
    };

    recognition.onend = () => {
      setState(prev => ({ ...prev, isListening: false }));
      onEnd?.();
    };

    recognition.start();
  }, [state.isSupported, continuous, interimResults, language, onResult, onError, onStart, onEnd]);

  const stopListening = useCallback(() => {
    if (state.isListening) {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.stop();
    }
  }, [state.isListening]);

  const reset = useCallback(() => {
    setState(prev => ({
      ...prev,
      transcript: '',
      interimTranscript: '',
      error: null,
      isListening: false
    }));
  }, []);

  return {
    ...state,
    startListening,
    stopListening,
    reset
  };
};
