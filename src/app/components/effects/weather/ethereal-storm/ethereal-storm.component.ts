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

  private _etherealStormIntensity: number = 50; // Интенсивность бури от 0 до 100

  @Input()
  set etherealStormIntensity(intensity: number) {
    this._etherealStormIntensity = intensity;
    this.updateStormSettings(); // Обновляем настройки при изменении интенсивности
  }

  get etherealStormIntensity(): number {
    return this._etherealStormIntensity;
  }

  private rifts: Rift[] = [];
  private maxRifts = 5; // Максимальное количество разрывов
  private riftImages: HTMLImageElement[] = []; // Массив с изображениями разрывов

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
    // Загрузите изображения разрывов
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
      maxLifeTime: Math.random() * 500 + 500, // Жизнь от 500 до 1000 кадров
    };
  }

  private updateStormSettings(): void {
    this.createRifts();
    // Обновите другие элементы бури, если необходимо
  }

  private startAnimationLoop(): void {
    this.animate();
  }

  private animate = (): void => {
    this.clearCanvas();
    this.drawRifts();
    this.drawLightnings();
    this.drawCreatures();
    // Добавьте вызовы методов для других элементов (молнии, существа)
    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  private clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  private drawRifts(): void {
    for (let i = this.rifts.length - 1; i >= 0; i--) {
      const rift = this.rifts[i];

      // Обновляем параметры разрыва
      rift.lifeTime++;
      rift.opacity = Math.sin((Math.PI * rift.lifeTime) / rift.maxLifeTime);
      rift.rotation += rift.rotationSpeed;

      if (rift.lifeTime >= rift.maxLifeTime) {
        // Удаляем разрыв, если он достиг конца жизни
        this.rifts.splice(i, 1);
        continue;
      }

      // Рисуем разрыв
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
  private lightningFrequency = 0.02; // Вероятность появления молнии каждый кадр

  // Метод для создания и отрисовки молний
  private drawLightnings(): void {
    // С вероятностью lightningFrequency создаем новую молнию
    if (Math.random() < this.lightningFrequency * (this._etherealStormIntensity / 100)) {
      this.lightnings.push(this.createRandomLightning());
    }

    for (let i = this.lightnings.length - 1; i >= 0; i--) {
      const lightning = this.lightnings[i];

      // Рисуем молнию
      this.ctx.save();
      this.ctx.globalAlpha = lightning.opacity;
      this.ctx.strokeStyle = lightning.color;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(lightning.x, lightning.y);
      this.ctx.lineTo(lightning.x, lightning.y + lightning.length);
      this.ctx.stroke();
      this.ctx.restore();

      // Обновляем параметры молнии
      lightning.lifeTime++;
      lightning.opacity -= 0.02;

      if (lightning.lifeTime >= lightning.maxLifeTime || lightning.opacity <= 0) {
        this.lightnings.splice(i, 1);
      }
    }
  }

  private createRandomLightning(): EtherealLightning {
    const colors = ['#00FFFF', '#8A2BE2', '#7FFFD4']; // Бирюзовый, фиолетовый, аквамарин
    const color = colors[Math.floor(Math.random() * colors.length)];

    return {
      x: Math.random() * this.canvasWidth,
      y: 0,
      length: this.canvasHeight,
      opacity: 1,
      color: color,
      lifeTime: 0,
      maxLifeTime: Math.random() * 10 + 10, // Жизнь от 10 до 20 кадров
    };
  } 

  private creatures: EtherealCreature[] = [];
  private maxCreatures = 3; // Максимальное количество существ
  private creatureImages: HTMLImageElement[] = []; // Массив с изображениями существ
  // В ngOnInit загрузите изображения существ
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
  // Метод для создания и отрисовки существ
  private drawCreatures(): void {
    // С вероятностью создаем новое существо
    if (this.creatures.length < this.maxCreatures * (this._etherealStormIntensity / 100)) {
      this.creatures.push(this.createRandomCreature());
    }

    for (let i = this.creatures.length - 1; i >= 0; i--) {
      const creature = this.creatures[i];

      // Рисуем существо
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

      // Обновляем параметры существа
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

