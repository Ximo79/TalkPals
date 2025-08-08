import Phaser from 'phaser'

export class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

  constructor() {
    super('GameScene')
  }

  preload() {
    // Carga de imágenes desde la carpeta pública
  this.load.image('mapa', 'assets/map_1_court.png')
this.load.image('breijo', 'assets/sprite_1_front.png')

  }

  create() {
    // Agrega el fondo
    const fondo = this.add.image(0, 0, 'mapa').setOrigin(0, 0)
    console.log('Tamaño del fondo:', fondo.width, fondo.height)

    fondo.setScale(1)

    const width = fondo.width * fondo.scaleX
    const height = fondo.height * fondo.scaleY

    this.physics.world.setBounds(0, 0, width, height)
    this.cameras.main.setBounds(0, 0, width, height)

    // Crea el jugador
    this.player = this.physics.add.sprite(150, 150, 'breijo')
    this.player.setCollideWorldBounds(true)
    this.player.setTint(0xff0000)

    this.cameras.main.startFollow(this.player)

    this.cursors = this.input.keyboard.createCursorKeys()
  }

  update() {
    const speed = 200
    this.player.setVelocity(0)

    if (this.cursors.left?.isDown) {
      this.player.setVelocityX(-speed)
    } else if (this.cursors.right?.isDown) {
      this.player.setVelocityX(speed)
    }

    if (this.cursors.up?.isDown) {
      this.player.setVelocityY(-speed)
    } else if (this.cursors.down?.isDown) {
      this.player.setVelocityY(speed)
    }
  }
}
