import * as THREE from 'three';

export interface VideoRecorderOptions {
  width?: number;
  height?: number;
  frameRate?: number;
  quality?: number;
  format?: string;
}

export class AvatarVideoRecorder {
  private renderer: THREE.WebGLRenderer;
  private canvas: HTMLCanvasElement;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private isRecording = false;
  private options: Required<VideoRecorderOptions>;

  constructor(renderer: THREE.WebGLRenderer, options: VideoRecorderOptions = {}) {
    this.renderer = renderer;
    this.canvas = renderer.domElement;
    this.options = {
      width: 1280,
      height: 720,
      frameRate: 30,
      quality: 0.8,
      format: 'video/webm;codecs=vp9',
      ...options
    };
  }

  async startRecording(): Promise<void> {
    if (this.isRecording) {
      throw new Error('Recording is already in progress');
    }

    try {
      // Create a stream from the canvas
      const stream = this.canvas.captureStream(this.options.frameRate);
      
      // Create MediaRecorder
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: this.options.format,
        videoBitsPerSecond: 2500000 // 2.5 Mbps
      });

      this.recordedChunks = [];
      this.isRecording = true;

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(100); // Collect data every 100ms
    } catch (error) {
      throw new Error(`Failed to start recording: ${error}`);
    }
  }

  stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.isRecording || !this.mediaRecorder) {
        reject(new Error('No recording in progress'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: this.options.format });
        this.isRecording = false;
        resolve(blob);
      };

      this.mediaRecorder.stop();
    });
  }

  isCurrentlyRecording(): boolean {
    return this.isRecording;
  }

  // Download the recorded video
  downloadVideo(filename: string = 'sign-language-video.webm'): void {
    if (this.recordedChunks.length === 0) {
      throw new Error('No video recorded');
    }

    const blob = new Blob(this.recordedChunks, { type: this.options.format });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
  }

  // Get the recorded video as a blob
  getVideoBlob(): Blob {
    if (this.recordedChunks.length === 0) {
      throw new Error('No video recorded');
    }
    return new Blob(this.recordedChunks, { type: this.options.format });
  }

  // Clear recorded data
  clear(): void {
    this.recordedChunks = [];
    this.isRecording = false;
  }
}
