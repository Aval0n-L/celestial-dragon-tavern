import {
   AfterViewInit,
   Component,
   ElementRef,
   HostListener,
   Input,
   OnDestroy,
   OnInit,
   ViewChild } from '@angular/core';

@Component({
  selector: 'app-rain',
  standalone: true,
  imports: [],
  templateUrl: './rain.component.html',
  styleUrl: './rain.component.scss'
})
export class RainComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvasRain', { static: true })
  canvasRainRef!: ElementRef<HTMLCanvasElement>;

  private ctxRain!: CanvasRenderingContext2D;
  private canvasWidth!: number;
  private canvasHeight!: number;
  private animationFrameId: number | null = null;

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
  private maxRainCount = 600;
  private rainCount!: number;
  private rainDrops: RainDrop[] = [];
  private splashes: Splash[] = [];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initializeCanvas();
    this.updateRainDrops();
    this.startAnimationLoop();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
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

  private windStrength(): number {
    return (this._rainIntensity / 100) * 5;
  }

  private initializeRainDrops(): void {
    this.rainDrops = [];
    for (let i = 0; i < this.rainCount; i++) {
      this.rainDrops.push(this.createRainDrop(true));
    }
  }

  private createRainDrop(randomY: boolean): RainDrop {
    const wind = this.windStrength();
    return {
      x: Math.random() * this.canvasWidth,
      y: randomY ? Math.random() * this.canvasHeight : -30,
      length: Math.random() * 18 + 12,
      speedY: Math.random() * 5 + 8,
      speedX: wind + (Math.random() - 0.5) * 1.5,
      opacity: Math.random() * 0.4 + 0.35,
      width: Math.random() * 1.2 + 0.6,
    };
  }

  private startAnimationLoop(): void {
    const animate = () => {
      this.drawFrame();
      this.animationFrameId = requestAnimationFrame(animate);
    };
    animate();
  }

  private drawFrame(): void {
    this.ctxRain.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.drawRainDrops();
    this.drawSplashes();
  }

  private drawRainDrops(): void {
    for (const drop of this.rainDrops) {
      const tailX = drop.x - drop.speedX * 1.8;
      const tailY = drop.y - drop.length;

      const gradient = this.ctxRain.createLinearGradient(drop.x, drop.y, tailX, tailY);
      gradient.addColorStop(0, `rgba(${this.rainColor}, ${drop.opacity})`);
      gradient.addColorStop(1, `rgba(${this.rainColor}, 0)`);

      this.ctxRain.beginPath();
      this.ctxRain.moveTo(drop.x, drop.y);
      this.ctxRain.lineTo(tailX, tailY);
      this.ctxRain.strokeStyle = gradient;
      this.ctxRain.lineWidth = drop.width;
      this.ctxRain.lineCap = 'round';
      this.ctxRain.stroke();

      drop.x += drop.speedX;
      drop.y += drop.speedY;

      if (drop.y > this.canvasHeight) {
        this.spawnSplash(drop.x, this.canvasHeight - 2);
        Object.assign(drop, this.createRainDrop(false));
        drop.x = Math.random() * this.canvasWidth;
      } else if (drop.x > this.canvasWidth + 20) {
        drop.x = -20;
      } else if (drop.x < -20) {
        drop.x = this.canvasWidth + 20;
      }
    }
  }

  private spawnSplash(x: number, y: number): void {
    if (Math.random() > 0.35) {
      return;
    }

    this.splashes.push({
      x,
      y,
      radius: Math.random() * 2 + 1,
      life: 0,
      maxLife: Math.random() * 8 + 6,
    });
  }

  private drawSplashes(): void {
    for (let i = this.splashes.length - 1; i >= 0; i--) {
      const splash = this.splashes[i];
      splash.life++;
      const progress = splash.life / splash.maxLife;
      const alpha = (1 - progress) * 0.35;

      this.ctxRain.beginPath();
      this.ctxRain.ellipse(
        splash.x,
        splash.y,
        splash.radius + progress * 5,
        (splash.radius + progress * 5) * 0.35,
        0,
        0,
        Math.PI * 2
      );
      this.ctxRain.strokeStyle = `rgba(${this.rainColor}, ${alpha})`;
      this.ctxRain.lineWidth = 1;
      this.ctxRain.stroke();

      if (splash.life >= splash.maxLife) {
        this.splashes.splice(i, 1);
      }
    }
  }
}

interface RainDrop {
  x: number;
  y: number;
  length: number;
  speedY: number;
  speedX: number;
  opacity: number;
  width: number;
}

interface Splash {
  x: number;
  y: number;
  radius: number;
  life: number;
  maxLife: number;
}
