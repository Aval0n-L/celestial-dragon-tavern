import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private sounds: { [key: string]: HTMLAudioElement } = {};

  playSound(name: string, path: string, loop: boolean = false) {
    if (!this.sounds[name]) {
      this.sounds[name] = new Audio(path);
      this.sounds[name].loop = loop;
      this.sounds[name].play();
    } else {
      this.sounds[name].play();
    }
  }

  pauseSound(name: string) {
    if (this.sounds[name]) {
      this.sounds[name].pause();
    }
  }

  setVolume(name: string, volume: number) {
    if (this.sounds[name]) {
      this.sounds[name].volume = volume / 100;
    }
  }
}
