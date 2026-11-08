import React, { useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import type { AvatarCanvasHandle } from './AvatarCanvas';
import { useSignSynthesis } from '../hooks/useSignSynthesis';

type Props = {
  avatarRef: React.RefObject<AvatarCanvasHandle>;
  micEnabled: boolean;
  onTranscriptUpdate?: (fullTranscript: string) => void;
};

const SpeechController: React.FC<Props> = ({ avatarRef, micEnabled, onTranscriptUpdate }) => {
  const prevTranscriptRef = useRef<string>('');
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const { appendFragment, flushRemainder } = useSignSynthesis(avatarRef);
  const debounceTimer = useRef<number | null>(null);

  useEffect(() => {
    if (micEnabled) {
      SpeechRecognition.startListening({ continuous: true });
    } else {
      SpeechRecognition.stopListening();
      prevTranscriptRef.current = '';
      resetTranscript();
    }
  }, [micEnabled, resetTranscript]);

  useEffect(() => {
    if (!transcript) return;
    const prev = prevTranscriptRef.current;
    if (transcript.length > prev.length) {
      const diff = transcript.slice(prev.length);
      // feed only the new fragment; synthesis buffers until space
      appendFragment(diff);
      try { onTranscriptUpdate && onTranscriptUpdate(transcript); } catch {}
      if (debounceTimer.current) {
        window.clearTimeout(debounceTimer.current);
      }
      debounceTimer.current = window.setTimeout(() => {
        flushRemainder();
      }, 400);
      prevTranscriptRef.current = transcript;
    } else if (transcript.length < prev.length) {
      // transcript reset or language change
      prevTranscriptRef.current = transcript;
      try { onTranscriptUpdate && onTranscriptUpdate(transcript); } catch {}
    }
  }, [transcript, appendFragment]);

  return null;
};

export default SpeechController;