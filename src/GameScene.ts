import Phaser from 'phaser'

export class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

  constructor() {
    super('GameScene')
  }

  preload() {
    // Carga imágenes desde /public/assets
    this.load.image('mapa', 'assets/map_1_court.png')
    this.load.image('breijo', 'assets/sprite_1_front.png')
  }

  create() {
    // Fondo
    const fondo = this.add.image(0, 0, 'mapa').setOrigin(0, 0)

    // Ajustar el mapa para que encaje lo mejor posible en pantalla
    const scaleX = this.scale.width / fondo.width
    const scaleY = this.scale.height / fondo.height
    const scale = Math.min(scaleX, scaleY) * 1.2 // un poquito más grande
    fondo.setScale(scale)

    const mapWidth = fondo.width * scale
    const mapHeight = fondo.height * scale

    // Mundo y cámara
    this.physics.world.setBounds(0, 0, mapWidth, mapHeight)
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight)

    // Jugador (sprite más grande que antes)
    this.player = this.physics.add.sprite(mapWidth / 2, mapHeight / 2, 'breijo')
    this.player.setScale(0.5)
    this.player.setCollideWorldBounds(true)

    // Cámara sigue al jugador
    this.cameras.main.startFollow(this.player)

    // Controles
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
