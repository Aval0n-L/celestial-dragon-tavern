import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input, HostListener } from '@angular/core';

@Component({
  selector: 'app-blizzard',
  standalone: true,
  imports: [],
  templateUrl: './blizzard.component.html',
  styleUrl: './blizzard.component.scss'
})
export class BlizzardComponent implements OnInit, AfterViewInit {
  @ViewChild('canvasBlizzard', { static: true }) canvasBlizzardRef!: ElementRef<HTMLCanvasElement>;

  private ctxBlizzard!: CanvasRenderingContext2D;
  private canvasWidth!: number;
  private canvasHeight!: number;

  @Input()
  set blizzardIntensity(intensity: number) {
    this._blizzardIntensity = intensity;
    this.updateSnowflakeDrops();
  }

  get blizzardIntensity(): number {
    return this._blizzardIntensity;
  }
  @Input() _blizzardIntensity: number = 15;

  private snowflakes: Blizzard[] = [];
  private maxBlizzard = 500; // Maximum number of snowflakes
  private blizzardCount!: number;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initializeCanvas();
    this.initializeBlizzard();
    this.startAnimationLoop();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.updateCanvasSize();
    this.initializeBlizzard(); // Re-create snowflakes when window size changes
  }

  // Инициализация canvas
  private initializeCanvas(): void {
    this.ctxBlizzard = this.canvasBlizzardRef.nativeElement.getContext('2d')!;
    this.updateCanvasSize();
  }

  private updateCanvasSize(): void {
    this.canvasWidth = this.canvasBlizzardRef.nativeElement.width = window.innerWidth;
    this.canvasHeight = this.canvasBlizzardRef.nativeElement.height = window.innerHeight;
  }

  private updateSnowflakeDrops(): void {
    this.blizzardCount = Math.floor(this.maxBlizzard * (this._blizzardIntensity / 100));
    this.initializeBlizzard();
  }

  // Create snowflakes based on the intensity of the snowstorm
  private initializeBlizzard(): void {
    this.snowflakes = [];
    for (let i = 0; i < this.blizzardCount; i++) {
      this.snowflakes.push({
        x: Math.random() * this.canvasWidth,
        y: Math.random() * this.canvasHeight,
        radius: Math.random() * 3 + 1,
        speedY: (Math.random() * 1 + 1) * (this.blizzardIntensity / 10), // Fall speed
        speedX: (Math.random() * 2 - 1) * (this.blizzardIntensity / 10), // Wind (horizontal movement)
        opacity: Math.random() * 0.5 + 0.3
      });
    }
  }

  // Анимация метели
  private startAnimationLoop(): void {
    this.animate();
  }

  private animate(): void {
    this.clearCanvas();
    this.drawSnowflakes();
    requestAnimationFrame(() => this.animate());
  }

  private clearCanvas(): void {
    this.ctxBlizzard.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  // Drawing snowflakes and their movement
  private drawSnowflakes(): void {
    for (const snowflake of this.snowflakes) {
      this.ctxBlizzard.beginPath();
      this.ctxBlizzard.arc(snowflake.x, snowflake.y, snowflake.radius, 0, Math.PI * 2);
      this.ctxBlizzard.fillStyle = `rgba(255, 255, 255, ${snowflake.opacity})`;
      this.ctxBlizzard.fill();

      // Update the position of the snowflake
      snowflake.y += snowflake.speedY;
      snowflake.x += snowflake.speedX; // Adding wind influence

      // Если снежинка выходит за пределы экрана, возвращаем её наверх
      if (snowflake.y > this.canvasHeight) {
        snowflake.y = -snowflake.radius;
        snowflake.x = Math.random() * this.canvasWidth;
      }

      // If the snowflake goes beyond the screen, we return it to the top
      if (snowflake.x > this.canvasWidth || snowflake.x < 0) {
        snowflake.x = Math.random() * this.canvasWidth;
        snowflake.y = Math.random() * this.canvasHeight / 2;
      }
    }
  }
}

interface Blizzard {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  speedX: number;
  opacity: number;
}
