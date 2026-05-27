import { NgClass, NgFor } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Weather } from '../../../models/weather.model';
import { AudioService } from '../../../services/audio.service';
import { WeatherEffectsService } from '../../../services/weather-effects.service';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [FormsModule, NgClass, NgFor],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss'
})
export class WeatherComponent implements OnInit, OnDestroy {
  public weatherIntensity: number = 15;
  public weatherColor: string = `255, 255, 255`;

  public isActive = false;
  public isPlay: boolean = false;

  private weatherArray: { [key in Weather]?: { path: string, color: string } } = {};
  public weatherKeys: Weather[] = [];
  public activeWeather: Weather | null = null;

  constructor(
    private audioService: AudioService,
    private weatherEffectsService: WeatherEffectsService,
  ) {}

  ngOnInit() {
    this.weatherArray = {
      [Weather.ClearSky]: { path: '/audio/weather/clear_sky.mp3', color: '' },
      [Weather.Fog]: { path: '/audio/weather/fog.mp3', color: '' },
      [Weather.Windy]: { path: '/audio/weather/windy.mp3', color: '' },

      [Weather.Rain]: { path: '/audio/weather/rain.mp3', color: '255, 255, 255' },
      [Weather.AcidRain]: { path: '/audio/weather/rain.mp3', color: '0, 255, 0' },
      [Weather.PurpleRain]: { path: '/audio/weather/rain.mp3', color: '186, 85, 211' },

      [Weather.Thunderstorm]: { path: '/audio/weather/thunderstorm.mp3', color: '' },
      [Weather.TropicalStorm]: { path: '/audio/weather/tropicalstorm.mp3', color: '' },
      [Weather.SandStorm]: { path: '/audio/weather/sandstorm.mp3', color: '' },

      [Weather.Snowfall]: { path: '/audio/weather/snowfall.mp3', color: '' },
      [Weather.Blizzard]: { path: '/audio/weather/blizzard.mp3', color: '' }
    };

    this.weatherKeys = Object.keys(this.weatherArray) as Weather[];
    this.syncVisualState();
  }

  ngOnDestroy() {
    this.audioService.pauseAllSounds();
  }

  public currentIconClass: string = 'sun-icon';

  public updateRainIntensity(newIntensity: number) {
    if (this.weatherIntensity <= 15) {
      this.currentIconClass = 'sun-icon';
    } else if (this.weatherIntensity > 15 && this.weatherIntensity <= 30) {
      this.currentIconClass = 'cloudy-icon';
    } else if (this.weatherIntensity > 30 && this.weatherIntensity <= 50) {
      this.currentIconClass = 'rainy-icon';
    } else if (this.weatherIntensity > 50 && this.weatherIntensity <= 75) {
      this.currentIconClass = 'shower-icon';
    } else if (this.weatherIntensity > 75 && this.weatherIntensity <= 100) {
      this.currentIconClass = 'thunderstorm-icon';
    }

    this.weatherIntensity = newIntensity;
    if (this.activeWeather) {
      this.audioService.setVolume(this.activeWeather, this.adjustedIntensity(newIntensity));
    }
    this.syncVisualState();
  }

  private adjustedIntensity(newIntensity: number): number {
    if (this.isClearSky()) return 100 - newIntensity;

    return newIntensity;
  }

  toggleWeather(weather: Weather) {
    const config = this.weatherArray[weather];

    if (config) {
      if (this.isPlay && this.isActive && this.activeWeather === weather) {
        this.audioService.pauseSound(weather);
        this.isPlay = false;
        this.isActive = false;
        this.activeWeather = null;
        this.weatherColor = '';
      } else {
        if (this.activeWeather) {
          this.audioService.pauseSound(this.activeWeather);
        }

        this.audioService.playSound(weather, config.path, this.adjustedIntensity(this.weatherIntensity), true);
        this.isPlay = true;
        this.isActive = true;
        this.weatherColor = config.color;
        this.activeWeather = weather;
      }
    }

    this.syncVisualState();
  }

  private syncVisualState() {
    this.weatherEffectsService.update({
      activeWeather: this.activeWeather,
      intensity: this.weatherIntensity,
      color: this.weatherColor,
    });
  }

  private isClearSky(): boolean {
    return this.activeWeather === Weather.ClearSky;
  }
}
