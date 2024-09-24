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
    this.updateSnowflakeDrops(); // Обновляем снежинки при изменении интенсивности
  }

  get blizzardIntensity(): number {
    return this._blizzardIntensity;
  }
  @Input() _blizzardIntensity: number = 15; // Интенсивность метели (от 0 до 100)

  private snowflakes: Blizzard[] = [];
  private maxBlizzard = 500; // Максимальное количество снежинок
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
    this.initializeBlizzard(); // Пересоздаем снежинки при изменении размера окна
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

  // Создаем снежинки на основе интенсивности метели
  private initializeBlizzard(): void {
    this.snowflakes = [];
    for (let i = 0; i < this.blizzardCount; i++) {
      this.snowflakes.push({
        x: Math.random() * this.canvasWidth,
        y: Math.random() * this.canvasHeight,
        radius: Math.random() * 3 + 1,
        speedY: (Math.random() * 1 + 1) * (this.blizzardIntensity / 10), // Скорость падения
        speedX: (Math.random() * 2 - 1) * (this.blizzardIntensity / 10), // Ветер (горизонтальное движение)
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

  // Отрисовка снежинок и их движение
  private drawSnowflakes(): void {
    for (const snowflake of this.snowflakes) {
      this.ctxBlizzard.beginPath();
      this.ctxBlizzard.arc(snowflake.x, snowflake.y, snowflake.radius, 0, Math.PI * 2);
      this.ctxBlizzard.fillStyle = `rgba(255, 255, 255, ${snowflake.opacity})`;
      this.ctxBlizzard.fill();

      // Обновляем положение снежинки
      snowflake.y += snowflake.speedY;
      snowflake.x += snowflake.speedX; // Добавляем влияние ветра

      // Если снежинка выходит за пределы экрана, возвращаем её наверх
      if (snowflake.y > this.canvasHeight) {
        snowflake.y = -snowflake.radius;
        snowflake.x = Math.random() * this.canvasWidth;
      }

      // Если снежинка выходит за горизонтальные границы экрана
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
