import { Component } from '@angular/core';

@Component({
  selector: 'app-ambience',
  standalone: true,
  imports: [],
  templateUrl: './ambience.component.html',
  styleUrl: './ambience.component.scss'
})
export class AmbienceComponent {
  toggleAmbience(ambience: string) {
    // Логика управления звуками атмосферы
    console.log(`Toggling ambience: ${ambience}`);
  }
}
