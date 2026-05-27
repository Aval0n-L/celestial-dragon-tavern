import { Component, OnInit } from '@angular/core';
import { NgClass, NgFor } from '@angular/common';
import { SongsComponent } from "./songs/songs.component";
import { WeatherComponent } from './weather/weather.component';
import { AmbienceComponent } from "./ambience/ambience.component";
import { AudioService } from '../../services/audio.service';
import { TimeOfDayService } from '../../services/time-of-day.service';

@Component({
  selector: 'app-effects',
  standalone: true,
  imports: [NgClass, NgFor, SongsComponent, WeatherComponent, AmbienceComponent],
  templateUrl: './effects.component.html',
  styleUrl: './effects.component.scss'
})
export class EffectsComponent implements OnInit{
  public isActive = false;
  activeTime: string | null = null;

  readonly timeOptions = ['Dawn', 'Midday', 'Day', 'Evening', 'Twilight', 'Night', 'Midnight'];

  private readonly oneshotPaths: Record<string, string> = {
    'Alarm': '/audio/oneshots/horn.mp3',
    'Alarm Horn': '/audio/oneshots/horn.mp3',
    'Church Bell': '/audio/oneshots/church_bell.mp3',
    'Crow Caw': '/audio/oneshots/crow.mp3',
    'Seagull Cry': '/audio/oneshots/seagull.mp3',
    'Wolf Howl': '/audio/oneshots/wolf_howl.mp3',
    'Wolf Growl': '/audio/oneshots/wolf_growl.mp3',
    'Dragon Roar': '/audio/oneshots/dragon_roar.mp3',
    'Monster Roar': '/audio/oneshots/monster_roar.mp3',
    'Orc Scream': '/audio/oneshots/orc_screem.mp3',
    'Explosion Boom': '/audio/oneshots/explosion_boom.mp3',
    'Water Splash': '/audio/oneshots/water_splash.mp3',
    'Door Open': '/audio/oneshots/door_open.mp3',
    'Door Close': '/audio/oneshots/door_closed.mp3',
    'Chest Open': '/audio/oneshots/chest_open.mp3',
    'Chest Close': '/audio/oneshots/chest_closed.mp3',
    'Chain Rattle': '/audio/oneshots/chai_rattle.mp3',
    'Shield Block': '/audio/oneshots/shield_block.mp3',
    'Lock Click': '/audio/oneshots/door_knocking.mp3',
    'Glass Break': '/audio/oneshots/glass_smashmp3.mp3',
    'Fire Crackle': '/audio/oneshots/firecrackle.mp3',
    'Arrow Hit': '/audio/oneshots/sword_slash.mp3',
    'Coin Jingle': '/audio/oneshots/coins.mp3',
    'Branch Snap': '/audio/oneshots/stick_snap.mp3',
    'Ghostly Whisper': '/audio/oneshots/whisper_female.mp3',
    'Spell Cast': '/audio/oneshots/spell_cast.mp3',
    'Rockfall': '/audio/oneshots/rockfall.mp3',
    'Glass Shatter': '/audio/oneshots/glass_smashmp3.mp3',
    'Water Drip': '/audio/oneshots/water_drip.mp3',
    'Lightning Strike': '/audio/oneshots/thunder.mp3',
  };

  constructor(
    private audioService: AudioService,
    private timeOfDayService: TimeOfDayService,
  ) {}

  ngOnInit(): void {
    this.activeTime = this.timeOfDayService.currentTime;
  }

  //#region Time
  setTime(time: string) {
    const normalized = time.toLowerCase();

    if (this.activeTime === normalized) {
      this.timeOfDayService.setTime(null);
      this.activeTime = null;
      return;
    }

    this.timeOfDayService.setTime(time);
    this.activeTime = normalized;
  }
  //#endregion

  //#region Oneshots
  playOneshot(sound: string) {
    const path = this.oneshotPaths[sound];
    if (path) {
      this.audioService.playOneShot(path);
    }
  }
  //#endregion
}