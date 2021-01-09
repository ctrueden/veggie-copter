class SoundPlayer {
  constructor() {
    this.mute = false;
    this.song = null;
  }

  toggleMute() {
    this.mute = !this.mute;
    if (this.song != null) {
      if (this.mute) this.song.pause();
      else this.song.play();
    }
  }

  playSound(path) {
    if (this.mute) return;
    var audio = new Audio(path);
    audio.play();
  }

  playMusic(path) {
    this.song = new Audio(path);
    if (!this.mute) this.song.play();
  }

  stopMusic() {
    this.song.pause();
    this.song = null;
  }
}
