import Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    this.load.image("Knut", "assets/cards/knut.png");
    this.load.image("Troll", "assets/cards/troll.png");

    //background
    this.load.image("background", "assets/general/background.png");
  }

  create() {
    this.scene.start("GameScene");
  }
}
