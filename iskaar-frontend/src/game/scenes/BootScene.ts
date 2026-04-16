import Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    this.load.image("Knut", "assets/cards/knut.png");
    this.load.image("Troll", "assets/cards/troll.png");
    this.load.image("CardBack", "assets/cards/back.png");

    //background
    this.load.image("Background", "assets/general/background.png");
    this.load.image("OpponentBarBg", "assets/general/opponent_area_back.png");
  }

  create() {
    this.scene.start("GameScene");
  }
}
