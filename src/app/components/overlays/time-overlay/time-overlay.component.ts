import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { TimeOfDayService } from '../../../services/time-of-day.service';

interface TimeVisualConfig {
  topColor: [number, number, number, number];
  bottomColor: [number, number, number, number];
  sunX: number;
  sunY: number;
  sunRadius: number;
  sunOpacity: number;
  moonX: number;
  moonY: number;
  moonOpacity: number;
  starCount: number;
  starOpacity: number;
  rayCount: number;
}

interface Star {
  x: number;
  y: number;
  radius: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

interface SunRay {
  angle: number;
  length: number;
  speed: number;
}

const TIME_CONFIGS: Record<string, TimeVisualConfig> = {
  dawn: {
    topColor: [255, 120, 60, 0.45],
    bottomColor: [255, 200, 120, 0.2],
    sunX: 0.18,
    sunY: 0.72,
    sunRadius: 90,
    sunOpacity: 0.55,
    moonX: 0.82,
    moonY: 0.2,
    moonOpacity: 0,
    starCount: 0,
    starOpacity: 0,
    rayCount: 6,
  },
  midday: {
    topColor: [255, 255, 220, 0.18],
    bottomColor: [255, 240, 180, 0.08],
    sunX: 0.72,
    sunY: 0.14,
    sunRadius: 120,
    sunOpacity: 0.7,
    moonX: 0.1,
    moonY: 0.8,
    moonOpacity: 0,
    starCount: 0,
    starOpacity: 0,
    rayCount: 10,
  },
  day: {
    topColor: [255, 255, 255, 0.06],
    bottomColor: [200, 230, 255, 0.04],
    sunX: 0.55,
    sunY: 0.22,
    sunRadius: 80,
    sunOpacity: 0.45,
    moonX: 0.1,
    moonY: 0.8,
    moonOpacity: 0,
    starCount: 0,
    starOpacity: 0,
    rayCount: 5,
  },
  evening: {
    topColor: [255, 80, 20, 0.5],
    bottomColor: [90, 40, 110, 0.35],
    sunX: 0.82,
    sunY: 0.68,
    sunRadius: 100,
    sunOpacity: 0.6,
    moonX: 0.15,
    moonY: 0.25,
    moonOpacity: 0.15,
    starCount: 20,
    starOpacity: 0.35,
    rayCount: 7,
  },
  twilight: {
    topColor: [110, 60, 160, 0.55],
    bottomColor: [25, 15, 70, 0.45],
    sunX: 0.9,
    sunY: 0.78,
    sunRadius: 60,
    sunOpacity: 0.2,
    moonX: 0.25,
    moonY: 0.18,
    moonOpacity: 0.55,
    starCount: 80,
    starOpacity: 0.65,
    rayCount: 0,
  },
  night: {
    topColor: [8, 18, 55, 0.55],
    bottomColor: [5, 10, 35, 0.4],
    sunX: 0.5,
    sunY: 1.2,
    sunRadius: 0,
    sunOpacity: 0,
    moonX: 0.72,
    moonY: 0.16,
    moonOpacity: 0.75,
    starCount: 140,
    starOpacity: 0.85,
    rayCount: 0,
  },
  midnight: {
    topColor: [5, 5, 25, 0.72],
    bottomColor: [15, 8, 45, 0.58],
    sunX: 0.5,
    sunY: 1.2,
    sunRadius: 0,
    sunOpacity: 0,
    moonX: 0.38,
    moonY: 0.12,
    moonOpacity: 0.9,
    starCount: 220,
    starOpacity: 1,
    rayCount: 0,
  },
};

const DEFAULT_CONFIG: TimeVisualConfig = {
  topColor: [0, 0, 0, 0],
  bottomColor: [0, 0, 0, 0],
  sunX: 0.5,
  sunY: 1.2,
  sunRadius: 0,
  sunOpacity: 0,
  moonX: 0.5,
  moonY: 0.2,
  moonOpacity: 0,
  starCount: 0,
  starOpacity: 0,
  rayCount: 0,
};

@Component({
  selector: 'app-time-overlay',
  standalone: true,
  imports: [],
  templateUrl: './time-overlay.component.html',
  styleUrl: './time-overlay.component.scss',
})
export class TimeOverlayComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvasTime', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private canvasWidth = 0;
  private canvasHeight = 0;
  private animationFrameId: number | null = null;
  private subscription?: Subscription;
  private tick = 0;

