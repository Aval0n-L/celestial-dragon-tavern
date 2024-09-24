import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input, HostListener } from '@angular/core';

@Component({
  selector: 'app-clear-sky',
  standalone: true,
  imports: [],
  templateUrl: './clear-sky.component.html',
  styleUrl: './clear-sky.component.css'
})
export class ClearSkyComponent implements OnInit, AfterViewInit {
  @ViewChild('canvasFog', { static: true }) canvasFogRef!: ElementRef<HTMLCanvasElement>;

  private ctxFog!: CanvasRenderingContext2D;
  private canvasWidth!: number;
  private canvasHeight!: number;

  // Приватное поле для хранения значения интенсивности тумана
  private _fogIntensity: number = 15;

  @Input()
  set fogIntensity(intensity: number) {
    this._fogIntensity = intensity;
    this.updateFogSettings(); // Обновляем туман при изменении интенсивности
  }

  get fogIntensity(): number {
    return this._fogIntensity;
  }

  // Слои тумана
  private fogLayers: FogLayer[] = [];
  private maxFogLayers = 3; // Три слоя тумана

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initializeCanvas();
    this.createFogLayers();
    this.startAnimationLoop();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.updateCanvasSize();
    this.createFogLayers(); // Пересоздаем слои тумана при изменении размера окна
  }

  // Инициализация canvas
  private initializeCanvas(): void {
    this.ctxFog = this.canvasFogRef.nativeElement.getContext('2d')!;
    this.updateCanvasSize();
  }

  private updateCanvasSize(): void {
    this.canvasWidth = this.canvasFogRef.nativeElement.width = window.innerWidth;
    this.canvasHeight = this.canvasFogRef.nativeElement.height = window.innerHeight;
  }

  // Создание слоев тумана
  private createFogLayers(): void {
    this.fogLayers = [];
    for (let i = 0; i < this.maxFogLayers; i++) {
      this.fogLayers.push({
        opacity: this.calculateLayerOpacity(i),
        speedX: this.calculateLayerSpeed(i),
        circles: this.generateFogCircles(), // Генерация кругов для тумана
        xPosition: 0,
        yPosition: 0
      });
    }
  }

  // Метод для обновления настроек тумана при изменении интенсивности
  private updateFogSettings(): void {
    if (!this.fogLayers || this.fogLayers.length === 0) {
      return;
    }
    for (let i = 0; i < this.maxFogLayers; i++) {
      this.fogLayers[i].opacity = this.calculateLayerOpacity(i);
      this.fogLayers[i].speedX = this.calculateLayerSpeed(i);
    }
  }

  // Вычисляем непрозрачность для каждого слоя в зависимости от интенсивности тумана
  private calculateLayerOpacity(layerIndex: number): number {
    return 0.1 + (this._fogIntensity / 100) * (0.5 - 0.1); // Изменяем прозрачность от 0.1 до 0.5
  }

  // Вычисляем скорость для каждого слоя в зависимости от интенсивности тумана
  private calculateLayerSpeed(layerIndex: number): number {
    const baseSpeed = 0.3 + (layerIndex * 0.2);
    return baseSpeed * (this._fogIntensity / 100); // Чем выше интенсивность, тем быстрее движение
  }

  // Генерация случайных кругов для слоя тумана
  private generateFogCircles(): FogCircle[] {
    const circles: FogCircle[] = [];
    const numCircles = 100; // Количество кругов на каждом слое

    for (let i = 0; i < numCircles; i++) {
      circles.push({
        x: Math.random() * this.canvasWidth,
        y: Math.random() * this.canvasHeight,
        radius: Math.random() * 50 + 20, // Радиус круга от 20 до 70
        opacity: Math.random() * 0.2 + 0.1 // Прозрачность каждого круга
      });
    }
    return circles;
  }

  // Анимация тумана
  private startAnimationLoop(): void {
    this.animate();
  }

  private animate(): void {
    this.clearCanvas();
    this.drawFogLayers();
    requestAnimationFrame(() => this.animate());
  }

  private clearCanvas(): void {
    this.ctxFog.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  // Отрисовка слоев тумана
  private drawFogLayers(): void {
    for (const layer of this.fogLayers) {
      this.ctxFog.globalAlpha = layer.opacity;

      // Отрисовываем каждый круг на слое
      for (const circle of layer.circles) {
        this.ctxFog.beginPath();
        this.ctxFog.arc(circle.x + layer.xPosition, circle.y, circle.radius, 0, Math.PI * 2);
        this.ctxFog.fillStyle = `rgba(255, 255, 255, ${circle.opacity})`;
        this.ctxFog.fill();
      }

      // Обновляем горизонтальную позицию слоя с учетом скорости
      layer.xPosition += layer.speedX;

      // Если слой выходит за пределы экрана, сбрасываем позицию
      if (layer.xPosition >= this.canvasWidth) {
        layer.xPosition = 0;
      }
    }
  }
}

interface FogLayer {
  opacity: number;
  speedX: number;
  circles: FogCircle[];
  xPosition: number;
  yPosition: number;
}

interface FogCircle {
  x: number;
  y: number;
  radius: number;
  opacity: number;
}