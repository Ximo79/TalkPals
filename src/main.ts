import Phaser from 'phaser';
import { GameScene } from './GameScene';

new Phaser.Game({
  type: Phaser.AUTO,
  pixelArt: true,
  physics: { default: 'arcade', arcade: { gravity: { y: 0 } } }, // sin gravedad
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: 1280, height: 720 },
  scene: [GameScene]
});
