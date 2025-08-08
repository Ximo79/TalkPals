import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private fondo!: Phaser.GameObjects.Image;
  private bounds = { x: 0, y: 0, w: 0, h: 0 };
  private readonly MARGIN = 16;

  preload() {
    this.load.image('mapa', 'assets/map_1_court.png');
    this.load.image('breijo', 'assets/sprite_1_front.png');
  }

  create() {
    // mapa fijo
    this.fondo = this.add.image(0, 0, 'mapa').setOrigin(0, 0);

    // jugador
    this.player = this.physics.add.sprite(0, 0, 'breijo');
    this.player.setCollideWorldBounds(false);

    // controles
    this.cursors = this.input.keyboard.createCursorKeys();

    // cámara fija
    this.cameras.main.setScroll(0, 0);

    // primer layout y relayout en resize
    this.layout();
    this.scale.on('resize', () => this.layout());
  }

  // ajusta mapa a pantalla y escala jugador en proporción
  private layout() {
    const W = this.scale.width;
    const H = this.scale.height;

    // encajar mapa COMPLETO dentro del canvas con margen
    const maxW = W - this.MARGIN * 2;
    const maxH = H - this.MARGIN * 2;
    const fitScale = Math.min(maxW / this.fondo.width, maxH / this.fondo.height);

    this.fondo.setScale(fitScale);

    // centrar mapa
    const mapW = this.fondo.width * fitScale;
    const mapH = this.fondo.height * fitScale;
    const mapX = (W - mapW) / 2;
    const mapY = (H - mapH) / 2;
    this.fondo.setPosition(mapX, mapY);

    // guardar límites visibles del mapa
    this.bounds = { x: mapX, y: mapY, w: mapW, h: mapH };

    // escalar jugador en función del alto del mapa (≈12% del alto)
    const srcImg = this.textures.get('breijo').getSourceImage() as HTMLImageElement;
    const baseH = srcImg?.naturalHeight || srcImg?.height || this.player.height || 48;
    const targetH = mapH * 0.12; // ajusta este porcentaje si lo quieres mayor/menor
    const pScale = Phaser.Math.Clamp(targetH / baseH, 0.05, 0.6);
    this.player.setScale(pScale);

    // si estaba fuera, céntralo y clamp
    if (this.player.x === 0 && this.player.y === 0) {
      this.player.setPosition(mapX + mapW / 2, mapY + mapH / 2);
    }
    this.clampToMap();
  }

  update() {
    const speed = 220;
    this.player.setVelocity(0);

    if (this.cursors.left?.isDown)  this.player.setVelocityX(-speed);
    else if (this.cursors.right?.isDown) this.player.setVelocityX(speed);

    if (this.cursors.up?.isDown)    this.player.setVelocityY(-speed);
    else if (this.cursors.down?.isDown)  this.player.setVelocityY(speed);

    this.clampToMap();
  }

  // mantiene al sprite dentro del mapa visible (teniendo en cuenta su tamaño en pantalla)
  private clampToMap() {
    const halfW = this.player.displayWidth * 0.5;
    const halfH = this.player.displayHeight * 0.5;
    const minX = this.bounds.x + halfW;
    const maxX = this.bounds.x + this.bounds.w - halfW;
    const minY = this.bounds.y + halfH;
    const maxY = this.bounds.y + this.bounds.h - halfH;

    this.player.x = Phaser.Math.Clamp(this.player.x, minX, maxX);
    this.player.y = Phaser.Math.Clamp(this.player.y, minY, maxY);
  }
}
