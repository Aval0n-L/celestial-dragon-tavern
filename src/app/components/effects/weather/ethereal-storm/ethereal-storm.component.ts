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
  selector: 'app-ethereal-storm',
  standalone: true,
  imports: [],
  templateUrl: './ethereal-storm.component.html',
  styleUrl: './ethereal-storm.component.scss'
})
export class EtherealStormComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvasEtherealStorm', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private canvasWidth!: number;
  private canvasHeight!: number;

  private _etherealStormIntensity: number = 50;

  @Input()
  set etherealStormIntensity(intensity: number) {
    this._etherealStormIntensity = intensity;
    this.updateStormSettings();
  }

  get etherealStormIntensity(): number {
    return this._etherealStormIntensity;
  }

  private rifts: Rift[] = [];
  private maxRifts = 5;
  private riftImages: HTMLImageElement[] = []; // Array of gap images

  private animationFrameId: number | null = null;

  constructor() {}

  ngOnInit(): void {
    this.loadRiftImages();
    this.loadCreatureImages();
  }

  ngAfterViewInit(): void {
    this.initializeCanvas();
    this.createRifts();
    this.startAnimationLoop();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.updateCanvasSize();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private initializeCanvas(): void {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.updateCanvasSize();
  }

  private updateCanvasSize(): void {
    this.canvasWidth = this.canvasRef.nativeElement.width = window.innerWidth;
    this.canvasHeight = this.canvasRef.nativeElement.height = window.innerHeight;
  }

  private loadRiftImages(): void {
    const riftImageUrls = [
      'assets/images/rift1.png',
      'assets/images/rift2.png',
      'assets/images/rift3.png',
    ];

    for (const url of riftImageUrls) {
      const img = new Image();
      img.src = url;
      this.riftImages.push(img);
    }
  }

  private createRifts(): void {
    this.rifts = [];
    const riftCount = Math.floor(
      (this.maxRifts * this._etherealStormIntensity) / 100
    );

    for (let i = 0; i < riftCount; i++) {
      this.rifts.push(this.createRandomRift());
    }
  }

  private createRandomRift(): Rift {
    return {
      x: Math.random() * this.canvasWidth,
      y: Math.random() * this.canvasHeight,
      width: Math.random() * 200 + 100,
      height: Math.random() * 200 + 100,
      opacity: 0,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() * 0.5 - 0.25),
      lifeTime: 0,
      maxLifeTime: Math.random() * 500 + 500, // Life from 500 to 1000 frames
    };
  }

  private updateStormSettings(): void {
    this.createRifts();
    // Update other storm elements if needed
  }

  private startAnimationLoop(): void {
    this.animate();
  }

  private animate = (): void => {
    this.clearCanvas();
    this.drawRifts();
    this.drawLightnings();
    this.drawCreatures();
    // Add method calls for other elements (lightning, creatures)
    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  private clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  private drawRifts(): void {
    for (let i = this.rifts.length - 1; i >= 0; i--) {
      const rift = this.rifts[i];

      // Updating the break parameters
      rift.lifeTime++;
      rift.opacity = Math.sin((Math.PI * rift.lifeTime) / rift.maxLifeTime);
      rift.rotation += rift.rotationSpeed;

      if (rift.lifeTime >= rift.maxLifeTime) {
        // Remove the gap if it has reached the end of life
        this.rifts.splice(i, 1);
        continue;
      }

      // Draw rifts
      const img = this.riftImages[i % this.riftImages.length];

      this.ctx.save();
      this.ctx.globalAlpha = rift.opacity;
      this.ctx.translate(rift.x, rift.y);
      this.ctx.rotate((rift.rotation * Math.PI) / 180);
      this.ctx.drawImage(
        img,
        -rift.width / 2,
        -rift.height / 2,
        rift.width,
        rift.height
      );
      this.ctx.restore();
    }
  }

  private lightnings: EtherealLightning[] = [];
  private lightningFrequency = 0.02; // Probability of lightning every frame

  // Method for creating and drawing lightning
  private drawLightnings(): void {
    // With probability lightningFrequency create new lightning
    if (Math.random() < this.lightningFrequency * (this._etherealStormIntensity / 100)) {
      this.lightnings.push(this.createRandomLightning());
    }

    for (let i = this.lightnings.length - 1; i >= 0; i--) {
      const lightning = this.lightnings[i];

      // Draw lightning
      this.ctx.save();
      this.ctx.globalAlpha = lightning.opacity;
      this.ctx.strokeStyle = lightning.color;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(lightning.x, lightning.y);
      this.ctx.lineTo(lightning.x, lightning.y + lightning.length);
      this.ctx.stroke();
      this.ctx.restore();

      // Updating lightning parameters
      lightning.lifeTime++;
      lightning.opacity -= 0.02;

      if (lightning.lifeTime >= lightning.maxLifeTime || lightning.opacity <= 0) {
        this.lightnings.splice(i, 1);
      }
    }
  }

  private createRandomLightning(): EtherealLightning {
    const colors = ['#00FFFF', '#8A2BE2', '#7FFFD4'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    return {
      x: Math.random() * this.canvasWidth,
      y: 0,
      length: this.canvasHeight,
      opacity: 1,
      color: color,
      lifeTime: 0,
      maxLifeTime: Math.random() * 10 + 10, // Life from 10 to 20 frames
    };
  } 

  private creatures: EtherealCreature[] = [];
  private maxCreatures = 3; // Maximum number of creatures
  private creatureImages: HTMLImageElement[] = []; // Array of images of creatures
  private loadCreatureImages(): void {
    const creatureImageUrls = [
      'assets/images/creature1.png',
      'assets/images/creature2.png',
      'assets/images/creature3.png',
    ];

    for (const url of creatureImageUrls) {
      const img = new Image();
      img.src = url;
      this.creatureImages.push(img);
    }
  }
  // Method for creating and drawing creatures
  private drawCreatures(): void {
    // We create a new creature with probability
    if (this.creatures.length < this.maxCreatures * (this._etherealStormIntensity / 100)) {
      this.creatures.push(this.createRandomCreature());
    }

    for (let i = this.creatures.length - 1; i >= 0; i--) {
      const creature = this.creatures[i];

      // Draw a creature
      this.ctx.save();
      this.ctx.globalAlpha = creature.opacity;
      this.ctx.drawImage(
        creature.image,
        creature.x,
        creature.y,
        creature.width,
        creature.height
      );
      this.ctx.restore();

      // Updating creature parameters
      creature.x += creature.speedX;
      creature.y += creature.speedY;
      creature.lifeTime++;
      creature.opacity -= 0.001;

      if (
        creature.lifeTime >= creature.maxLifeTime ||
        creature.opacity <= 0 ||
        creature.x > this.canvasWidth ||
        creature.y > this.canvasHeight ||
        creature.x + creature.width < 0 ||
        creature.y + creature.height < 0
      ) {
        this.creatures.splice(i, 1);
      }
    }
  }

  private createRandomCreature(): EtherealCreature {
    const img = this.creatureImages[Math.floor(Math.random() * this.creatureImages.length)];
    const width = img.width / 2;
    const height = img.height / 2;

    return {
      x: Math.random() * this.canvasWidth - width / 2,
      y: Math.random() * this.canvasHeight - height / 2,
      width: width,
      height: height,
      opacity: Math.random() * 0.5 + 0.5,
      speedX: (Math.random() * 1 - 0.5),
      speedY: (Math.random() * 1 - 0.5),
      image: img,
      lifeTime: 0,
      maxLifeTime: Math.random() * 1000 + 500,
    };
  }
}

interface Rift {
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  lifeTime: number;
  maxLifeTime: number;
}
interface EtherealLightning {
  x: number;
  y: number;
  length: number;
  opacity: number;
  color: string;
  lifeTime: number;
  maxLifeTime: number;
}

interface EtherealCreature {
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
  speedX: number;
  speedY: number;
  image: HTMLImageElement;
  lifeTime: number;
  maxLifeTime: number;
}

