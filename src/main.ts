import Phaser from 'phaser';
import { GameScene } from './GameScene';
import { NextScene } from './NextScene';

new Phaser.Game({
  type: Phaser.AUTO,
  pixelArt: true,
  physics: { default: 'arcade', arcade: { gravity: { y: 0 } } },
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: 1280, height: 720 },
  scene: [GameScene, NextScene]
});
