import type { AdventureViewData } from "../view/AdventureViewData";

export class AdventureView extends Phaser.GameObjects.Container {
  private debugBg!: Phaser.GameObjects.Rectangle;
  private adventureViewData!: AdventureViewData;
  private track!: Phaser.GameObjects.Image;

  private marker!: Phaser.GameObjects.Image;
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
    this.debugBg.setPosition(x, y);
    this.debugBg.setSize(width, height);
    this.updateUI(width, height, cellWidth);
    this.setVisible(true);
  }

  private updateUI(width: number, height: number, cellWidth: number) {
    this.track.setOrigin(0, 1);
    this.track.setDisplaySize(width, height);
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
    this.add([this.debugBg, this.track]);
  }

  private calulateMarkerPosition() {}
}
