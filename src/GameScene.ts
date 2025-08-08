import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private jump!: Phaser.Input.Keyboard.Key;
  private fondo!: Phaser.GameObjects.Image;
  private ground!: Phaser.GameObjects.Rectangle;
  private bounds = { x: 0, y: 0, w: 0, h: 0 };
  private readonly MARGIN = 16;

  preload() {
    this.load.image('mapa', 'assets/map_1_court.png');
    this.load.image('breijo', 'assets/sprite_1_front.png');
  }

  create() {
    this.fondo = this.add.image(0, 0, 'mapa').setOrigin(0, 0);
    this.player = this.physics.add.sprite(0, 0, 'breijo');
    this.player.setCollideWorldBounds(true);           // ← evita salir de pantalla
    this.player.setBounce(0);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.jump = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.cameras.main.setScroll(0, 0);

    this.layout();
    this.scale.on('resize', () => this.layout());

    // collider jugador ↔ suelo
    this.physics.add.collider(this.player, this.ground);
  }

  private layout() {
    const W = this.scale.width, H = this.scale.height;

    // encajar mapa completo
    const maxW = W - this.MARGIN * 2;
    const maxH = H - this.MARGIN * 2;
    const s = Math.min(maxW / this.fondo.width, maxH / this.fondo.height);
    this.fondo.setScale(s);

    // centrar
    const mapW = this.fondo.width * s;
    const mapH = this.fondo.height * s;
    const mapX = (W - mapW) / 2;
    const mapY = (H - mapH) / 2;
    this.fondo.setPosition(mapX, mapY);

    this.bounds = { x: mapX, y: mapY, w: mapW, h: mapH };

    // escalar jugador (≈15% del alto del mapa)
    const img = this.textures.get('breijo').getSourceImage() as HTMLImageElement;
    const baseH = img?.naturalHeight || this.player.height || 48;
    const pScale = Phaser.Math.Clamp((mapH * 0.15) / baseH, 0.06, 0.7);
    this.player.setScale(pScale);

    // colocar si es primera vez
    if (this.player.body.position.length() === 0) {
      this.player.setPosition(mapX + mapW / 2, mapY + mapH * 0.75);
    }

    // (re)crear suelo estático grueso
    if (this.ground) this.ground.destroy();
    const floorY = mapY + mapH - 6;                   // borde inferior del mapa
    this.ground = this.add.rectangle(mapX + mapW / 2, floorY, mapW, 20, 0x000000, 0);
    this.physics.add.existing(this.ground, true);     // ← cuerpo estático real

    // asegurar collider (tras recrear el suelo)
    (this.player.body as Phaser.Physics.Arcade.Body).updateBounds(); 
    this.physics.world.colliders.destroy();           // limpiamos colliders antiguos
    this.physics.add.collider(this.player, this.ground);
  }

  update() {
    const speed = 220;
    const body = this.player.body as Phaser.Physics.Arcade.Body;

    this.player.setVelocityX(0);
    if (this.cursors.left?.isDown)  this.player.setVelocityX(-speed);
    else if (this.cursors.right?.isDown) this.player.setVelocityX(speed);

    if (Phaser.Input.Keyboard.JustDown(this.jump) && body.blocked.down) {
      this.player.setVelocityY(-520);                 // salto
    }

    // limitar dentro del mapa (evita entrar en márgenes)
    const halfW = this.player.displayWidth * 0.5;
    const minX = this.bounds.x + halfW;
    const maxX = this.bounds.x + this.bounds.w - halfW;
    this.player.x = Phaser.Math.Clamp(this.player.x, minX, maxX);

    // techo seguro
    const ceiling = this.bounds.y + this.player.displayHeight * 0.5;
    if (this.player.y < ceiling) this.player.y = ceiling;
  }
}
