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
