import * as THREE from 'three';

export class CarSound {
  constructor(camera) {
    this.listener = new THREE.AudioListener();
    camera.add(this.listener);

    this.engineSound = new THREE.Audio(this.listener);
    this.loader = new THREE.AudioLoader();

    this.isPlaying = false;

    this.loader.load('/sounds/engine.wav', (buffer) => {
      this.engineSound.setBuffer(buffer);
      this.engineSound.setLoop(true);
      this.engineSound.setVolume(0.25);
      this.engineSound.setPlaybackRate(1.0);
    });
  }

  update(speed) {
    if (!this.engineSound.buffer) return;

    if (speed > 0.01) {
      if (!this.isPlaying) {
        this.engineSound.play();
        this.isPlaying = true;
      }

      const pitch = THREE.MathUtils.clamp(0.9 + speed * 0.15, 0.9, 2.2);
      const volume = THREE.MathUtils.clamp(0.2 + speed * 0.05, 0.2, 0.9);

      this.engineSound.setPlaybackRate(pitch);
      this.engineSound.setVolume(volume);
    } else {
      this.engineSound.pause();
      this.isPlaying = false;
    }
  }
}
