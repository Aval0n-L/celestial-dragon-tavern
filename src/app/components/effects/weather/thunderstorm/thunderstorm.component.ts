import {   
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  HostListener, 
  Input} from '@angular/core';

@Component({
  selector: 'app-thunderstorm',
  standalone: true,
  imports: [],
  templateUrl: './thunderstorm.component.html',
  styleUrl: './thunderstorm.component.scss'
})
export class ThunderstormComponent implements OnInit, AfterViewInit {
  @ViewChild('canvasRainTrough', { static: true })
  canvasRainTroughRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasRain', { static: true })
  canvasRainRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasLightning', { static: true })
  canvasLightningRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('thunderstormContainer', { static: true })
  thunderstormContainerRef!: ElementRef<HTMLDivElement>;

  private _weatherIntensity: number = 15; // Значение по умолчанию

  private ctxRainTrough!: CanvasRenderingContext2D;
  private ctxRain!: CanvasRenderingContext2D;
  private ctxLightning!: CanvasRenderingContext2D;

  private canvasWidth!: number;
  private canvasHeight!: number;

  private maxRainTroughCount = 500;
  private maxRainCount = 500;
  private maxLightningFrequency = 200; // Максимальное время между молниями

  private rainTroughCount!: number;
  private rainTroughSpeed = 25;
  private rainTroughDrops: RainTroughDrop[] = [];

  private rainCount!: number;
  private rainDrops: RainDrop[] = [];

