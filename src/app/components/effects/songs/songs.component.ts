import { Component, OnInit } from '@angular/core';
import { Songs } from '../../../models/songs.model';
import { FormsModule } from '@angular/forms';
import { NgClass, NgFor } from '@angular/common';
import { AudioService } from '../../../services/audio.service';

@Component({
  selector: 'app-songs',
  standalone: true,
  imports: [FormsModule, NgClass, NgFor],
  templateUrl: './songs.component.html',
  styleUrl: './songs.component.scss'
})
export class SongsComponent implements OnInit {
  songVolume: number = 75;
  isPlay: boolean = false;
  
  songs: { [key in Songs]?: string } = {};
  songKeys: Songs[] = [];
  activeSong: Songs | null = null;

  constructor(private audioService: AudioService) {}
  
  ngOnInit() {
    this.songs = {
      [Songs.Explore]: '/songs/explore.mp3',
      [Songs.ActivePhase]: '/songs/active_phase.mp3',
      [Songs.Combat]: '/songs/combat.mp3',
      [Songs.Chase]: '/songs/chase.mp3',
      [Songs.Victory]: '/songs/victory.mp3',
      [Songs.Defeat]: '/songs/defeat.mp3'
    };
    
    this.songKeys = this.songKeys = Object.keys(this.songs) as Songs[];
  }
  
  toggleSong(song: Songs) {
    const path = this.songs[song];

    if (path) {
      if (this.isPlay && this.activeSong === song) {
        this.audioService.pauseSound(song);
        this.isPlay = false;
        this.activeSong = null; 
      } else {
        if (this.activeSong) {
          this.audioService.pauseSound(this.activeSong); // Let's stop the previous song if there was one
        }

        this.audioService.playSound(song, path, this.songVolume, true);
        this.isPlay = true;
        this.activeSong = song;
      }
    } else {
      console.log('Song not found');
    }
  }

  updateVolume(newVolume: number) {
    this.songVolume = newVolume;
    if (this.activeSong) {
      this.audioService.setVolume(this.activeSong, newVolume);
    }
  }
}
