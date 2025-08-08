import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private readonly MARGIN = 24; // margen alrededor del mapa

  preload() {
    this.load.image('mapa', 'assets/map_1_court.png');      // en public/assets
    this.load.image('breijo', 'assets/sprite_1_front.png'); // en public/assets
  }

  create() {
    const { width: W, height: H } = this.scale;

    // mapa fijo, ajustado a pantalla con márgenes
    const fondo = this.add.image(0, 0, 'mapa').setOrigin(0, 0);
    const maxW = W - this.MARGIN * 2;
    const maxH = H - this.MARGIN * 2;
    const scale = Math.min(maxW / fondo.width, maxH / fondo.height);
    fondo.setScale(scale).setPosition(this.MARGIN, this.MARGIN);

    // límites jugables dentro del mapa escalado
    const mapX = this.MARGIN;
    const mapY = this.MARGIN;
    const mapW = fondo.width * scale;
    const mapH = fondo.height * scale;

    // sprite pequeño, centrado
    this.player = this.physics.add
      .sprite(mapX + mapW / 2, mapY + mapH / 2, 'breijo')
      .setScale(0.16);
    this.player.setCollideWorldBounds(false); // limitamos manualmente

    // mapa fijo: no seguir con la cámara
    this.cameras.main.setScroll(0, 0);

    // cursores
    this.cursors = this.input.keyboard.createCursorKeys();

    // guardar límites para clamping en update
    this.data.set('bounds', { mapX, mapY, mapW, mapH });
  }

  update() {
    const speed = 200;
    this.player.setVelocity(0);

    if (this.cursors.left?.isDown) this.player.setVelocityX(-speed);
    else if (this.cursors.right?.isDown) this.player.setVelocityX(speed);

    if (this.cursors.up?.isDown) this.player.setVelocityY(-speed);
    else if (this.cursors.down?.isDown) this.player.setVelocityY(speed);

    // mantener al jugador dentro del mapa visible
    const { mapX, mapY, mapW, mapH } = this.data.get('bounds');
    this.player.x = Phaser.Math.Clamp(this.player.x, mapX, mapX + mapW);
    this.player.y = Phaser.Math.Clamp(this.player.y, mapY, mapY + mapH);
  }
}