  private lightningBolts: LightningBolt[] = [];
  private lightningTimer = 0;
  private lightningInterval!: number;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initializeCanvasContexts();
    this.updateCanvasSize();
    this.updateContainerHeight();
    this.updateIntensity();
    this.startAnimationLoop();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.updateCanvasSize();
    this.updateContainerHeight();
    this.initializeRainTroughDrops();
  }

  @Input()
  set weatherIntensity(intensity: number) {
    this._weatherIntensity = intensity;
    this.updateIntensity();
  }

  public get weatherIntensity(): number {
    return this._weatherIntensity;
  }

  private updateContainerHeight(): void {
    const container = this.thunderstormContainerRef.nativeElement;
    container.style.height = `${document.body.scrollHeight + 300}px`;
  }

  private initializeCanvasContexts(): void {
    this.ctxRainTrough = this.canvasRainTroughRef.nativeElement.getContext('2d')!;
    this.ctxRain = this.canvasRainRef.nativeElement.getContext('2d')!;
    this.ctxLightning = this.canvasLightningRef.nativeElement.getContext('2d')!;
  }

  private updateCanvasSize(): void {
    this.canvasWidth = this.canvasRainTroughRef.nativeElement.width = this.canvasRainRef.nativeElement.width = this.canvasLightningRef.nativeElement.width = window.innerWidth;
    this.canvasHeight = this.canvasRainTroughRef.nativeElement.height = this.canvasRainRef.nativeElement.height = this.canvasLightningRef.nativeElement.height = window.innerHeight;
  }

  private updateIntensity(): void {
    this.rainTroughCount = Math.floor(this.maxRainTroughCount * (this._weatherIntensity  / 100));
    this.rainCount = Math.floor(this.maxRainCount * (this._weatherIntensity  / 100));
    this.lightningInterval = this.maxLightningFrequency * (100 / (this._weatherIntensity  || 1)); // Избегаем деления на ноль

    this.initializeRainTroughDrops();
    this.initializeRainDrops();
  }

  private initializeRainTroughDrops(): void {
    this.rainTroughDrops = [];
    for (let i = 0; i < this.rainTroughCount; i++) {
      this.rainTroughDrops.push({
        x: this.getRandomNumber(0, this.canvasWidth),
        y: this.getRandomNumber(0, this.canvasHeight),
        length: this.getRandomInt(1, 830),
        opacity: Math.random() * 0.2,
        speedX: this.getRandomNumber(-2, 2),
        speedY: this.getRandomNumber(10, 20)
      });
    }
  }

  private initializeRainDrops(): void {
    this.rainDrops = [];
    for (let i = 0; i < this.rainCount; i++) {
      this.rainDrops.push({
        x: Math.random() * this.canvasWidth,
        y: Math.random() * this.canvasHeight,
        length: Math.random(),
        speedX: -4 + Math.random() * 6,
        speedY: Math.random() * 10 + 10
      });
    }
  }

  private startAnimationLoop(): void {
    this.animate();
  }

  private animate(): void {
    this.clearCanvas(this.ctxRainTrough);
    this.clearCanvas(this.ctxRain);
    this.clearLightningCanvas();

    this.animateRainTrough();
    this.animateRain();
    this.animateLightning();

    requestAnimationFrame(() => this.animate());
  }

  private clearCanvas(ctx: CanvasRenderingContext2D): void {
    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  private clearLightningCanvas(): void {
    this.ctxLightning.globalCompositeOperation = 'destination-out';
    this.ctxLightning.fillStyle = `rgba(0, 0, 0, ${this.getRandomNumber(0.01, 0.3)})`;
    this.ctxLightning.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.ctxLightning.globalCompositeOperation = 'source-over';
  }

  private animateRainTrough(): void {
    for (const drop of this.rainTroughDrops) {
      if (drop.y >= this.canvasHeight) {
        drop.y = 0 - drop.length * 5;
      } else {
        drop.y += this.rainTroughSpeed;
      }
      this.drawRainTroughDrop(drop);
    }
  }

  private animateRain(): void {
    for (const drop of this.rainDrops) {
      drop.x += drop.speedX;
      drop.y += drop.speedY;

      if (drop.x > this.canvasWidth || drop.y > this.canvasHeight) {
        drop.x = Math.random() * this.canvasWidth;
        drop.y = -20;
      }
      this.drawRainDrop(drop);
    }
  }

  private animateLightning(): void {
    this.lightningTimer++;
    if (this.lightningTimer >= this.lightningInterval) {
      if (this._weatherIntensity > 0) {
        this.createLightningBolts();
      }
      this.lightningTimer = 0;
      this.lightningInterval = this.maxLightningFrequency * (100 / (this._weatherIntensity || 1));
    }
    this.drawLightningBolts();
  }

  private createLightningBolts(): void {
    const x = this.getRandomNumber(100, this.canvasWidth - 100);
    const y = this.getRandomNumber(0, this.canvasHeight / 4);

    const boltCount = this.getRandomInt(1, 3);
    for (let i = 0; i < boltCount; i++) {
      this.lightningBolts.push({
        startX: x,
        startY: y,
        xRange: this.getRandomNumber(5, 30),
        yRange: this.getRandomNumber(10, 25),
        path: [{ x, y }],
        pathLimit: this.getRandomInt(40, 55)
      });
    }
  }

  private drawRainTroughDrop(drop: RainTroughDrop): void {
    const gradient = this.ctxRainTrough.createLinearGradient(0, drop.y, 0, drop.y + drop.length);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
    gradient.addColorStop(1, `rgba(255, 255, 255, ${drop.opacity})`);

    this.ctxRainTrough.fillStyle = gradient;
    this.ctxRainTrough.fillRect(drop.x, drop.y, 1, drop.length);
  }

  private drawRainDrop(drop: RainDrop): void {
    this.ctxRain.beginPath();
    this.ctxRain.moveTo(drop.x, drop.y);
    this.ctxRain.lineTo(drop.x + drop.length * drop.speedX, drop.y + drop.length * drop.speedY);
    this.ctxRain.strokeStyle = 'rgba(174, 194, 224, 0.5)';
    this.ctxRain.lineWidth = 1;
    this.ctxRain.lineCap = 'round';
    this.ctxRain.stroke();
  }

  private drawLightningBolts(): void {
    for (let i = this.lightningBolts.length - 1; i >= 0; i--) {
      const bolt = this.lightningBolts[i];

      bolt.path.push({
        x: bolt.path[bolt.path.length - 1].x + (this.getRandomNumber(0, bolt.xRange) - bolt.xRange / 2),
        y: bolt.path[bolt.path.length - 1].y + this.getRandomNumber(0, bolt.yRange)
      });

      if (bolt.path.length > bolt.pathLimit) {
        this.lightningBolts.splice(i, 1);
        continue;
      }

      this.ctxLightning.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      this.ctxLightning.lineWidth = this.getRandomInt(3, 8);
      this.ctxLightning.beginPath();
      this.ctxLightning.moveTo(bolt.startX, bolt.startY);

      for (const point of bolt.path) {
        this.ctxLightning.lineTo(point.x, point.y);
      }

      if (this.getRandomInt(0, 30) === 1) {
        this.ctxLightning.fillStyle = `rgba(255, 255, 255, ${this.getRandomNumber(0.01, 0.03)})`;
        this.ctxLightning.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
      }

      this.ctxLightning.stroke();
    }
  }

  private getRandomNumber(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  private getRandomInt(min: number, max: number): number {
    return Math.floor(this.getRandomNumber(min, max));
  }
}

interface RainTroughDrop {
  x: number;
  y: number;
  length: number;
  opacity: number;
  speedX: number;
  speedY: number;
}

interface RainDrop {
  x: number;
  y: number;
  length: number;
  speedX: number;
  speedY: number;
}

interface LightningBolt {
  startX: number;
  startY: number;
  xRange: number;
  yRange: number;
  path: { x: number; y: number }[];
  pathLimit: number;
}
