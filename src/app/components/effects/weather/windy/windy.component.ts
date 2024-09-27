import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  HostListener,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-windy',
  standalone: true,
  imports: [],
  templateUrl: './windy.component.html',
  styleUrl: './windy.component.scss'
})
export class WindyComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvasWindy', { static: true })
  canvasWindyRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private canvasWidth!: number;
  private canvasHeight!: number;

  private _windIntensity: number = 50; // Интенсивность ветра от 0 до 100

  @Input()
  set windIntensity(intensity: number) {
    this._windIntensity = intensity;
    this.updateWindParticles(); // Обновляем частицы при изменении интенсивности
  }

  get windIntensity(): number {
    return this._windIntensity;
  }

  private windParticles: WindParticle[] = [];
  private maxWindParticles = 25; // Максимальное количество частиц
  private animationFrameId: number | null = null;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initializeCanvas();
    this.createWindParticles();
    this.startAnimationLoop();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.updateCanvasSize();
    this.createWindParticles();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private initializeCanvas(): void {
    this.ctx = this.canvasWindyRef.nativeElement.getContext('2d')!;
    this.updateCanvasSize();
  }

  private updateCanvasSize(): void {
    this.canvasWidth = this.canvasWindyRef.nativeElement.width = window.innerWidth;
    this.canvasHeight = this.canvasWindyRef.nativeElement.height = window.innerHeight;
  }

  private createWindParticles(): void {
    this.windParticles = [];

    const layers = 3; // Количество слоев
    for (let l = 0; l < layers; l++) {
      const layerParticleCount = Math.floor(
        (this.maxWindParticles * this._windIntensity) / 100 / layers
      );

      for (let i = 0; i < layerParticleCount; i++) {
        const particle = this.createRandomWindParticle();
        // Настраиваем параметры для слоя
        particle.size *= 1 - l * 0.3;
        particle.speedX *= 1 + l * 0.5;
        particle.speedY *= 1 + l * 0.5;
        particle.opacity *= 1 - l * 0.2;
        this.windParticles.push(particle);
      }
    }
  }

  private updateWindParticles(): void {
    this.createWindParticles();
  }

  private createRandomWindParticle(): WindParticle {
    const size = Math.random() * 2 + 1;
    const speed = Math.random() * 1 + 1 + this._windIntensity / 10;
    const direction = (Math.random() * 20 - 10 + this._windIntensity / 10) * (Math.PI / 180);

    return {
      x: Math.random() * this.canvasWidth,
      y: Math.random() * this.canvasHeight,
      size: size,
      speedX: Math.cos(direction) * speed,
      speedY: Math.sin(direction) * speed,
      opacity: Math.random() * 0.5 + 0.5,
      lifeTime: 0,
      maxLifeTime: Math.random() * 200 + 100,
    };
  }

  private startAnimationLoop(): void {
    this.animate();
  }

  private animate = (): void => {
    this.clearCanvas();
    this.updateAndDrawParticles();
    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  private clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  private updateAndDrawParticles(): void {
    for (let i = 0; i < this.windParticles.length; i++) {
      const particle = this.windParticles[i];

      // Обновляем позицию
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      // Увеличиваем время жизни
      particle.lifeTime++;

      // Если частица "умерла" или вышла за пределы экрана, заменяем её новой
      if (
        particle.lifeTime >= particle.maxLifeTime ||
        particle.x > this.canvasWidth ||
        particle.y > this.canvasHeight ||
        particle.x < 0 ||
        particle.y < 0
      ) {
        this.windParticles[i] = this.createRandomWindParticle();
        continue;
      }

      // Рисуем частицу
      const colors = ['rgba(255, 255, 255, ', 'rgba(200, 200, 255, ', 'rgba(180, 180, 200, '];
      const color = colors[Math.floor(Math.random() * colors.length)];


      // Добавляем эффект размытия
      this.ctx.filter = 'blur(0.5px)';

      // Рисуем частицу как небольшую линию
      this.ctx.strokeStyle = color + `${particle.opacity})`;
      this.ctx.lineWidth = particle.size;
      this.ctx.beginPath();
      this.ctx.moveTo(particle.x, particle.y);
      this.ctx.lineTo(particle.x - particle.speedX * 5, particle.y - particle.speedY * 5);
      this.ctx.stroke();

      // Отключаем фильтр после отрисовки
      this.ctx.filter = 'none';
    }
  }
}

interface WindParticle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  lifeTime: number;
  maxLifeTime: number;
}
