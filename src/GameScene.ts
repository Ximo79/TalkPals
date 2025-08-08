import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  // margen en píxeles alrededor del mapa
  private readonly MARGIN = 24;

  preload() {
    this.load.image('mapa', 'assets/map_1_court.png');
    this.load.image('breijo', 'assets/sprite_1_front.png');
  }

  create() {
    const { width: W, height: H } = this.scale;

    // mapa fijo, escalado para "encajar" dentro del canvas con márgenes
    const fondo = this.add.image(0, 0, 'mapa').setOrigin(0, 0);
    const maxW = W - this.MARGIN * 2;
    const maxH = H - this.MARGIN * 2;
    const scale = Math.min(maxW / fondo.width, maxH / fondo.height);
    fondo.setScale(scale).setPosition(this.MARGIN, this.MARGIN);

    // rectángulo útil del mapa (para limitar al jugador)
    const mapX = this.MARGIN;
    const mapY = this.MARGIN;
    const mapW = fondo.width * scale;
    const mapH = fondo.height * scale;

    // jugador pequeño, centrado en el mapa
    this.player = this.physics.add
      .sprite(mapX + mapW / 2, mapY + mapH / 2, 'breijo')
      .setScale(0.18);
    this.player.setCollideWorldBounds(false); // limitamos manualmente

    // cursores
    this.cursors = this.input.keyboard.createCursorKeys();

    // sin seguimiento de cámara: el mapa queda fijo
    this.cameras.main.setScroll(0, 0);

    // guardamos límites para usarlos en update
    this.data.set('bounds', { mapX, mapY, mapW, mapH });
  }

  update() {
    const speed = 200;
    this.player.setVelocity(0);

    if (this.cursors.left?.isDown) this.player.setVelocityX(-speed);
    else if (this.cursors.right?.isDown) this.player.setVelocityX(speed);

    if (this.cursors.up?.isDown) this.player.setVelocityY(-speed);
    else if (this.cursors.down?.isDown) this.player.setVelocityY(speed);

    // clamp dentro del área visible del mapa
    const { mapX, mapY, mapW, mapH } = this.data.get('bounds');
    this.player.x = Phaser.Math.Clamp(this.player.x, mapX, mapX + mapW);
    this.player.y = Phaser.Math.Clamp(this.player.y, mapY, mapY + mapH);
  }
}
