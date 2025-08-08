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
  const fondo = this.add.image(0, 0, 'mapa').setOrigin(0, 0)
  console.log('Fondo cargado con tamaño:', fondo.width, fondo.height)
  fondo.setScale(1)

  this.player = this.physics.add.sprite(100, 100, 'breijo')
  this.player.setCollideWorldBounds(true)

  this.cameras.main.startFollow(this.player)
  this.cameras.main.setBounds(0, 0, fondo.width, fondo.height)

  this.physics.world.setBounds(0, 0, fondo.width, fondo.height)

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
