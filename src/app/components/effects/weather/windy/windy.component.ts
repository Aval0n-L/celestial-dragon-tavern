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

  private _windIntensity: number = 50;

  @Input()
  set windIntensity(intensity: number) {
    this._windIntensity = intensity;
    this.updateWindParticles();
  }

  get windIntensity(): number {
    return this._windIntensity;
  }

  private windParticles: WindParticle[] = [];
  private maxWindParticles = 25;
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
        // Setting up the parameters for the layer
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

      // Updating the position
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      // Increasing lifespan
      particle.lifeTime++;

      // If a particle "dies" or goes beyond the screen, we replace it with a new one
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

      // Draw a particle
      const colors = ['rgba(255, 255, 255, ', 'rgba(200, 200, 255, ', 'rgba(180, 180, 200, '];
      const color = colors[Math.floor(Math.random() * colors.length)];


      // Adding a blur effect
      this.ctx.filter = 'blur(0.5px)';

      // Draw the particle as a small line
      this.ctx.strokeStyle = color + `${particle.opacity})`;
      this.ctx.lineWidth = particle.size;
      this.ctx.beginPath();
      this.ctx.moveTo(particle.x, particle.y);
      this.ctx.lineTo(particle.x - particle.speedX * 5, particle.y - particle.speedY * 5);
      this.ctx.stroke();

      // Disable filter after rendering
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
