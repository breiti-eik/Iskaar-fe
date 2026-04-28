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
    this.load.image("Rosette", "rosette.png");

    //buttons
    this.load.setPath("assets/ui/buttons");
    this.load.image("Button_2", "button2.png");
    this.load.image("Button_3", "button3.png");
  }

  create() {
    this.cache.obj.add("textStyle-label", {
      fontFamily: "Arial Black",
      fontSize: 40,
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 5,
      align: "center",
    });
    this.scene.start("GameScene");
  }
}