  private targetConfig: TimeVisualConfig = { ...DEFAULT_CONFIG };
  private currentConfig: TimeVisualConfig = { ...DEFAULT_CONFIG };
  private stars: Star[] = [];
  private sunRays: SunRay[] = [];

  constructor(private timeOfDayService: TimeOfDayService) {}

  ngOnInit() {
    this.applyTime(this.timeOfDayService.currentTime);
    this.subscription = this.timeOfDayService.timeOfDay$.subscribe(time => {
      this.applyTime(time);
    });
  }

  ngAfterViewInit() {
    this.initializeCanvas();
    this.startAnimationLoop();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.updateCanvasSize();
    this.buildStars(Math.max(this.targetConfig.starCount, this.currentConfig.starCount));
  }

  private applyTime(time: string | null) {
    this.targetConfig = time && TIME_CONFIGS[time]
      ? { ...TIME_CONFIGS[time] }
      : { ...DEFAULT_CONFIG };
    this.buildStars(this.targetConfig.starCount);
    this.buildSunRays(this.targetConfig.rayCount);
  }

  private initializeCanvas() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.updateCanvasSize();
  }

  private updateCanvasSize() {
    this.canvasWidth = this.canvasRef.nativeElement.width = window.innerWidth;
    this.canvasHeight = this.canvasRef.nativeElement.height = window.innerHeight;
  }

  private buildStars(count: number) {
    this.stars = [];
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.canvasWidth,
        y: Math.random() * this.canvasHeight * 0.75,
        radius: Math.random() * 1.6 + 0.4,
        twinkleSpeed: Math.random() * 0.04 + 0.01,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }
  }

  private buildSunRays(count: number) {
    this.sunRays = [];
    for (let i = 0; i < count; i++) {
      this.sunRays.push({
        angle: (Math.PI * 2 * i) / count,
        length: 180 + Math.random() * 120,
        speed: (Math.random() - 0.5) * 0.004,
      });
    }
  }

  private startAnimationLoop() {
    const animate = () => {
      this.tick++;
      this.lerpConfig();
      this.draw();
      this.animationFrameId = requestAnimationFrame(animate);
    };
    animate();
  }

  private lerpConfig() {
    this.currentConfig.sunX += (this.targetConfig.sunX - this.currentConfig.sunX) * 0.04;
    this.currentConfig.sunY += (this.targetConfig.sunY - this.currentConfig.sunY) * 0.04;
    this.currentConfig.sunRadius += (this.targetConfig.sunRadius - this.currentConfig.sunRadius) * 0.04;
    this.currentConfig.sunOpacity += (this.targetConfig.sunOpacity - this.currentConfig.sunOpacity) * 0.04;
    this.currentConfig.moonX += (this.targetConfig.moonX - this.currentConfig.moonX) * 0.04;
    this.currentConfig.moonY += (this.targetConfig.moonY - this.currentConfig.moonY) * 0.04;
    this.currentConfig.moonOpacity += (this.targetConfig.moonOpacity - this.currentConfig.moonOpacity) * 0.04;
    this.currentConfig.starCount += (this.targetConfig.starCount - this.currentConfig.starCount) * 0.04;
    this.currentConfig.starOpacity += (this.targetConfig.starOpacity - this.currentConfig.starOpacity) * 0.04;
    this.currentConfig.rayCount += (this.targetConfig.rayCount - this.currentConfig.rayCount) * 0.04;

    for (let i = 0; i < 4; i++) {
      this.currentConfig.topColor[i] += (this.targetConfig.topColor[i] - this.currentConfig.topColor[i]) * 0.04;
      this.currentConfig.bottomColor[i] += (this.targetConfig.bottomColor[i] - this.currentConfig.bottomColor[i]) * 0.04;
    }
  }

  private draw() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.drawGradientOverlay();
    this.drawStars();
    this.drawSun();
    this.drawMoon();
  }

  private drawGradientOverlay() {
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvasHeight);
    const top = this.currentConfig.topColor;
    const bottom = this.currentConfig.bottomColor;

    gradient.addColorStop(0, `rgba(${top[0]}, ${top[1]}, ${top[2]}, ${top[3]})`);
    gradient.addColorStop(1, `rgba(${bottom[0]}, ${bottom[1]}, ${bottom[2]}, ${bottom[3]})`);

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  private drawStars() {
    if (this.currentConfig.starOpacity <= 0.01 || this.stars.length === 0) {
      return;
    }

    for (const star of this.stars) {
      const twinkle = 0.55 + 0.45 * Math.sin(this.tick * star.twinkleSpeed + star.twinkleOffset);
      const alpha = this.currentConfig.starOpacity * twinkle;

      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      this.ctx.fill();
    }
  }

  private drawSun() {
    if (this.currentConfig.sunOpacity <= 0.01 || this.currentConfig.sunRadius <= 1) {
      return;
    }

    const sunX = this.currentConfig.sunX * this.canvasWidth;
    const sunY = this.currentConfig.sunY * this.canvasHeight;
    const radius = this.currentConfig.sunRadius;

    for (const ray of this.sunRays) {
      ray.angle += ray.speed;
      const endX = sunX + Math.cos(ray.angle) * ray.length;
      const endY = sunY + Math.sin(ray.angle) * ray.length;

      const rayGradient = this.ctx.createLinearGradient(sunX, sunY, endX, endY);
      rayGradient.addColorStop(0, `rgba(255, 240, 180, ${this.currentConfig.sunOpacity * 0.35})`);
      rayGradient.addColorStop(1, 'rgba(255, 240, 180, 0)');

      this.ctx.beginPath();
      this.ctx.moveTo(sunX, sunY);
      this.ctx.lineTo(endX, endY);
      this.ctx.strokeStyle = rayGradient;
      this.ctx.lineWidth = 3;
      this.ctx.stroke();
    }

    const glow = this.ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, radius * 1.8);
    glow.addColorStop(0, `rgba(255, 250, 210, ${this.currentConfig.sunOpacity})`);
    glow.addColorStop(0.4, `rgba(255, 210, 100, ${this.currentConfig.sunOpacity * 0.45})`);
    glow.addColorStop(1, 'rgba(255, 180, 60, 0)');

    this.ctx.beginPath();
    this.ctx.arc(sunX, sunY, radius * 1.8, 0, Math.PI * 2);
    this.ctx.fillStyle = glow;
    this.ctx.fill();
  }

  private drawMoon() {
    if (this.currentConfig.moonOpacity <= 0.01) {
      return;
    }

    const moonX = this.currentConfig.moonX * this.canvasWidth;
    const moonY = this.currentConfig.moonY * this.canvasHeight;
    const radius = 36;

    const glow = this.ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, radius * 3);
    glow.addColorStop(0, `rgba(230, 235, 255, ${this.currentConfig.moonOpacity * 0.9})`);
    glow.addColorStop(0.35, `rgba(200, 210, 255, ${this.currentConfig.moonOpacity * 0.35})`);
    glow.addColorStop(1, 'rgba(180, 190, 255, 0)');

    this.ctx.beginPath();
    this.ctx.arc(moonX, moonY, radius * 3, 0, Math.PI * 2);
    this.ctx.fillStyle = glow;
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.arc(moonX, moonY, radius, 0, Math.PI * 2);
    this.ctx.fillStyle = `rgba(240, 242, 255, ${this.currentConfig.moonOpacity})`;
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.arc(moonX + radius * 0.35, moonY - radius * 0.1, radius * 0.85, 0, Math.PI * 2);
    this.ctx.fillStyle = `rgba(200, 210, 240, ${this.currentConfig.moonOpacity * 0.35})`;
    this.ctx.fill();
  }
}
