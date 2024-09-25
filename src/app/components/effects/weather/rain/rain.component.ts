import {
   AfterViewInit, 
   Component, 
   ElementRef, 
   HostListener, 
   Input, 
   OnInit, 
   ViewChild } from '@angular/core';
import { Weather } from '../../../../models/weather.model';

@Component({
  selector: 'app-rain',
  standalone: true,
  imports: [],
  templateUrl: './rain.component.html',
  styleUrl: './rain.component.scss'
})
export class RainComponent implements OnInit, AfterViewInit {
  @ViewChild('canvasRain', { static: true })
  canvasRainRef!: ElementRef<HTMLCanvasElement>;

  private ctxRain!: CanvasRenderingContext2D;
  private canvasWidth!: number;
  private canvasHeight!: number;

  @Input() rainColor: string = `255, 255, 255`;

  @Input()
  set rainIntensity(intensity: number) {
    this._rainIntensity = intensity;
    this.updateRainDrops();
  }

  get rainIntensity(): number {
    return this._rainIntensity;
  }

  private _rainIntensity: number = 15;

  private maxRainCount = 500;
  private rainCount!: number;
  private rainDrops: RainDrop[] = [];

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initializeCanvas();
    this.updateRainDrops();
    this.startAnimationLoop();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.updateCanvasSize();
  }

  private initializeCanvas(): void {
    this.ctxRain = this.canvasRainRef.nativeElement.getContext('2d')!;
    this.updateCanvasSize();
  }

  private updateCanvasSize(): void {
    this.canvasWidth = this.canvasRainRef.nativeElement.width = window.innerWidth;
    this.canvasHeight = this.canvasRainRef.nativeElement.height = window.innerHeight;
  }

  private updateRainDrops(): void {
    this.rainCount = Math.floor(this.maxRainCount * (this._rainIntensity / 100));
    this.initializeRainDrops();
  }

  private initializeRainDrops(): void {
    this.rainDrops = [];
    for (let i = 0; i < this.rainCount; i++) {
      this.rainDrops.push({
        x: Math.random() * this.canvasWidth,
        y: Math.random() * this.canvasHeight,
        length: Math.random() * 20 + 10,
        speedY: Math.random() * 4 + 4,
        //speedX: (this.rainIntensity / 50) * this.windDirection(),
        opacity: Math.random() * 0.5 + 0.3
      });
    }
  }

  // private windDirection(): number {
  //   return this.rainIntensity > 30 ? 1 : 0;
  // }

  private startAnimationLoop(): void {
    this.animate();
  }

  private animate(): void {
    this.clearCanvas();
    this.drawRainDrops();
    requestAnimationFrame(() => this.animate());
  }

  private clearCanvas(): void {
    this.ctxRain.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  private drawRainDrops(): void {
    for (const drop of this.rainDrops) {
      this.ctxRain.beginPath();
      this.ctxRain.moveTo(drop.x, drop.y);
      this.ctxRain.lineTo(drop.x, drop.y + drop.length);
      this.ctxRain.strokeStyle = `rgba(${this.rainColor}, ${drop.opacity})`;
      this.ctxRain.lineWidth = 1;
      this.ctxRain.stroke();

      drop.y += drop.speedY;
      //drop.x += drop.speedX;

      if (drop.y > this.canvasHeight) {
        drop.y = -drop.length;
        drop.x = Math.random() * this.canvasWidth;
      }
    }
  }
}

interface RainDrop {
  x: number;
  y: number;
  length: number;
  speedY: number;
  //speedX: number; wind
  opacity: number;
}