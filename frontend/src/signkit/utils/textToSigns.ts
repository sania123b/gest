import { 
  A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z 
} from '../Animations/alphabets';

// Map characters to their corresponding animation functions
const alphabetMap: { [key: string]: (ref: any) => void } = {
  'A': A, 'B': B, 'C': C, 'D': D, 'E': E, 'F': F, 'G': G, 'H': H, 'I': I, 'J': J,
  'K': K, 'L': L, 'M': M, 'N': N, 'O': O, 'P': P, 'Q': Q, 'R': R, 'S': S, 'T': T,
  'U': U, 'V': V, 'W': W, 'X': X, 'Y': Y, 'Z': Z,
  'a': A, 'b': B, 'c': C, 'd': D, 'e': E, 'f': F, 'g': G, 'h': H, 'i': I, 'j': J,
  'k': K, 'l': L, 'm': M, 'n': N, 'o': O, 'p': P, 'q': Q, 'r': R, 's': S, 't': T,
  'u': U, 'v': V, 'w': W, 'x': X, 'y': Y, 'z': Z
};

// Convert text to sign language animations
export const textToSignAnimations = (text: string, avatarRef: any): void => {
  if (!avatarRef || !text) return;

  // Clear any existing animations
  avatarRef.clear();

  // Process each character in the text
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    
    // Skip spaces but add a pause
    if (char === ' ') {
      // Add a pause animation (empty animation with delay)
      avatarRef.enqueue([[]]);
      continue;
    }

    // Get the animation function for this character
    const animationFunc = alphabetMap[char];
    
    if (animationFunc) {
      // Create a temporary ref to collect animations
      const tempRef = {
        animations: [] as any[],
        pending: false,
        animate: () => {}
      };
      
      // Call the animation function
      animationFunc(tempRef);
      
      // Add the collected animations to the avatar
      if (tempRef.animations.length > 0) {
        avatarRef.enqueue(tempRef.animations);
      }
    }
  }
};

// Convert text to sign language animations with timing control
export const textToSignAnimationsWithTiming = (
  text: string, 
  avatarRef: any, 
  options: {
    speed?: number;
    pauseMs?: number;
    onProgress?: (progress: number) => void;
    onComplete?: () => void;
  } = {}
): void => {
  if (!avatarRef || !text) return;

  const { speed = 0.25, pauseMs = 300, onProgress, onComplete } = options;

  // Set timing parameters
  avatarRef.setSpeed(speed);
  avatarRef.setPauseMs(pauseMs);

  // Clear any existing animations
  avatarRef.clear();

  let totalCharacters = 0;
  let completedCharacters = 0;

  // Count total characters (excluding spaces)
  for (let i = 0; i < text.length; i++) {
    if (text[i] !== ' ') {
      totalCharacters++;
    }
  }

  // Process each character in the text
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    
    // Skip spaces but add a pause
    if (char === ' ') {
      avatarRef.enqueue([[]]);
      continue;
    }

    // Get the animation function for this character
    const animationFunc = alphabetMap[char];
    
    if (animationFunc) {
      // Create a temporary ref to collect animations
      const tempRef = {
        animations: [] as any[],
        pending: false,
        animate: () => {}
      };
      
      // Call the animation function
      animationFunc(tempRef);
      
      // Add the collected animations to the avatar
      if (tempRef.animations.length > 0) {
        avatarRef.enqueue(tempRef.animations);
        
        // Add progress tracking
        const currentChar = completedCharacters;
        avatarRef.enqueue([['add-text', char]]);
        
        // Track completion
        setTimeout(() => {
          completedCharacters++;
          if (onProgress) {
            onProgress(completedCharacters / totalCharacters);
          }
          
          if (completedCharacters === totalCharacters && onComplete) {
            onComplete();
          }
        }, pauseMs * 2); // Approximate timing
      }
    }
  }
};

// Get available characters
export const getAvailableCharacters = (): string[] => {
  return Object.keys(alphabetMap);
};

// Check if a character is supported
export const isCharacterSupported = (char: string): boolean => {
  return char in alphabetMap;
};
