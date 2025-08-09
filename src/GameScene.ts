import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
  constructor() { super('GameScene'); }

  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private fondo!: Phaser.GameObjects.Image;
  private doorZone!: Phaser.GameObjects.Rectangle;
  private prompt!: Phaser.GameObjects.Text;
  private space!: Phaser.Input.Keyboard.Key;

  private bounds = { x: 0, y: 0, w: 0, h: 0 };
  private readonly MARGIN = 0; // sin margen

  preload() {
    this.load.image('mapa', 'assets/map_1_gym.png');
    this.load.image('breijo', 'assets/sprite_1_front.png');
  }

  create(data: { spawn?: 'fromMap2' } = {}) {
    this.fondo = this.add.image(0, 0, 'mapa').setOrigin(0, 0);

    this.player = this.physics.add.sprite(0, 0, 'breijo');
    this.player.setCollideWorldBounds(false);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.cameras.main.setScroll(0, 0);

    // Puerta (invisible)
    this.doorZone = this.add.rectangle(0, 0, 74, 120, 0x00ff00, 0).setOrigin(0.5);
    this.physics.add.existing(this.doorZone, true);
    this.prompt = this.add.text(0, 0, 'Pulsa ESPACIO para salir', {
      font: '18px Arial', color: '#fff', backgroundColor: '#000'
    }).setOrigin(0.5).setVisible(false);

    this.physics.add.overlap(this.player, this.doorZone, this.tryExit, undefined, this);

    this.layout(data.spawn);
    this.scale.on('resize', () => this.layout(data.spawn));
  }

  private layout(spawn?: 'fromMap2') {
    const W = this.scale.width, H = this.scale.height;

    // Escalar mapa para encajar
    const s = Math.min(
      (W - this.MARGIN * 2) / this.fondo.width,
      (H - this.MARGIN * 2) / this.fondo.height
    );
    this.fondo.setScale(s);

    const mapW = this.fondo.width * s;
    const mapH = this.fondo.height * s;
    const mapX = (W - mapW) / 2;
    const mapY = (H - mapH) / 2;
    this.fondo.setPosition(mapX, mapY);
    this.bounds = { x: mapX, y: mapY, w: mapW, h: mapH };

    // Escala del sprite
    const src = this.textures.get('breijo').getSourceImage() as HTMLImageElement;
    const baseH = src?.naturalHeight || this.player.height || 48;
    const pScale = Phaser.Math.Clamp((mapH * 0.14) / baseH, 0.06, 0.7);
    this.player.setScale(pScale);

    // Hitbox del jugador acorde a la escala (más pequeño para acercarse al borde)
    const pb = this.player.body as Phaser.Physics.Arcade.Body;
    pb.setSize(this.player.displayWidth * 0.55, this.player.displayHeight * 0.55, true);

    // Posición inicial
    if (spawn === 'fromMap2') {
      this.player.setPosition(mapX + mapW - 120, mapY + mapH * 0.72);
    } else if (this.player.x === 0 && this.player.y === 0) {
      this.player.setPosition(mapX + mapW / 2, mapY + mapH * 0.75);
    }

    // Puerta mapa 1: arriba‑derecha (ajusta offsets si hace falta)
    const doorX = mapX + mapW - 60; // 60 px desde el borde derecho
    const doorY = mapY + 130;       // 130 px desde arriba
    this.doorZone.setPosition(doorX, doorY);
    this.prompt.setPosition(doorX, doorY - 70);

    // Sincronizar cuerpo estático tras moverla
    const body = this.doorZone.body as Phaser.Physics.Arcade.StaticBody;
    body.setSize(this.doorZone.displayWidth, this.doorZone.displayHeight);
    body.updateFromGameObject(this.doorZone);
  }

  private tryExit() {
    this.prompt.setVisible(true);
    if (Phaser.Input.Keyboard.JustDown(this.space)) {
      this.scene.start('NextScene', { spawn: 'fromMap1' });
    }
  }

  update() {
    const speed = 220;
    this.player.setVelocity(0);
    if (this.cursors.left?.isDown)  this.player.setVelocityX(-speed);
    else if (this.cursors.right?.isDown) this.player.setVelocityX(speed);
    if (this.cursors.up?.isDown)    this.player.setVelocityY(-speed);
    else if (this.cursors.down?.isDown)  this.player.setVelocityY(speed);

    // Ocultar prompt si no hay solape este frame
    if (!this.physics.world.overlap(this.player, this.doorZone)) this.prompt.setVisible(false);

    // Clamp usando el cuerpo físico (acerca más al borde)
    const pb = this.player.body as Phaser.Physics.Arcade.Body;
    const halfW = pb.width / 2;
    const halfH = pb.height / 2;
    this.player.x = Phaser.Math.Clamp(this.player.x, this.bounds.x + halfW, this.bounds.x + this.bounds.w - halfW);
    this.player.y = Phaser.Math.Clamp(this.player.y, this.bounds.y + halfH, this.bounds.y + this.bounds.h - halfH);
  }
}
