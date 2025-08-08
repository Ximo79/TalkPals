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
  // Cargar fondo y escalarlo
  const fondo = this.add.image(0, 0, 'mapa').setOrigin(0, 0).setScale(3); // Ajusta si es necesario
  const width = fondo.width * fondo.scaleX;
  const height = fondo.height * fondo.scaleY;

  // Definir límites del mundo
  this.physics.world.setBounds(0, 0, width, height);
  this.cameras.main.setBounds(0, 0, width, height);

  // Sprite del jugador con escala reducida
  this.player = this.physics.add.sprite(150, 150, 'breijo').setScale(0.2);
  this.player.setCollideWorldBounds(true);

  // Cámara sigue al jugador
  this.cameras.main.startFollow(this.player);

  // Controles
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
