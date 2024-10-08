import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Weather } from '../../../models/weather.model';
import { ThunderstormComponent } from "./thunderstorm/thunderstorm.component";
import { AudioService } from '../../../services/audio.service';
import { RainComponent } from "./rain/rain.component";
import { SnowfallComponent } from "./snowfall/snowfall.component";
import { BlizzardComponent } from './blizzard/blizzard.component';
import { FogComponent } from "./fog/fog.component";
import { ClearSkyComponent } from './clear-sky/clear-sky.component';
import { SandStormComponent } from "./sand-storm/sand-storm.component";
import { TropicalStormComponent } from "./tropical-storm/tropical-storm.component";
import { EtherealStormComponent } from "./ethereal-storm/ethereal-storm.component";
import { WindyComponent } from "./windy/windy.component";

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [
    FormsModule, NgClass, NgFor, NgIf, NgStyle,
    ThunderstormComponent, SandStormComponent,
    TropicalStormComponent, EtherealStormComponent,
    RainComponent,
    SnowfallComponent, BlizzardComponent,
    FogComponent, ClearSkyComponent,
    WindyComponent
],
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

  constructor(private audioService: AudioService) {}

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
      //[Weather.EtherealStorm]: { path: '/audio/weather/sandstorm.mp3', color: '' },

      [Weather.Snowfall]: { path: '/audio/weather/snowfall.mp3', color: '' },
      [Weather.Blizzard]: { path: '/audio/weather/blizzard.mp3', color: '' }
    };
    
    this.weatherKeys = Object.keys(this.weatherArray) as Weather[];
  }
  
  ngOnDestroy() {
    this.audioService.pauseAllSounds();
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
      this.audioService.setVolume(this.activeWeather, this.adjustedIntensity(newIntensity));
    }
  }
  //#endregion

  private adjustedIntensity(newIntensity: number): number {
    if (this.isClearSky()) return 100 - newIntensity;

    return newIntensity;
  }

  // Weather switching logic
  toggleWeather(weather: Weather) {
    const config = this.weatherArray[weather];

    if (config ) {
      if (this.isPlay && this.isActive && this.activeWeather === weather) {
        console.log(`Unactive weather: ${weather}`);
        
        this.audioService.pauseSound(weather);
        this.isPlay = false;

        this.isActive = false;
        this.activeWeather = null;
        this.weatherColor = '';
      } else {
        if (this.activeWeather) {
          console.log(`Switch weather from ${this.activeWeather} to ${weather}`);
          this.audioService.pauseSound(this.activeWeather); 
        }
        
        console.log(`Toggling weather: ${weather}`);

        this.audioService.playSound(weather, config.path, this.adjustedIntensity(this.weatherIntensity), true);
        this.isPlay = true;
        this.isActive = true;
        this.weatherColor = config.color;
        this.activeWeather = weather;
      }
    } else {
      console.log('Song not found');
    }
  }

  isFog(): boolean {
    return this.activeWeather === Weather.Fog;
  }

  isWindy(): boolean {
    return this.activeWeather === Weather.Windy;
  }

  isRain(): boolean {
    return this.activeWeather === Weather.Rain || 
            this.activeWeather === Weather.AcidRain ||
            this.activeWeather === Weather.PurpleRain ;
  }

  isClearSky(): boolean {
    return this.activeWeather === Weather.ClearSky;
  }

  isThunderstorm(): boolean {
    return this.activeWeather === Weather.Thunderstorm;
  }

  isSandstorm(): boolean {
    return this.activeWeather === Weather.SandStorm;
  }

  isTropicalstorm(): boolean {
    return this.activeWeather === Weather.TropicalStorm;
  }

  isEtherealStorm(): boolean {
    return this.activeWeather === Weather.EtherealStorm;
  }


  isSnowfall(): boolean {
    return this.activeWeather === Weather.Snowfall;
  }
  isBlizzard(): boolean {
    return this.activeWeather === Weather.Blizzard;
  }
}
