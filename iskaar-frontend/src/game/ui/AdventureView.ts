import type { AdventureViewData } from "../view/AdventureViewData";

export class AdventureView extends Phaser.GameObjects.Container {
  private debugBg!: Phaser.GameObjects.Rectangle;
  private adventureViewData!: AdventureViewData;
  private track!: Phaser.GameObjects.Image;
  private marker!: Phaser.GameObjects.Image;
  private slots: Phaser.Math.Vector2[] = [];

  private layoutWidth!: number;
  private layoutHeight!: number;
  private cellWidth!: number;

  constructor(scene: Phaser.Scene) {
    super(scene);
    this.scene.add.existing(this);
    this.marker = this.scene.add.image(0, 0, "PosMarker");
    this.debugBg = this.scene.add.rectangle(0, 0, 100, 100, 0xfff300, 0);
    this.debugBg.setOrigin(0, 1);
    this.loadTrack();
    this.marker.setOrigin(0, 1);
    this.marker.setScale(0.2);
    this.setVisible(false);
    this.add([this.debugBg, this.track, this.marker]);
  }

  setAdventureTrackData(adventure: AdventureViewData) {
    this.adventureViewData = adventure;
    this.loadTrack();
  }

  updateLayout(
    x: number,
    y: number,
    width: number,
    height: number,
    cellWidth: number,
  ) {
    this.layoutWidth = width;
    this.layoutHeight = height;
    this.cellWidth = cellWidth;

    this.debugBg.setPosition(x, y);
    this.debugBg.setSize(width, height);
    this.updateUI();
    this.buildSlots();
    this.updateMarker();

    this.setVisible(true);
  }

  private updateUI() {
    this.track.setOrigin(0, 1);
    this.track.setDisplaySize(this.layoutWidth, this.layoutHeight);
  }

  private loadTrack() {
    this.track?.destroy();

    if (!this.adventureViewData) {
      this.track = this.scene.add.image(0, 0, "Track6");
    } else {
      this.track = this.scene.add.image(
        0,
        0,
        "Track" + this.adventureViewData.size,
      );
    }

    this.track.setOrigin(0, 1);

    this.add(this.track);

    this.sendToBack(this.debugBg);
    this.bringToTop(this.marker);
  }

  private buildSlots() {
    this.slots = this.slotFactors.map(slot => {
      return new Phaser.Math.Vector2(
        this.layoutWidth * slot.x,
        -this.layoutHeight * slot.y,
      );
    });
  }

  private updateMarker() {
    if (!this.adventureViewData) {
      return;
    }

    const slot = this.slots[this.adventureViewData.position];

    if (!slot) {
      return;
    }

    this.marker.setPosition(slot.x, slot.y);
  }

  private slotFactors = [
    { x: 0.28, y: 0.07 }, // START
    { x: 0.3, y: 0.22 }, // I
    { x: 0.32, y: 0.385 }, // II
    { x: 0.355, y: 0.55 }, // III
    { x: 0.38, y: 0.71 }, // IV
    { x: 0.215, y: 0.77 }, // V
    { x: 0.06, y: 0.825 }, // VI
  ];
}
