import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input, HostListener, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-fog',
  standalone: true,
  imports: [],
  templateUrl: './fog.component.html',
  styleUrl: './fog.component.scss'
})
export class FogComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvasFog', { static: true }) canvasFogRef!: ElementRef<HTMLCanvasElement>;

  private ctxFog!: CanvasRenderingContext2D;
  private canvasWidth!: number;
  private canvasHeight!: number;

  private _fogIntensity: number = 50;

  @Input()
  set fogIntensity(intensity: number) {
    this._fogIntensity = intensity;
    this.updateFogSettings();
  }

  get fogIntensity(): number {
    return this._fogIntensity;
  }

  private fogLayers: FogLayer[] = [];
  private animationFrameId: number | null = null;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initializeCanvas();
    this.createFogLayers();
    this.startAnimationLoop();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.updateCanvasSize();
    this.createFogLayers();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private initializeCanvas(): void {
    this.ctxFog = this.canvasFogRef.nativeElement.getContext('2d')!;
    this.updateCanvasSize();
  }

  private updateCanvasSize(): void {
    this.canvasWidth = this.canvasFogRef.nativeElement.width = window.innerWidth;
    this.canvasHeight = this.canvasFogRef.nativeElement.height = window.innerHeight;
  }

  private createFogLayers(): void {
    this.fogLayers = [];

    // Create several layers of fog
    for (let i = 0; i < 2; i++) {
      const fogLayer = new Image();
      fogLayer.src = '/weather/fog_layer_' + (i + 1) + '.png'; // Replace with the actual path to your images

      this.fogLayers.push({
        image: fogLayer,
        x: 0,
        y: 0,
        width: this.canvasWidth,
        height: this.canvasHeight,
        opacity: (this._fogIntensity / 100) * 0.8, // Different transparency for layers
        speed: 0.2 + i * 0.1, // Different speed for layers
      });
    }
  }

  private updateFogSettings(): void {
    // Update the transparency of each layer based on fogIntensity
    for (let i = 0; i < this.fogLayers.length; i++) {
      this.fogLayers[i].opacity = (this._fogIntensity / 100) * 0.8;
    }
  }

  private startAnimationLoop(): void {
    this.animate();
  }

  private animate = (): void => {
    this.clearCanvas();
    this.drawFogLayers();
    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  private clearCanvas(): void {
    this.ctxFog.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  private drawFogLayers(): void {
    for (const layer of this.fogLayers) {
      layer.x -= layer.speed;

      if (layer.x <= -this.canvasWidth) {
        layer.x = 0;
      }

      this.ctxFog.save();
      this.ctxFog.globalAlpha = layer.opacity;

      // Apply blur before rendering
      this.ctxFog.filter = 'blur(5px)';

      // Draw the image twice to create a seamless effect
      this.ctxFog.drawImage(
        layer.image,
        layer.x,
        layer.y,
        layer.width,
        layer.height
      );

      this.ctxFog.drawImage(
        layer.image,
        layer.x + layer.width,
        layer.y,
        layer.width,
        layer.height
      );

      this.ctxFog.restore();
    }

    // Reset transparency
    this.ctxFog.globalAlpha = 1.0;
  }
}

interface FogLayer {
  image: HTMLImageElement;
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
  speed: number;
}
