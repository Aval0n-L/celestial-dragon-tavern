import { Component, OnInit } from '@angular/core';
import { NgClass, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AudioService } from '../../../services/audio.service';

@Component({
  selector: 'app-ambience',
  standalone: true,
  imports: [FormsModule, NgClass, NgFor],
  templateUrl: './ambience.component.html',
  styleUrl: './ambience.component.scss'
})
export class AmbienceComponent implements OnInit {
  ambienceVolume = 75;
  activeAmbience: string | null = null;
  ambienceKeys: string[] = [];

  private readonly ambiencePaths: Record<string, string> = {
    'Forest': '/audio/ambience/forest.mp3',
    'Dungeon': '/audio/weather/fog.mp3',
    'City': '/audio/weather/windy.mp3',
    'Throne': '/ambience/ancient_temple.mp3',
    'Castle Courtyard': '/audio/weather/windy.mp3',
    'Castle Keep': '/ambience/ancient_temple.mp3',
    'Sea': '/audio/weather/tropicalstorm.mp3',
    'Arcane': '/audio/weather/clear_sky.mp3',
    'Grim or Dark': '/audio/weather/thunderstorm.mp3',
    'Ancient Temple': '/ambience/ancient_temple.mp3',
    'Desert': '/audio/weather/sandstorm.mp3',
    'Arctic': '/audio/weather/cold_snowfall.mp3',
    'Abandoned Ruins': '/audio/weather/rain.mp3',
    'Swamp': '/audio/weather/fog.mp3',
    'Astral Plane': '/audio/weather/clear_sky.mp3',
    'Mountain': '/audio/weather/windy.mp3',
    'Graveyard': '/audio/weather/fog.mp3',
    'Lava Cave': '/audio/weather/sandstorm.mp3',
    'Enchanted Forest': '/audio/ambience/forest.mp3',
    'Necropolis': '/audio/weather/blizzard.mp3',
  };

  constructor(private audioService: AudioService) {}

  ngOnInit() {
    this.ambienceKeys = Object.keys(this.ambiencePaths);
  }

  toggleAmbience(ambience: string) {
    const path = this.ambiencePaths[ambience];
    if (!path) {
      return;
    }

    if (this.activeAmbience === ambience) {
      this.audioService.pauseSound(ambience);
      this.activeAmbience = null;
    } else {
      if (this.activeAmbience) {
        this.audioService.pauseSound(this.activeAmbience);
      }
      this.audioService.playSound(ambience, path, this.ambienceVolume, true);
      this.activeAmbience = ambience;
    }
  }

  updateVolume(newVolume: number) {
    this.ambienceVolume = newVolume;
    if (this.activeAmbience) {
      this.audioService.setVolume(this.activeAmbience, newVolume);
    }
  }
}
