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
  selector: 'app-tropical-storm',
  standalone: true,
  imports: [],
  templateUrl: './tropical-storm.component.html',
  styleUrl: './tropical-storm.component.scss'
})
export class TropicalStormComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvasTropicalStorm', { static: true })
  canvasTropicalStormRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private canvasWidth!: number;
  private canvasHeight!: number;

  private _tropicalStormIntensity: number = 15;

  @Input()
  set tropicalStormIntensity(intensity: number) {
    this._tropicalStormIntensity = intensity;
    this.updateStormSettings();
  }

  get tropicalStormIntensity(): number {
    return this._tropicalStormIntensity;
  }

  private rainDrops: RainDrop[] = [];
  private maxRainDrops = 500;

  private animationFrameId: number | null = null;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initializeCanvas();
    this.createRainDrops();
    this.startAnimationLoop();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.updateCanvasSize();
    this.createRainDrops();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private initializeCanvas(): void {
    this.ctx = this.canvasTropicalStormRef.nativeElement.getContext('2d')!;
    this.updateCanvasSize();
  }

  private updateCanvasSize(): void {
    this.canvasWidth = this.canvasTropicalStormRef.nativeElement.width = window.innerWidth;
    this.canvasHeight = this.canvasTropicalStormRef.nativeElement.height = window.innerHeight;
  }

  private createRainDrops(): void {
    this.rainDrops = [];
    const rainDropCount = Math.floor(
      (this.maxRainDrops * this._tropicalStormIntensity) / 100
    );

    for (let i = 0; i < rainDropCount; i++) {
      this.rainDrops.push(this.createRandomRainDrop());
    }
  }

  private createRandomRainDrop(): RainDrop {
    const length = Math.random() * 20 + 10;
    const speedY = Math.random() * 4 + 4 + (this._tropicalStormIntensity / 100) * 25;
    const speedX = (Math.random() * 2 - 1) + (this._tropicalStormIntensity / 100);

    return {
      x: Math.random() * this.canvasWidth,
      y: Math.random() * this.canvasHeight,
      length: length,
      speedX: speedX,
      speedY: speedY,
      opacity: Math.random() * 0.2 + 0.8,
    };
  }

  private updateStormSettings(): void {
    this.createRainDrops();
  }

  private startAnimationLoop(): void {
    this.animate();
  }

  private animate = (): void => {
    this.clearCanvas();
    this.drawRainDrops();
    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  private clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  private drawRainDrops(): void {
    this.ctx.strokeStyle = 'rgba(174,194,224,0.5)';
    this.ctx.lineWidth = 1;
    this.ctx.lineCap = 'round';

    for (const drop of this.rainDrops) {
      this.ctx.beginPath();
      this.ctx.moveTo(drop.x, drop.y);
      this.ctx.lineTo(drop.x + drop.speedX, drop.y + drop.length);
      this.ctx.stroke();

      // Update the position of the drop
      drop.x += drop.speedX;
      drop.y += drop.speedY;

      // If the drop goes beyond the screen, we return it to the top
      if (drop.y > this.canvasHeight) {
        drop.y = -drop.length;
        drop.x = Math.random() * this.canvasWidth;
      }

      // If the drop goes beyond the horizontal boundaries
      if (drop.x > this.canvasWidth || drop.x < 0) {
        drop.x = Math.random() * this.canvasWidth;
        drop.y = Math.random() * this.canvasHeight / 2;
      }
    }
  }
}

interface RainDrop {
  x: number;
  y: number;
  length: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

interface Lightning {
  x: number;
  y: number;
  width: number;
  height: number;
  lifeTime: number;
  maxLifeTime: number;
  opacity: number;
}

