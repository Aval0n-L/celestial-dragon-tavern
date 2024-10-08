import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input, HostListener } from '@angular/core';

@Component({
  selector: 'app-clear-sky',
  standalone: true,
  imports: [],
  templateUrl: './clear-sky.component.html',
  styleUrl: './clear-sky.component.scss'
})
export class ClearSkyComponent implements OnInit, AfterViewInit {
  @ViewChild('canvasClearSky', { static: true }) canvasClearSkyRef!: ElementRef<HTMLCanvasElement>;

  private ctxClearSky!: CanvasRenderingContext2D;
  private canvasWidth!: number;
  private canvasHeight!: number;

  private _cloudIntensity: number = 0;

  @Input()
  set cloudIntensity(intensity: number) {
    this._cloudIntensity = intensity;
    this.updateSkySettings(); // Update settings when cloud intensity changes
  }

  get cloudIntensity(): number {
    return this._cloudIntensity;
  }

  private sunRays: SunRay[] = [];
  private maxSunRays = 10; // Maximum amount of sun glare

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initializeCanvas();
    this.createSunRays();
    this.startAnimationLoop();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.updateCanvasSize();
    this.createSunRays();
  }

  private initializeCanvas(): void {
    this.ctxClearSky = this.canvasClearSkyRef.nativeElement.getContext('2d')!;
    this.updateCanvasSize();
  }

  private updateCanvasSize(): void {
    this.canvasWidth = this.canvasClearSkyRef.nativeElement.width = window.innerWidth;
    this.canvasHeight = this.canvasClearSkyRef.nativeElement.height = window.innerHeight;
  }

  private createSunRays(): void {
    this.sunRays = [];
    const sunRayCount = this.calculateSunRayCount();

    for (let i = 0; i < sunRayCount; i++) {
      this.sunRays.push(this.createRandomSunRay());
    }
  }

  private updateSkySettings(): void {
    this.createSunRays(); // Re-creating glare when changing cloud intensity
  }

  private calculateSunRayCount(): number {
    const normalizedIntensity = 100 - this._cloudIntensity; // Invert the intensity
    return Math.floor((this.maxSunRays * normalizedIntensity) / 100);
  }

  private createRandomSunRay(): SunRay {
    const radius = Math.random() * 50 + 50;
    const angle = Math.random() * Math.PI * 2; // Random angle for direction of movement
    const speed = Math.random() * 0.5 + 0.2; // Speed ​​from 0.2 to 0.7

    return {
      x: Math.random() * this.canvasWidth,
      y: Math.random() * this.canvasHeight,
      radius: radius,
      opacity: 0, // Let's start with zero transparency
      maxOpacity: Math.random() * 0.5 + 0.5, // Maximum transparency from 0.5 to 1
      fadeInRate: Math.random() * 0.01 + 0.005, // Скорость появления
      fadeOutRate: Math.random() * 0.005 + 0.0025, // Скорость исчезновения
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      lifeTime: 0,
      maxLifeTime: Math.random() * 500 + 500 // Lifetime from 500 to 1000 frames
    };
  }

  private startAnimationLoop(): void {
    this.animate();
  }

  private animate(): void {
    this.clearCanvas();
    this.updateAndDrawSunRays();
    requestAnimationFrame(() => this.animate());
  }

  private clearCanvas(): void {
    this.ctxClearSky.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  private updateAndDrawSunRays(): void {
    for (let i = 0; i < this.sunRays.length; i++) {
      const sunRay = this.sunRays[i];

      // Обновляем позицию
      sunRay.x += sunRay.vx;
      sunRay.y += sunRay.vy;

      // Updating transparency
      if (sunRay.lifeTime < sunRay.maxLifeTime / 2) {
        // Appearance
        sunRay.opacity += sunRay.fadeInRate;
        if (sunRay.opacity > sunRay.maxOpacity) {
          sunRay.opacity = sunRay.maxOpacity;
        }
      } else {
        // Disappearance
        sunRay.opacity -= sunRay.fadeOutRate;
        if (sunRay.opacity < 0) {
          sunRay.opacity = 0;
        }
      }

      // Увеличиваем время жизни
      sunRay.lifeTime++;

      // Если блик "умер", заменяем его новым
      if (sunRay.lifeTime >= sunRay.maxLifeTime || sunRay.opacity <= 0) {
        this.sunRays[i] = this.createRandomSunRay();
        continue;
      }

      // Draw a glare
      this.ctxClearSky.beginPath();
      this.ctxClearSky.arc(sunRay.x, sunRay.y, sunRay.radius, 0, Math.PI * 2);
      const gradient = this.ctxClearSky.createRadialGradient(
        sunRay.x,
        sunRay.y,
        0,
        sunRay.x,
        sunRay.y,
        sunRay.radius
      );
      gradient.addColorStop(0, `rgba(255, 255, 224, ${sunRay.opacity})`);
      gradient.addColorStop(1, `rgba(255, 255, 224, 0)`);
      this.ctxClearSky.fillStyle = gradient;
      this.ctxClearSky.fill();
    }
  }
}

interface SunRay {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  maxOpacity: number;
  fadeInRate: number;
  fadeOutRate: number;
  vx: number; // X-axis speed
  vy: number; // Speed ​​along the Y axis
  lifeTime: number;
  maxLifeTime: number;
}