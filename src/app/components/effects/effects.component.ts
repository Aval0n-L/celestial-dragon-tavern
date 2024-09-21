import { Component } from '@angular/core';
import { AudioService } from '../../services/audio.service';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-effects',
  standalone: true,
  imports: [FormsModule, NgClass ],
  templateUrl: './effects.component.html',
  styleUrl: './effects.component.css'
})
export class EffectsComponent {
  songVolume: number = 50;

  constructor(private audioService: AudioService) {}

  public weatherIntensity: number = 0;
  public currentIconClass: string = 'thumb-icon-1';
  public updateThumbIcon() {
    if (this.weatherIntensity <= 15) {
      this.currentIconClass = 'thumb-icon-1';
    } else if (this.weatherIntensity > 15 && this.weatherIntensity <= 30) {
      this.currentIconClass = 'thumb-icon-2';
    } else if (this.weatherIntensity > 30 && this.weatherIntensity <= 50) {
      this.currentIconClass = 'thumb-icon-3';
    } else if (this.weatherIntensity > 50 && this.weatherIntensity <= 75) {
      this.currentIconClass = 'thumb-icon-4';
    } else if (this.weatherIntensity > 75 && this.weatherIntensity <= 100) {
      this.currentIconClass = 'thumb-icon-5';
    }
  }

  toggleSong(song: string) {
    const path = `assets/audio/songs/${song.toLowerCase()}.mp3`;
    this.audioService.playSound(song, path, true);
    // Логика переключения песни
    console.log(`Toggling song: ${song}`);
  }

  setTime(time: string) {
    // Логика установки времени суток
    console.log(`Setting time to: ${time}`);
  }

  toggleAmbience(ambience: string) {
    // Логика переключения атмосферы
    console.log(`Toggling ambience: ${ambience}`);
  }

  toggleWeather(weather: string) {
    // Логика переключения погоды
    console.log(`Toggling weather: ${weather}`);
  }

  playOneshot(sound: string) {
    // Логика воспроизведения одиночного звука
    console.log(`Playing oneshot sound: ${sound}`);
  }
}
