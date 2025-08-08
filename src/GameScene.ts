import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super('GameScene');
  }

  preload() {
    // Carga de imágenes desde la carpeta pública (public/assets)
    this.load.image('mapa', 'assets/map_1_court.png');
    this.load.image('breijo', 'assets/sprite_1_front.png');
  }

  create() {
    // Fondo
    const fondo = this.add.image(0, 0, 'mapa').setOrigin(0, 0).setScale(1);
    const width = fondo.width * fondo.scaleX;
    const height = fondo.height * fondo.scaleY;

    // Mundo y cámara
    this.physics.world.setBounds(0, 0, width, height);
    this.cameras.main.setBounds(0, 0, width, height);

    // Jugador con escala ajustada
    this.player = this.physics.add.sprite(150, 150, 'breijo').setScale(0.25);
    this.player.setCollideWorldBounds(true);
    this.player.setTint(0xff0000); // Rojo para visibilidad

    // Cámara sigue al jugador
    this.cameras.main.startFollow(this.player);

    // Controles de teclado
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    const speed = 200;
    this.player.setVelocity(0);

    if (this.cursors.left?.isDown) {
      this.player.setVelocityX(-speed);
    } else if (this.cursors.right?.isDown) {
      this.player.setVelocityX(speed);
    }

    if (this.cursors.up?.isDown) {
      this.player.setVelocityY(-speed);
    } else if (this.cursors.down?.isDown) {
      this.player.setVelocityY(speed);
    }
  }
}
