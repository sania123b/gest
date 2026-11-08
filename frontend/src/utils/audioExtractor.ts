// Audio extraction utility for video files
export class AudioExtractor {
  private audioContext: AudioContext | null = null;
  private audioBuffer: AudioBuffer | null = null;

  constructor() {
    // Initialize AudioContext
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  // Extract audio from video file
  async extractAudioFromVideo(videoFile: File): Promise<AudioBuffer> {
    if (!this.audioContext) {
      throw new Error('AudioContext not available');
    }

    try {
      // Create video element to load the file
      const video = document.createElement('video');
      video.src = URL.createObjectURL(videoFile);
      video.muted = true; // Mute to avoid feedback
      
      // Wait for video to load
      await new Promise((resolve, reject) => {
        video.onloadedmetadata = resolve;
        video.onerror = reject;
      });

      // Create audio context source
      const source = this.audioContext.createMediaElementSource(video);
      const analyser = this.audioContext.createAnalyser();
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      source.connect(analyser);
      analyser.connect(this.audioContext.destination);

      // Play video to extract audio
      video.play();

      // Wait for video to finish playing
      await new Promise((resolve) => {
        video.onended = resolve;
      });

      // Get audio data
      analyser.getByteFrequencyData(dataArray);
      
      // Clean up
      URL.revokeObjectURL(video.src);
      
      return this.audioBuffer!;
    } catch (error) {
      throw new Error(`Failed to extract audio: ${error}`);
    }
  }

  // Convert audio buffer to text using Web Speech API
  async audioToText(audioBuffer: AudioBuffer): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      let finalTranscript = '';

      recognition.onresult = (event: any) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          }
        }
      };

      recognition.onend = () => {
        resolve(finalTranscript.trim());
      };

      recognition.onerror = (event: any) => {
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      // Start recognition
      recognition.start();

      // Play the audio buffer
      if (this.audioContext) {
        const source = this.audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(this.audioContext.destination);
        source.start();
      }
    });
  }

  // Extract audio and convert to text in one step
  async videoToText(videoFile: File): Promise<string> {
    try {
      const audioBuffer = await this.extractAudioFromVideo(videoFile);
      const text = await this.audioToText(audioBuffer);
      return text;
    } catch (error) {
      throw new Error(`Failed to convert video to text: ${error}`);
    }
  }

  // Clean up resources
  dispose(): void {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}
