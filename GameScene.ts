import Phaser from 'phaser'

export class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

  constructor() {
    super('GameScene')
  }

  preload() {
    this.load.image('mapa', 'assets/map_1_court.png')
    this.load.image('breijo', 'assets/sprite_1_front.png')
  }

  create() {
    const fondo = this.add.image(0, 0, 'mapa').setOrigin(0, 0).setScale(0.3)
    const width = fondo.width * fondo.scaleX
    const height = fondo.height * fondo.scaleY

    this.physics.world.setBounds(0, 0, width, height)

    this.player = this.physics.add.sprite(100, 100, 'breijo')
    this.player.setCollideWorldBounds(true)

    this.cameras.main.startFollow(this.player)
    this.cameras.main.setBounds(0, 0, width, height)

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