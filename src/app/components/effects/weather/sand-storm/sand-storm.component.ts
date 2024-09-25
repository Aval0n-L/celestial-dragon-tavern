import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
  HostListener,
  OnDestroy,
} from '@angular/core';

@Component({
  selector: 'app-sand-storm',
  standalone: true,
  imports: [],
  templateUrl: './sand-storm.component.html',
  styleUrl: './sand-storm.component.scss'
})
export class SandStormComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvasSandStorm', { static: true })
  canvasSandStormRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private canvasWidth!: number;
  private canvasHeight!: number;

  private _sandStormIntensity: number = 50; // Интенсивность бури от 0 до 100

  @Input()
  set sandStormIntensity(intensity: number) {
    this._sandStormIntensity = intensity;
    this.updateSandParticles(); // Обновляем частицы при изменении интенсивности
  }

  get sandStormIntensity(): number {
    return this._sandStormIntensity;
  }

  private sandParticles: SandParticle[] = [];
  private maxSandParticles = 300; // Максимальное количество частиц
  private animationFrameId: number | null = null;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initializeCanvas();
    this.createSandParticles();
    this.startAnimationLoop();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.updateCanvasSize();
    this.createSandParticles();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private initializeCanvas(): void {
    this.ctx = this.canvasSandStormRef.nativeElement.getContext('2d')!;
    this.updateCanvasSize();
  }

  private updateCanvasSize(): void {
    this.canvasWidth = this.canvasSandStormRef.nativeElement.width = window.innerWidth;
    this.canvasHeight = this.canvasSandStormRef.nativeElement.height = window.innerHeight;
  }

  private createSandParticles(): void {
    this.sandParticles = [];
  
    const layers = 3; // Количество слоев
    for (let l = 0; l < layers; l++) {
      const layerParticleCount = Math.floor(
        (this.maxSandParticles * this._sandStormIntensity) / 100 / layers
      );
  
      for (let i = 0; i < layerParticleCount; i++) {
        const particle = this.createRandomSandParticle();
        // Настраиваем параметры для слоя
        particle.size *= 1 - l * 0.3;
        particle.speedX *= 1 + l * 0.5;
        particle.speedY *= 1 + l * 0.5;
        particle.opacity *= 1 - l * 0.2;
        this.sandParticles.push(particle);
      }
    }
  }

  private updateSandParticles(): void {
    this.createSandParticles();
  }

  private createRandomSandParticle(): SandParticle {
    const size = Math.random() * 2 + 1;
    const speed = Math.random() * 1 + 1 + (this.sandStormIntensity / 10 );
    const direction = (Math.random() * 20 - 10 + (this.sandStormIntensity / 10 )) * (Math.PI / 180);
  
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
    for (let i = 0; i < this.sandParticles.length; i++) {
      const particle = this.sandParticles[i];

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
        this.sandParticles[i] = this.createRandomSandParticle();
        continue;
      }

      // Рисуем частицу
      this.ctx.fillStyle = `rgba(210, 180, 140, ${particle.opacity})`; // Цвет песка (тан)
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }
}

interface SandParticle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  lifeTime: number;
  maxLifeTime: number;
}
