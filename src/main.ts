import Phaser from 'phaser';
import { GameScene } from './GameScene';

new Phaser.Game({
  type: Phaser.AUTO,
  pixelArt: true,
  physics: { default: 'arcade', arcade: { gravity: { y: 0 } } },
  // Canvas responsivo
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1024,     // base lógica; se reescala al viewport
    height: 576
  },
  scene: [GameScene]
});
