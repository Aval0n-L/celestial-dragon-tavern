import { Component, OnInit } from '@angular/core';
import { SongsComponent } from "./songs/songs.component";
import { WeatherComponent } from './weather/weather.component';

@Component({
  selector: 'app-effects',
  standalone: true,
  imports: [SongsComponent, WeatherComponent],
  templateUrl: './effects.component.html',
  styleUrl: './effects.component.scss'
})
export class EffectsComponent implements OnInit{
  public isActive = false;

  ngOnInit(): void {    
  }

  //#region Time
  setTime(time: string) {
    // Логика установки времени суток
    console.log(`Setting time to: ${time}`);
  }
  //#endregion

  //#region Ambience
  toggleAmbience(ambience: string) {
    // Логика переключения атмосферы
    console.log(`Toggling ambience: ${ambience}`);
  }
  //#endregion

  //#region Oneshots
  playOneshot(sound: string) {
    // Логика воспроизведения одиночного звука
    console.log(`Playing oneshot sound: ${sound}`);
  }
  //#endregion
}