import Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    //cards
    this.load.setPath("assets/cards");
    this.load.image("CardBack", "back.png");
    this.load.image("Knut", "knut.png");
    this.load.image("Gro", "gro.png");
    this.load.image("Rand", "rand.png");
    this.load.image("Troll", "troll.png");

    //backgrounds
    this.load.setPath("assets/backgrounds");
    this.load.image("Background", "background.png");

    //panels
    this.load.setPath("assets/ui/panels");
    this.load.image("Frame", "frame.png");
    this.load.image("OpponentBarBg", "opponent_area_back.png");
  }

  create() {
    this.scene.start("GameScene");
  }
}
