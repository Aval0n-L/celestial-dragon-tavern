import { 
  Component, 
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild, 
  ElementRef, 
  Input, 
  HostListener } from '@angular/core';

@Component({
  selector: 'app-snowfall',
  standalone: true,
  imports: [],
  templateUrl: './snowfall.component.html',
  styleUrl: './snowfall.component.scss'
})
export class SnowfallComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvasSnow', { static: true }) canvasSnowRef!: ElementRef<HTMLCanvasElement>;

  private ctxSnow!: CanvasRenderingContext2D;
  private canvasWidth!: number;
  private canvasHeight!: number;
  private animationFrameId: number | null = null;
  private tick = 0;
  
  @Input()
  set snowIntensity(intensity: number) {
    this._snowIntensity = intensity;
    this.updateSnowflakeDrops();
  }

  get snowIntensity(): number {
    return this._snowIntensity;
  }

  private _snowIntensity: number = 15;
  private snowflakes: Snowflake[] = [];
  private maxSnowflakesCount = 500;
  private snowflakeCount!: number;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initializeCanvas();
    this.initializeSnowflakes();
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
    this.initializeSnowflakes();
  }

  private initializeCanvas(): void {
    this.ctxSnow = this.canvasSnowRef.nativeElement.getContext('2d')!;
    this.updateCanvasSize();
  }

  private updateCanvasSize(): void {
    this.canvasWidth = this.canvasSnowRef.nativeElement.width = window.innerWidth;
    this.canvasHeight = this.canvasSnowRef.nativeElement.height = window.innerHeight;
  }

  private updateSnowflakeDrops(): void {
    this.snowflakeCount = Math.floor(this.maxSnowflakesCount * (this._snowIntensity / 100));
    this.initializeSnowflakes();
  }

  private initializeSnowflakes(): void {
    this.snowflakes = [];
    for (let i = 0; i < this.snowflakeCount; i++) {
      this.snowflakes.push({
        x: Math.random() * this.canvasWidth,
        y: Math.random() * this.canvasHeight,
        radius: Math.random() * 3 + 1,
        speedY: (Math.random() * 1.2 + 0.6) * (this._snowIntensity / 50),
        speedX: (Math.random() - 0.5) * 0.8,
        opacity: Math.random() * 0.5 + 0.3,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.04,
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.03 + 0.01,
      });
    }
  }

  private startAnimationLoop(): void {
    const animate = () => {
      this.tick++;
      this.clearCanvas();
      this.drawSnowflakes();
      this.animationFrameId = requestAnimationFrame(animate);
    };
    animate();
  }

  private clearCanvas(): void {
    this.ctxSnow.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  private drawSnowflakes(): void {
    for (const snowflake of this.snowflakes) {
      snowflake.wobblePhase += snowflake.wobbleSpeed;
      snowflake.x += snowflake.speedX + Math.sin(snowflake.wobblePhase) * 0.6;
      snowflake.y += snowflake.speedY;
      snowflake.angle += snowflake.spin;

      this.drawSnowflakeShape(snowflake);

      if (snowflake.y > this.canvasHeight + 10) {
        snowflake.y = -snowflake.radius;
        snowflake.x = Math.random() * this.canvasWidth;
      }
      if (snowflake.x > this.canvasWidth + 10) {
        snowflake.x = -10;
      } else if (snowflake.x < -10) {
        snowflake.x = this.canvasWidth + 10;
      }
    }
  }

  private drawSnowflakeShape(snowflake: Snowflake): void {
    this.ctxSnow.save();
    this.ctxSnow.translate(snowflake.x, snowflake.y);
    this.ctxSnow.rotate(snowflake.angle);
    this.ctxSnow.strokeStyle = `rgba(255, 255, 255, ${snowflake.opacity})`;
    this.ctxSnow.lineWidth = 1;
    this.ctxSnow.lineCap = 'round';

    for (let i = 0; i < 3; i++) {
      this.ctxSnow.beginPath();
      this.ctxSnow.moveTo(0, -snowflake.radius);
      this.ctxSnow.lineTo(0, snowflake.radius);
      this.ctxSnow.stroke();
      this.ctxSnow.rotate(Math.PI / 3);
    }

    this.ctxSnow.restore();
  }
}

interface Snowflake {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  speedX: number;
  opacity: number;
  angle: number;
  spin: number;
  wobblePhase: number;
  wobbleSpeed: number;
}
