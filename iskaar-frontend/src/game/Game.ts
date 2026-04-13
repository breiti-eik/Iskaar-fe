import Phaser from "phaser";
import { GameScene } from "./scenes/GameScene";
import { BootScene } from "./scenes/BootScene";

export function createGame(container: string): Phaser.Game {
  return new Phaser.Game({
    type: Phaser.AUTO,
    width: 2000,
    height: 980,
    parent: container,
    backgroundColor: "#1e1e1e",
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [BootScene, GameScene],
  });
}
