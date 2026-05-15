import { BankView } from "./BankView";
import Phaser from "phaser";
import { BodyTrackView } from "./BodyTrackView";
import type { TableauViewData } from "../view/TableauViewData";
import { AdventureView } from "./AdventureView";
import { VictoryPointsView } from "./VictoryPointsView";

export class TableauView extends Phaser.GameObjects.Container {
  private background!: Phaser.GameObjects.Image;
  private debugBg!: Phaser.GameObjects.Rectangle;

  private bodyTrack!: BodyTrackView;
  private adventureTrack!: AdventureView;
  private victoryPoints!: VictoryPointsView;
  private bankView!: BankView;

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
    this.victoryPoints = new VictoryPointsView(this.scene);
    this.bankView = new BankView(this.scene);

    this.setVisible(false);
    this.add([
      this.background,
      this.bodyTrack,
      this.debugBg,
      this.adventureTrack,
      this.victoryPoints,
      this.bankView,
    ]);
  }

  setTableauData(tableau: TableauViewData) {
    this.bodyTrack.setBodyTrackData(tableau.body);
    this.adventureTrack.setAdventureTrackData(tableau.adventure);
    this.victoryPoints.setVictoryPointsData(tableau.victoryPoints);
    this.bankView.setBankData(tableau.bank);
  }

  updateLayout(maxWidth: number) {
    const texture = this.background.texture.getSourceImage();

    const scale = maxWidth / texture.width;
    this.debugBg.setDisplaySize(maxWidth, maxWidth);
    this.setVisible(true);
    this.background.setScale(scale);
    this.layoutUI();
  }

  layoutUI() {
    const w = this.getWidth();
    const h = this.getHeight();

    const cellWith = w * 0.16;
    // Bodytrack
    const bodyTrackWidth = w * 0.28;
    this.bodyTrack.updateLayout(0, 0, bodyTrackWidth, h, cellWith);

    // Adventuretrack
    this.adventureTrack.updateLayout(0, 0, w, h);

    const rightSlotWidth = w * 0.46;
    const rightSlotX = w - rightSlotWidth;
    const bankHeight = h * 0.55;
    //BankView
    this.bankView.updateLayout(rightSlotX, 0, rightSlotWidth, bankHeight);
    const victoryHeight = h - bankHeight;

    //VictoryPointsView
    this.victoryPoints.updateLayout(
      rightSlotX,
      -bankHeight,
      rightSlotWidth,
      victoryHeight,
    );
  }

  getWidth(): number {
    return this.background.displayWidth;
  }

  getHeight(): number {
    return this.background.displayHeight;
  }
}
