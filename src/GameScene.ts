import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private fondo!: Phaser.GameObjects.Image;
  private doorZone!: Phaser.GameObjects.Rectangle;
  private prompt!: Phaser.GameObjects.Text;
  private space!: Phaser.Input.Keyboard.Key;
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
    this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.cameras.main.setScroll(0, 0);

    // puerta visible mientras pruebas (alfa 0 cuando funcione)
    this.doorZone = this.add.rectangle(0, 0, 80, 120, 0x00ff00, 0.15).setOrigin(0.5);
    this.physics.add.existing(this.doorZone, true);
    this.prompt = this.add.text(0, 0, 'Pulsa ESPACIO para salir', {
      font: '18px Arial', color: '#fff', backgroundColor: '#000'
    }).setOrigin(0.5).setVisible(false);

    // overlap: callback único
    this.physics.add.overlap(this.player, this.doorZone, this.tryExit, undefined, this);

    this.layout();
    this.scale.on('resize', () => this.layout());
  }

  private layout() {
    const W = this.scale.width, H = this.scale.height;
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

    // escala sprite
    const src = this.textures.get('breijo').getSourceImage() as HTMLImageElement;
    const baseH = src?.naturalHeight || this.player.height || 48;
    const pScale = Phaser.Math.Clamp((mapH * 0.14) / baseH, 0.06, 0.7);
    this.player.setScale(pScale);

    if (this.player.x === 0 && this.player.y === 0) {
      this.player.setPosition(mapX + mapW / 2, mapY + mapH * 0.75);
    }

    // colocar puerta y texto
    const doorX = mapX + mapW - 50;
    const doorY = mapY + mapH * 0.55;
    this.doorZone.setPosition(doorX, doorY);
    this.prompt.setPosition(doorX, doorY - 70);

    // actualizar cuerpo estático tras mover
    const body = this.doorZone.body as Phaser.Physics.Arcade.StaticBody;
    body.setSize(this.doorZone.displayWidth, this.doorZone.displayHeight);
    body.updateFromGameObject(this.doorZone);
  }

  private tryExit() {
    this.prompt.setVisible(true);
    if (Phaser.Input.Keyboard.JustDown(this.space)) {
      this.scene.start('NextScene');
    }
  }

  update() {
    const speed = 220;
    this.player.setVelocity(0);
    if (this.cursors.left?.isDown)  this.player.setVelocityX(-speed);
    else if (this.cursors.right?.isDown) this.player.setVelocityX(speed);
    if (this.cursors.up?.isDown)    this.player.setVelocityY(-speed);
    else if (this.cursors.down?.isDown)  this.player.setVelocityY(speed);

    // ocultar prompt si no hay overlap este frame
    if (!this.physics.world.overlap(this.player, this.doorZone)) {
      this.prompt.setVisible(false);
    }

    // límites del mapa
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
