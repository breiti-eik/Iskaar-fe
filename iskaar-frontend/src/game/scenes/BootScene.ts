import Phaser from "phaser";
import { GrayscalePipeline } from "../../util/GrayscalePipeline";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    //cards
    this.load.setPath("assets/cards");
    this.load.image("CardBack", "back.png");

    //money
    this.load.image("Knut", "knut.png");
    this.load.image("Gro", "gro.png");
    this.load.image("Rand", "rand.png");

    //troll
    this.load.image("Troll", "troll.png");

    //yellow
    this.load.image("Knueppel", "knueppel.png");
    this.load.image("Haube", "haube.png");
    this.load.image("Kutte", "kutte.png");
    this.load.image("Lederschuhe", "lederschuhe.png");

    //orange
    this.load.image("Messer", "messer.png");
    this.load.image("Helm", "helm.png");
    this.load.image("Stiefel", "stiefel.png");
    this.load.image("Kettenhemd", "kettenhemd.png");

    //red
    this.load.image("Schwert", "schwert.png");
    this.load.image("Krone", "krone.png");
    this.load.image("Vollruestung", "vollruestung.png");
    this.load.image("Metallschienen", "metallschienen.png");

    //rings
    this.load.image("Laufring", "laufring.png");
    this.load.image("Friedensring", "friedensring.png");
    this.load.image("Chaosring", "chaosring.png");
    this.load.image("Totenring", "totenring.png");
    this.load.image("Nekromanenring", "nekromanenring.png");
    this.load.image("Fluchring", "fluchring.png");

    //bracletts
    this.load.image("Diebesband", "diebesband.png");
    this.load.image("Talisman", "talisman.png");
    this.load.image("Stahlkette", "stahlkette.png");
    this.load.image("Bannreif", "bannreif.png");

    //neutral
    this.load.image("Kristall", "kristall.png");
    this.load.image("Sonnenuhr", "sonnenuhr.png");

    //backgrounds
    this.load.setPath("assets/backgrounds");
    this.load.image("Background", "background.png");

    //tableau
    this.load.setPath("assets/tableau");
    this.load.image("Tableau", "scoretableau_empty.png");
    this.load.image("PosMarker", "position-marker.png");
    this.load.image("Track6", "a-bar_6.png");
    this.load.image("Track5", "a-bar_5.png");
    this.load.image("Track4", "a-bar_4.png");
    this.load.image("Marker1VP", "1sp-marker.png");
    this.load.image("Marker5VP", "5sp-marker.png");
    this.load.image("Marker10VP", "10sp-marker.png");

    //panels
    this.load.setPath("assets/ui/panels");
    this.load.image("Frame", "frame.png");
    this.load.image("OpponentBarBg", "opponent_area_back.png");
    this.load.image("Rosette", "rosette.png");
    this.load.image("Coin", "coin.png");
    this.load.image("Arrow", "arrow.png");

    //buttons
    this.load.setPath("assets/ui/buttons");
    this.load.image("Button_2", "button2.png");
    this.load.image("Button_3", "button3.png");
  }

  create() {
    const renderer = this.game.renderer;
    this.cache.obj.add("textStyle-label", {
      fontFamily: "Arial Black",
      fontSize: 40,
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 5,
      align: "center",
    });

    if (renderer instanceof Phaser.Renderer.WebGL.WebGLRenderer) {
      renderer.pipelines.add("Grayscale", new GrayscalePipeline(this.game));
    }
    this.scene.start("GameScene");
  }
}
