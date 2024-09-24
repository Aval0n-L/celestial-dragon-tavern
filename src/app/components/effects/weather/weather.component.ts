import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Weather } from '../../../models/weather.model';
import { ThunderstormComponent } from "./thunderstorm/thunderstorm.component";
import { AudioService } from '../../../services/audio.service';
import { RainComponent } from "./rain/rain.component";
import { SnowfallComponent } from "./snowfall/snowfall.component";
import { BlizzardComponent } from './blizzard/blizzard.component';
import { FogComponent } from "./fog/fog.component";

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [
    FormsModule, NgClass, NgFor, NgIf, NgStyle,
    ThunderstormComponent, RainComponent,
    SnowfallComponent, BlizzardComponent,
    FogComponent
],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss'
})
export class WeatherComponent implements OnInit {
  public weatherIntensity: number = 15;
  public isActive = false;
  public isPlay: boolean = false;

  weatherArray: { [key in Weather]?: string } = {};
  weatherKeys: Weather[] = [];
  activeWeather: Weather | null = null;

  constructor(private audioService: AudioService) {}
  
  ngOnInit() {    
    this.weatherArray = {
      [Weather.ClearSky]: '/audio/weather/clear_sky.mp3',
      [Weather.Fog]: '/audio/weather/fog.mp3',
      [Weather.Windy]: '/audio/weather/windy.mp3',

      [Weather.AcidRain]: '/audio/weather/rain.mp3',
      [Weather.PurpleRain]: '/audio/weather/rain.mp3',
      [Weather.Rain]: '/audio/weather/rain.mp3',

      [Weather.Thunderstorm]: '/audio/weather/thunderstorm.mp3',
      [Weather.SandStorm]: '/audio/weather/sandstorm.mp3',
      [Weather.TropicalStorm]: '/audio/weather/tropicalstorm.mp3',

      [Weather.Snowfall]: '/audio/weather/snowfall.mp3',
      [Weather.Blizzard]: '/audio/weather/blizzard.mp3',
    };
    
    this.weatherKeys = Object.keys(this.weatherArray) as Weather[];
  }

  //#region slider
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
      this.audioService.setVolume(this.activeWeather, newIntensity);
    }
  }
  //#endregion

  // Логика переключения погоды
  toggleWeather(weather: Weather) {
    const path = this.weatherArray[weather];

    if (path) {
      if (this.isPlay && this.isActive && this.activeWeather === weather) {
        console.log(`Unactive weather: ${weather}`);
        
        this.audioService.pauseSound(weather);
        this.isPlay = false;

        this.isActive = false;
        this.activeWeather = null;
      } else {
        if (this.activeWeather) {
          console.log(`Switch weather from ${this.activeWeather} to ${weather}`);
          this.audioService.pauseSound(this.activeWeather); 
        }
        
        console.log(`Toggling weather: ${weather}`);

        this.audioService.playSound(weather, path, this.weatherIntensity, true); // Воспроизводим песню
        this.isPlay = true;
        this.isActive = true;
        this.activeWeather = weather;
      }
    } else {
      console.log('Song not found');
    }
  }

  isFog(): boolean {
    return this.activeWeather === Weather.Fog;
  }
  isRain(): boolean {
    return this.activeWeather === Weather.Rain;
  }
  isThunderstorm(): boolean {
    return this.activeWeather === Weather.Thunderstorm;
  }
  isSnowfall(): boolean {
    return this.activeWeather === Weather.Snowfall;
  }
  isBlizzard(): boolean {
    return this.activeWeather === Weather.Blizzard;
  }
}
