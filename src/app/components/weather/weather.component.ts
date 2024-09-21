import { NgClass } from '@angular/common';
import { Component, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [ NgClass ],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.css'
})
export class WeatherComponent implements OnChanges {
  @Input() weatherType: string = '';
  @Input() intensity: number = 50;

  constructor(private el: ElementRef, private renderer: Renderer2) {}
  
  ngOnChanges() {
    // Обновление анимации в зависимости от типа погоды и интенсивности
    console.log(`Weather changed to: ${this.weatherType} with intensity: ${this.intensity}`);
    const weatherElement = this.el.nativeElement.querySelector('.' + this.weatherType);
    if (weatherElement) {
      this.renderer.setStyle(weatherElement, 'opacity', this.intensity / 100);
    }
  }
}
