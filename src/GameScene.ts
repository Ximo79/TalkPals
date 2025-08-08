import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private readonly MARGIN = 12;

  preload() {
    this.load.image('mapa', 'assets/map_1_court.png');
    this.load.image('breijo', 'assets/sprite_1_front.png');
  }

  create() {
    this.buildScene();
    // Recalcular al cambiar tamaño de ventana
    this.scale.on('resize', () => this.buildScene(), this);
  }

  private buildScene() {
    this.children.removeAll(); // limpiar y rehacer layout

    const { width: W, height: H } = this.scale;

    // --- MAPA: encajar y luego duplicar tamaño ---
    const fondo = this.add.image(0, 0, 'mapa').setOrigin(0, 0);
    const maxW = W - this.MARGIN * 2;
    const maxH = H - this.MARGIN * 2;
    const fitScale = Math.min(maxW / fondo.width, maxH / fondo.height);
    const scale = fitScale * 2; // ← doble de grande
    fondo.setScale(scale);

    // centrar con márgenes
    const mapW = fondo.width * scale;
    const mapH = fondo.height * scale;
    const mapX = Math.max(this.MARGIN, (W - mapW) / 2);
    const mapY = Math.max(this.MARGIN, (H - mapH) / 2);
    fondo.setPosition(mapX, mapY);

    // --- MUNDO/BORDES (jugador se limita a la zona visible del mapa) ---
    this.physics.world.setBounds(0, 0, W, H);  // físicas en pantalla
    const bounds = { x: mapX, y: mapY, w: mapW, h: mapH };
    this.data.set('bounds', bounds);

    // --- JUGADOR: 1/3 del tamaño anterior ---
    const playerScale = (0.16 / 3); // si usabas 0.16 antes
    this.player = this.physics.add
      .sprite(bounds.x + bounds.w / 2, bounds.y + bounds.h / 2, 'breijo')
      .setScale(playerScale);
    this.player.setCollideWorldBounds(false);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.cameras.main.setScroll(0, 0); // mapa fijo
  }

  update() {
    const speed = 200;
    if (!this.player) return;

    this.player.setVelocity(0);
    if (this.cursors.left?.isDown)  this.player.setVelocityX(-speed);
    else if (this.cursors.right?.isDown) this.player.setVelocityX(speed);
    if (this.cursors.up?.isDown)    this.player.setVelocityY(-speed);
    else if (this.cursors.down?.isDown)  this.player.setVelocityY(speed);

    // Limitar dentro del mapa dibujado
    const { x, y, w, h } = this.data.get('bounds');
    this.player.x = Phaser.Math.Clamp(this.player.x, x, x + w);
    this.player.y = Phaser.Math.Clamp(this.player.y, y, y + h);
  }
}
