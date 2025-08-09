import Phaser from 'phaser';

export class NextScene extends Phaser.Scene {
  constructor() { super('NextScene'); }

  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private fondo!: Phaser.GameObjects.Image;
  private doorZone!: Phaser.GameObjects.Rectangle;
  private prompt!: Phaser.GameObjects.Text;
  private space!: Phaser.Input.Keyboard.Key;

  private bounds = { x: 0, y: 0, w: 0, h: 0 };
  private readonly MARGIN = 0;

  preload() {
    this.load.image('mapa2', 'assets/map_2_class.png');
    this.load.image('breijo', 'assets/sprite_1_front.png');
  }

  create(data: { spawn?: 'fromMap1' } = {}) {
    this.fondo = this.add.image(0, 0, 'mapa2').setOrigin(0, 0);
    this.player = this.physics.add.sprite(0, 0, 'breijo');
    this.player.setCollideWorldBounds(false);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.space   = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.cameras.main.setScroll(0, 0);

    // Puerta (invisible)
    this.doorZone = this.add.rectangle(0, 0, 74, 120, 0x00ff00, 0).setOrigin(0.5);
    this.physics.add.existing(this.doorZone, true);

    // Aviso
    this.prompt = this.add.text(0, 0, 'Pulsa ESPACIO para volver', {
      font: '18px Arial', color: '#fff', backgroundColor: '#000'
    }).setOrigin(0.5).setVisible(false).setDepth(1000);

    // Layout inicial + on resize
    this.layout(data.spawn);
    this.scale.on('resize', () => this.layout(data.spawn));
  }

  private layout(spawn?: 'fromMap1') {
    const W = this.scale.width, H = this.scale.height;

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

    // Escala y hitbox del jugador
    const src = this.textures.get('breijo').getSourceImage() as HTMLImageElement;
    const baseH = src?.naturalHeight || this.player.height || 48;
    const pScale = Phaser.Math.Clamp((mapH * 0.14) / baseH, 0.06, 0.7);
    this.player.setScale(pScale);

    const pb = this.player.body as Phaser.Physics.Arcade.Body;
    pb.setSize(this.player.displayWidth * 0.55, this.player.displayHeight * 0.55, true);

    // Spawn
    if (spawn === 'fromMap1') {
      this.player.setPosition(mapX + 120, mapY + mapH * 0.72);
    } else if (this.player.x === 0 && this.player.y === 0) {
      this.player.setPosition(mapX + mapW / 2, mapY + mapH * 0.75);
    }

    // Puerta aula: arriba‑izquierda (ajusta offsets si hace falta)
    const doorX = mapX + 60;
    const doorY = mapY + 130;
    this.doorZone.setPosition(doorX, doorY);
    this.prompt.setPosition(doorX, doorY - 70);

    // Sincronizar cuerpo estático
    const body = this.doorZone.body as Phaser.Physics.Arcade.StaticBody;
    body.setSize(this.doorZone.displayWidth, this.doorZone.displayHeight);
    body.updateFromGameObject(this.doorZone);
  }

  update() {
    const speed = 220;

    this.player.setVelocity(0);
    if (this.cursors.left?.isDown)  this.player.setVelocityX(-speed);
    else if (this.cursors.right?.isDown) this.player.setVelocityX(speed);
    if (this.cursors.up?.isDown)    this.player.setVelocityY(-speed);
    else if (this.cursors.down?.isDown)  this.player.setVelocityY(speed);

    // Clamp por cuerpo para llegar más al borde
    const pb = this.player.body as Phaser.Physics.Arcade.Body;
    const halfW = pb.width / 2, halfH = pb.height / 2;
    this.player.x = Phaser.Math.Clamp(this.player.x, this.bounds.x + halfW, this.bounds.x + this.bounds.w - halfW);
    this.player.y = Phaser.Math.Clamp(this.player.y, this.bounds.y + halfH, this.bounds.y + this.bounds.h - halfH);

    // Puerta: comprobar solape aquí
    const touching = this.physics.world.overlap(this.player, this.doorZone);
    this.prompt.setVisible(touching);
    if (touching && Phaser.Input.Keyboard.JustDown(this.space)) {
      this.scene.stop();
      this.scene.start('GameScene', { spawn: 'fromMap2' });
    }
  }
}
