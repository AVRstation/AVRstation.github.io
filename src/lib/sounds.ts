class SoundManager {
  private ctx: AudioContext | null = null;

  public init() {
    try {
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    } catch (e) {
      console.warn("Audio initialization failed:", e);
    }
  }

  private async ensureContext(): Promise<boolean> {
    this.init();
    if (!this.ctx) return false;
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
    return this.ctx.state === 'running';
  }

  async playNote(freq: number, type: OscillatorType = 'sine', duration: number = 0.1, volume: number = 0.1) {
    const isReady = await this.ensureContext();
    if (!isReady || !this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  // Common retro sounds
  playSnakeEat() {
    this.playNote(440, 'square', 0.1, 0.05);
    setTimeout(() => this.playNote(880, 'square', 0.1, 0.05), 50);
  }

  playSnakeDeath() {
    this.playNote(220, 'sawtooth', 0.3, 0.1);
    setTimeout(() => this.playNote(110, 'sawtooth', 0.3, 0.1), 100);
  }

  playPongHit() {
    this.playNote(330, 'sine', 0.1, 0.1);
  }

  playPongScore() {
    this.playNote(660, 'square', 0.2, 0.1);
  }

  playSpaceShoot() {
    this.playNote(880, 'sawtooth', 0.05, 0.05);
  }

  playSpaceExplosion() {
    this.playNote(100, 'sawtooth', 0.4, 0.2);
  }

  playSlotWin() {
    this.playNote(523.25, 'square', 0.1, 0.1); // C5
    setTimeout(() => this.playNote(659.25, 'square', 0.1, 0.1), 80); // E5
    setTimeout(() => this.playNote(783.99, 'square', 0.1, 0.1), 160); // G5
    setTimeout(() => this.playNote(1046.50, 'square', 0.3, 0.1), 240); // C6
  }
}

export const sounds = new SoundManager();
