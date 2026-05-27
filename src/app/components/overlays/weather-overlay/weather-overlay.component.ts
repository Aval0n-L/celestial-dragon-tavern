import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Weather } from '../../../models/weather.model';
import { WeatherEffectsService, WeatherEffectsState } from '../../../services/weather-effects.service';
import { ClearSkyComponent } from '../../effects/weather/clear-sky/clear-sky.component';
import { FogComponent } from '../../effects/weather/fog/fog.component';
import { WindyComponent } from '../../effects/weather/windy/windy.component';
import { RainComponent } from '../../effects/weather/rain/rain.component';
import { ThunderstormComponent } from '../../effects/weather/thunderstorm/thunderstorm.component';
import { TropicalStormComponent } from '../../effects/weather/tropical-storm/tropical-storm.component';
import { SandStormComponent } from '../../effects/weather/sand-storm/sand-storm.component';
import { SnowfallComponent } from '../../effects/weather/snowfall/snowfall.component';
import { BlizzardComponent } from '../../effects/weather/blizzard/blizzard.component';

@Component({
  selector: 'app-weather-overlay',
  standalone: true,
  imports: [
    ClearSkyComponent,
    FogComponent,
    WindyComponent,
    RainComponent,
    ThunderstormComponent,
    TropicalStormComponent,
    SandStormComponent,
    SnowfallComponent,
    BlizzardComponent,
  ],
  templateUrl: './weather-overlay.component.html',
  styleUrl: './weather-overlay.component.scss',
})
export class WeatherOverlayComponent implements OnInit, OnDestroy {
  state: WeatherEffectsState = {
    activeWeather: null,
    intensity: 15,
    color: '255, 255, 255',
  };

  private subscription?: Subscription;

  constructor(private weatherEffectsService: WeatherEffectsService) {}

  ngOnInit() {
    this.state = this.weatherEffectsService.current;
    this.subscription = this.weatherEffectsService.state$.subscribe(state => {
      this.state = state;
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  isFog(): boolean {
    return this.state.activeWeather === Weather.Fog;
  }

  isWindy(): boolean {
    return this.state.activeWeather === Weather.Windy;
  }

  isRain(): boolean {
    return (
      this.state.activeWeather === Weather.Rain ||
      this.state.activeWeather === Weather.AcidRain ||
      this.state.activeWeather === Weather.PurpleRain
    );
  }

  isClearSky(): boolean {
    return this.state.activeWeather === Weather.ClearSky;
  }

  isThunderstorm(): boolean {
    return this.state.activeWeather === Weather.Thunderstorm;
  }

  isSandstorm(): boolean {
    return this.state.activeWeather === Weather.SandStorm;
  }

  isTropicalstorm(): boolean {
    return this.state.activeWeather === Weather.TropicalStorm;
  }

  isSnowfall(): boolean {
    return this.state.activeWeather === Weather.Snowfall;
  }

  isBlizzard(): boolean {
    return this.state.activeWeather === Weather.Blizzard;
  }
}
