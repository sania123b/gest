import { useRef } from 'react';
import type { AvatarCanvasHandle, AnimationItem } from '../Components/AvatarCanvas';
// Reuse existing JS animations from mirrored Sign-Kit
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as words from '../../signkit/Animations/words.js';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as alphabets from '../../signkit/Animations/alphabets.js';

type Options = {
  onTextFragment?: (frag: string) => void;
};

export function useSignSynthesis(avatarRef: React.RefObject<AvatarCanvasHandle>, options?: Options) {
  const bufferRef = useRef<string>('');

  const flushText = (text: string) => {
    const wordsArr = text.toUpperCase().split(/\s+/).filter(Boolean);
    const compatRef = avatarRef.current?.getCompatRef ? avatarRef.current.getCompatRef() : avatarRef.current as any;
    if (!compatRef) return;
    for (const word of wordsArr) {
      // Push a single add-text event per word for transcript grouping
      compatRef.animations.push(['add-text', `${word} `]);
      
      // Face Expressions Based on Word Content
      if (['HAPPY', 'GOOD', 'GREAT', 'EXCELLENT', 'SMILE', 'YAY'].includes(word)) {
        compatRef.animations.push([['mouthSmile', 'morph', 'none', 1.0, '+'], ['browInnerUp', 'morph', 'none', 0.8, '+']]);
      } else if (['SAD', 'BAD', 'TERRIBLE', 'SORRY'].includes(word)) {
        compatRef.animations.push([['mouthFrown', 'morph', 'none', 1.0, '+'], ['browDownLeft', 'morph', 'none', 0.8, '+'], ['browDownRight', 'morph', 'none', 0.8, '+']]);
      } else {
        // Generic talking (mouth move)
        compatRef.animations.push([['jawOpen', 'morph', 'none', 0.4, '+']]);
      }

      if ((words as any)[word]) {
        (words as any)[word](compatRef);
      } else {
        // Fallback: spell via alphabets but keep transcript as a word
        for (const ch of Array.from(word)) {
          if ((alphabets as any)[ch]) {
            (alphabets as any)[ch](compatRef);
          }
        }
      }
      // Add a separator to signal segment end for UI highlighting
      compatRef.animations.push([]);
      
      // Reset Expressions
      compatRef.animations.push([
        ['mouthSmile', 'morph', 'none', 0.0, '-'],
        ['mouthFrown', 'morph', 'none', 0.0, '-'],
        ['jawOpen', 'morph', 'none', 0.0, '-'],
        ['browInnerUp', 'morph', 'none', 0.0, '-'],
        ['browDownLeft', 'morph', 'none', 0.0, '-'],
        ['browDownRight', 'morph', 'none', 0.0, '-']
      ]);
    }
    avatarRef.current?.kick?.();
  };

  const appendFragment = (incoming: string) => {
    bufferRef.current += incoming;
    const lastWhitespace = bufferRef.current.lastIndexOf(' ');
    if (lastWhitespace !== -1) {
      const completeChunk = bufferRef.current.slice(0, lastWhitespace);
      bufferRef.current = bufferRef.current.slice(lastWhitespace + 1);
      if (completeChunk) {
        flushText(completeChunk);
        options?.onTextFragment?.(completeChunk);
      }
    }
  };

  const flushRemainder = () => {
    const remaining = bufferRef.current.trim();
    if (!remaining) return;
    // Do not clear buffer completely; leave trailing partial to keep live display uninterrupted
    bufferRef.current = '';
    flushText(remaining);
    options?.onTextFragment?.(remaining);
  };

  // Sign a complete phrase in one go (used by ChatIT for assistant replies)
  const signText = (text: string) => {
    const clean = text.replace(/[^A-Za-z\s]/g, ' ').trim();
    if (clean) flushText(clean);
  };

  return { appendFragment, flushRemainder, signText };
}