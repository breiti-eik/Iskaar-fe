import Phaser from "phaser";
import { BodyTrackView } from "./BodyTrackView";
import type { TableauViewData } from "../view/TableauViewData";
import { AdventureView } from "./AdventureView";

export class TableauView extends Phaser.GameObjects.Container {
  private background!: Phaser.GameObjects.Image;
  private debugBg!: Phaser.GameObjects.Rectangle;

  private bodyTrack!: BodyTrackView;
  private adventureTrack!: AdventureView;

  constructor(scene: Phaser.Scene) {
    super(scene);
    this.scene.add.existing(this);
    this.create();
  }

  create() {
    if (this.background) return;
    this.debugBg = this.scene.add.rectangle(0, 0, 100, 100, 0x00ff00, 0);
    this.background = this.scene.add.image(0, 0, "Tableau");
    this.background.setOrigin(0, 1); // unten links
    this.debugBg.setOrigin(0, 1);

    this.bodyTrack = new BodyTrackView(this.scene);
    this.adventureTrack = new AdventureView(this.scene);

    this.setVisible(false);
    this.add([
      this.background,
      this.bodyTrack,
      this.debugBg,
      this.adventureTrack,
    ]);
  }

  setTableauData(tableau: TableauViewData) {
    this.bodyTrack.setBodyTrackData(tableau.body);
    this.adventureTrack.setAdventureTrackData(tableau.adventure);
  }

  updateLayout(maxWidth: number) {
    const texture = this.background.texture.getSourceImage();

    const scale = maxWidth / texture.width;
    this.debugBg.setDisplaySize(maxWidth, maxWidth);
    this.setVisible(true);
    this.background.setScale(scale);
    this.layoutUI(scale);
  }

  layoutUI(scale: number) {
    const w = this.getBounds().width;
    const h = this.getBounds().height;
    const bodyTrackWidth = w * 0.16;
    const margin = 20;
    // Bodytrack
    this.bodyTrack.updateLayout(bodyTrackWidth, h);
    this.bodyTrack.setPosition(margin, 0);
    // Adventuretrack
    this.adventureTrack.updateLayout(w * 0.32, h);
    this.adventureTrack.setPosition(0, 0);
  }

  getWidth(): number {
    return this.background.displayWidth;
  }

  getHeight(): number {
    return this.background.displayHeight;
  }
}
