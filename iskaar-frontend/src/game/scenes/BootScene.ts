import Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    this.load.image("card_knut", "assets/cards/card_knut.png");

    //background
    this.load.image("background", "assets/general/background.png");
  }

  create() {
    this.scene.start("GameScene");
  }
}
