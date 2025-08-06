// Sound Effects Utility
// This file handles all audio feedback for the application

export class SoundManager {
  private static instance: SoundManager;
  private audioContext: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.5;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
  }

  public setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  public getVolume(): number {
    return this.volume;
  }

  public isSoundMuted(): boolean {
    return this.isMuted;
  }

  // Button click sound
  public playButtonClick(): void {
    if (this.isMuted || !this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(this.volume * 0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }

  // Correct answer sound (joyful)
  public playCorrectAnswer(): void {
    if (this.isMuted || !this.audioContext) return;
    
    const now = this.audioContext.currentTime;
    
    // Play a cheerful ascending melody
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const durations = [0.15, 0.15, 0.15, 0.3];
    
    notes.forEach((frequency, index) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);
      
      oscillator.frequency.setValueAtTime(frequency, now + index * 0.1);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, now + index * 0.1);
      gainNode.gain.linearRampToValueAtTime(this.volume * 0.4, now + index * 0.1 + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + index * 0.1 + durations[index]);
      
      oscillator.start(now + index * 0.1);
      oscillator.stop(now + index * 0.1 + durations[index]);
    });
  }

  // Wrong answer sound
  public playWrongAnswer(): void {
    if (this.isMuted || !this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    // Play a descending "wrong" sound
    oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.3);
    
    gainNode.gain.setValueAtTime(this.volume * 0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
    
    oscillator.type = 'sawtooth';
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }

  // Level up sound
  public playLevelUp(): void {
    if (this.isMuted || !this.audioContext) return;
    
    const now = this.audioContext.currentTime;
    
    // Play an exciting ascending arpeggio
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C4 to C6
    const duration = 0.1;
    
    notes.forEach((frequency, index) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);
      
      oscillator.frequency.setValueAtTime(frequency, now + index * duration);
      oscillator.type = 'square';
      
      gainNode.gain.setValueAtTime(0, now + index * duration);
      gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, now + index * duration + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + index * duration + duration);
      
      oscillator.start(now + index * duration);
      oscillator.stop(now + index * duration + duration);
    });
  }

  // Streak bonus sound
  public playStreakBonus(): void {
    if (this.isMuted || !this.audioContext) return;
    
    const now = this.audioContext.currentTime;
    
    // Play a celebratory sound
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.setValueAtTime(523.25, now); // C5
    oscillator.frequency.exponentialRampToValueAtTime(1046.50, now + 0.2); // C6
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(this.volume * 0.4, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    
    oscillator.type = 'triangle';
    oscillator.start(now);
    oscillator.stop(now + 0.4);
  }

  // Daily check-in sound
  public playDailyCheckin(): void {
    if (this.isMuted || !this.audioContext) return;
    
    const now = this.audioContext.currentTime;
    
    // Play a pleasant chime
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.setValueAtTime(659.25, now); // E5
    oscillator.frequency.exponentialRampToValueAtTime(523.25, now + 0.5); // C5
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    
    oscillator.type = 'sine';
    oscillator.start(now);
    oscillator.stop(now + 0.5);
  }

  // Game start sound
  public playGameStart(): void {
    if (this.isMuted || !this.audioContext) return;
    
    const now = this.audioContext.currentTime;
    
    // Play an energetic start sound
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.setValueAtTime(200, now);
    oscillator.frequency.exponentialRampToValueAtTime(800, now + 0.2);
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(this.volume * 0.4, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    
    oscillator.type = 'square';
    oscillator.start(now);
    oscillator.stop(now + 0.3);
  }

  // Game complete sound
  public playGameComplete(): void {
    if (this.isMuted || !this.audioContext) return;
    
    const now = this.audioContext.currentTime;
    
    // Play a victory fanfare
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5 to E6
    const duration = 0.2;
    
    notes.forEach((frequency, index) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);
      
      oscillator.frequency.setValueAtTime(frequency, now + index * duration);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, now + index * duration);
      gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, now + index * duration + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + index * duration + duration);
      
      oscillator.start(now + index * duration);
      oscillator.stop(now + index * duration + duration);
    });
  }

  // Hover sound for interactive elements
  public playHover(): void {
    if (this.isMuted || !this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.05);
    
    gainNode.gain.setValueAtTime(this.volume * 0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);
    
    oscillator.type = 'sine';
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.05);
  }
}

// Export singleton instance
export const soundManager = SoundManager.getInstance();

// Hook for React components
export const useSound = () => {
  return {
    playButtonClick: () => soundManager.playButtonClick(),
    playCorrectAnswer: () => soundManager.playCorrectAnswer(),
    playWrongAnswer: () => soundManager.playWrongAnswer(),
    playLevelUp: () => soundManager.playLevelUp(),
    playStreakBonus: () => soundManager.playStreakBonus(),
    playDailyCheckin: () => soundManager.playDailyCheckin(),
    playGameStart: () => soundManager.playGameStart(),
    playGameComplete: () => soundManager.playGameComplete(),
    playHover: () => soundManager.playHover(),
    setMuted: (muted: boolean) => soundManager.setMuted(muted),
    setVolume: (volume: number) => soundManager.setVolume(volume),
    isMuted: () => soundManager.isSoundMuted(),
    getVolume: () => soundManager.getVolume()
  };
}; 