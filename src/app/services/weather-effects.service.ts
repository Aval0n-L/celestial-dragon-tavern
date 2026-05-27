import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Weather } from '../models/weather.model';

export interface WeatherEffectsState {
  activeWeather: Weather | null;
  intensity: number;
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherEffectsService {
  private readonly stateSource = new BehaviorSubject<WeatherEffectsState>({
    activeWeather: null,
    intensity: 15,
    color: '255, 255, 255',
  });

  readonly state$ = this.stateSource.asObservable();

  update(partial: Partial<WeatherEffectsState>) {
    this.stateSource.next({ ...this.stateSource.value, ...partial });
  }

  get current(): WeatherEffectsState {
    return this.stateSource.value;
  }
}
