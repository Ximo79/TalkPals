import Phaser from 'phaser';

// Crear juego sin escenas; las cargamos por import() para partir el bundle
const game = new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  pixelArt: true,
  physics: { default: 'arcade', arcade: { gravity: { y: 0 } } },
  scene: []
});

// Code-splitting: carga diferida de la escena principal
import('./GameScene').then(({ GameScene }) => {
  // @ts-ignore
  game.scene.add('GameScene', GameScene, true);
});
