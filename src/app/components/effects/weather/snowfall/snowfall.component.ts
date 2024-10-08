import { 
  Component, 
  OnInit,
  AfterViewInit, 
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
export class SnowfallComponent implements OnInit, AfterViewInit {
  @ViewChild('canvasSnow', { static: true }) canvasSnowRef!: ElementRef<HTMLCanvasElement>;

  private ctxSnow!: CanvasRenderingContext2D;
  private canvasWidth!: number;
  private canvasHeight!: number;
  
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

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initializeCanvas();
    this.initializeSnowflakes();
    this.startAnimationLoop();
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
        speedY: (Math.random() * 1 + 1) * (this.snowIntensity / 50 ),
        opacity: Math.random() * 0.5 + 0.3
      });
    }
  }

  private startAnimationLoop(): void {
    this.animate();
  }

  private animate(): void {
    this.clearCanvas();
    this.drawSnowflakes();
    requestAnimationFrame(() => this.animate());
  }

  private clearCanvas(): void {
    this.ctxSnow.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  private drawSnowflakes(): void {
    for (const snowflake of this.snowflakes) {
      this.ctxSnow.beginPath();
      this.ctxSnow.arc(snowflake.x, snowflake.y, snowflake.radius, 0, Math.PI * 2);
      this.ctxSnow.fillStyle = `rgba(255, 255, 255, ${snowflake.opacity})`;
      this.ctxSnow.fill();

      // Update the position of the snowflake
      snowflake.y += snowflake.speedY;

      // If the snowflake goes beyond the screen, we return it to the top
      if (snowflake.y > this.canvasHeight) {
        snowflake.y = -snowflake.radius;
        snowflake.x = Math.random() * this.canvasWidth;
      }
    }
  }
}

interface Snowflake {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  opacity: number;
}
