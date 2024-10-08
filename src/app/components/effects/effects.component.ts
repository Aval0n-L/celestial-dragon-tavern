import { Component, OnInit } from '@angular/core';
import { SongsComponent } from "./songs/songs.component";
import { WeatherComponent } from './weather/weather.component';
import { AmbienceComponent } from "./ambience/ambience.component";

@Component({
  selector: 'app-effects',
  standalone: true,
  imports: [SongsComponent, WeatherComponent, AmbienceComponent],
  templateUrl: './effects.component.html',
  styleUrl: './effects.component.scss'
})
export class EffectsComponent implements OnInit{
  public isActive = false;

  ngOnInit(): void {    
  }

  //#region Time
  setTime(time: string) {
    // Time of day setting logic
    console.log(`Setting time to: ${time}`);
  }
  //#endregion

  //#region Oneshots
  playOneshot(sound: string) {
    // Single Sound Playback Logic
    console.log(`Playing oneshot sound: ${sound}`);
  }
  //#endregion
}