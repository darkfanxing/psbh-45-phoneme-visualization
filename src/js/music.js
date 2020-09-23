class MusicBox {
  constructor(options) {
    let defaults = {
      type: 'sine',  // sine | square | triangle | sawtooth
      duration: 2
    };

    this.opts = Object.assign(defaults, options);
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  createSound(frequency) {
    let oscillator = this.audioCtx.createOscillator();
    let gainNode = this.audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);
    oscillator.type = this.opts.type; // type: sine | square | triangle | sawtooth
    oscillator.frequency.value = frequency;
    gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, this.audioCtx.currentTime + 0.01);
    oscillator.start(this.audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + this.opts.duration);
    oscillator.stop(this.audioCtx.currentTime + this.opts.duration);
  }
}