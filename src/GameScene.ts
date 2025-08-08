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
    this.fondo = this.add.image(0, 0, 'mapa').setOrigin(0, 0);
    this.player = this.physics.add.sprite(0, 0, 'breijo');
    this.player.setCollideWorldBounds(false);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.cameras.main.setScroll(0, 0);

    this.layout();
    this.scale.on('resize', () => this.layout());
  }

  private layout() {
    const W = this.scale.width, H = this.scale.height;

    // encajar mapa completo con margen y centrar
    const maxW = W - this.MARGIN * 2;
    const maxH = H - this.MARGIN * 2;
    const s = Math.min(maxW / this.fondo.width, maxH / this.fondo.height);
    this.fondo.setScale(s);

    const mapW = this.fondo.width * s;
    const mapH = this.fondo.height * s;
    const mapX = (W - mapW) / 2;
    const mapY = (H - mapH) / 2;
    this.fondo.setPosition(mapX, mapY);

    this.bounds = { x: mapX, y: mapY, w: mapW, h: mapH };

    // escala del sprite proporcional al mapa
    const img = this.textures.get('breijo').getSourceImage() as HTMLImageElement;
    const baseH = img?.naturalHeight || this.player.height || 48;
    const pScale = Phaser.Math.Clamp((mapH * 0.15) / baseH, 0.06, 0.7);
    this.player.setScale(pScale);

    // posición inicial centrada
    if (this.player.x === 0 && this.player.y === 0) {
      this.player.setPosition(mapX + mapW / 2, mapY + mapH * 0.75);
    }
  }

  update() {
    const speed = 220;
    this.player.setVelocity(0);

    if (this.cursors.left?.isDown)  this.player.setVelocityX(-speed);
    else if (this.cursors.right?.isDown) this.player.setVelocityX(speed);

    if (this.cursors.up?.isDown)    this.player.setVelocityY(-speed);
    else if (this.cursors.down?.isDown)  this.player.setVelocityY(speed);

    // limitar al área visible del mapa
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
