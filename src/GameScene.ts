import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private jump!: Phaser.Input.Keyboard.Key;
  private fondo!: Phaser.GameObjects.Image;
  private ground!: Phaser.Physics.Arcade.StaticGroup;
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

    this.ground = this.physics.add.staticGroup();
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

    // encajar mapa dentro del canvas con margen, sin recortes
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

    this.bounds = { x: mapX, y: mapY, w: mapW, h: mapH };

    // tamaño del sprite: ~15% de la altura del mapa (un poco mayor)
    const img = this.textures.get('breijo').getSourceImage() as HTMLImageElement;
    const baseH = img?.naturalHeight || this.player.height || 48;
    const targetH = mapH * 0.15;               // ↑ más grande
    const pScale = Phaser.Math.Clamp(targetH / baseH, 0.06, 0.7);
    this.player.setScale(pScale);

    // cuerpo físico acorde al gráfico
    this.player.body.setSize(this.player.width, this.player.height);
    this.player.body.setOffset(-this.player.displayWidth / 2, -this.player.displayHeight / 2);

    // colocar en centro si es la primera vez
    if (this.player.x === 0 && this.player.y === 0) {
      this.player.setPosition(mapX + mapW / 2, mapY + mapH * 0.75); // empieza sobre el “suelo”
    }

    // reconstruir suelo: una barra a lo largo del piso del mapa
    this.ground.clear(true, true);
    const floorY = mapY + mapH * 0.86; // no deja “caminar por el techo”; ajusta si quieres más arriba/abajo
    const groundRect = this.add.rectangle(mapX + mapW / 2, floorY, mapW, 10).setOrigin(0.5, 0.5).setAlpha(0);
    this.ground.add(groundRect);
    this.physics.world.enable(groundRect, Phaser.Physics.Arcade.STATIC_BODY);
  }

  update() {
    const speed = 220;
    this.player.setVelocityX(0);

    if (this.cursors.left?.isDown)  this.player.setVelocityX(-speed);
    else if (this.cursors.right?.isDown) this.player.setVelocityX(speed);

    // salto con SPACE si está en el suelo
    if (Phaser.Input.Keyboard.JustDown(this.jump) && (this.player.body as Phaser.Physics.Arcade.Body).blocked.down) {
      this.player.setVelocityY(-520);
    }

    // clamp horizontal dentro del mapa visible
    const halfW = this.player.displayWidth * 0.5;
    const minX = this.bounds.x + halfW;
    const maxX = this.bounds.x + this.bounds.w - halfW;
    this.player.x = Phaser.Math.Clamp(this.player.x, minX, maxX);

    // límite vertical: no subir por encima del techo del mapa, caer hasta el suelo
    const ceiling = this.bounds.y + this.player.displayHeight * 0.5;       // techo del mapa
    const floorMax = this.bounds.y + this.bounds.h - this.player.displayHeight * 0.5; // por seguridad
    this.player.y = Phaser.Math.Clamp(this.player.y, ceiling, floorMax);
  }
}
