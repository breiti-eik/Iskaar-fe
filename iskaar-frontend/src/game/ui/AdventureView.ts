import type { AdventureViewData } from "../view/AdventureViewData";

export class AdventureView extends Phaser.GameObjects.Container {
  private debugBg!: Phaser.GameObjects.Rectangle;
  private adventureViewData!: AdventureViewData;

  private track!: Phaser.GameObjects.Image;

  private marker!: Phaser.GameObjects.Image;

  private space = -0.06;

  constructor(scene: Phaser.Scene) {
    super(scene);
    this.scene.add.existing(this);
    this.marker = this.scene.add.image(0, 0, "PosMarker");
    this.debugBg = this.scene.add.rectangle(0, 0, 100, 100, 0xff0000, 0);
    this.debugBg.setOrigin(0, 1);
    this.loadTrack();
    this.marker.setOrigin(0, 1);
    this.setVisible(false);
  }

  setAdventureTrackData(adventure: AdventureViewData) {
    this.adventureViewData = adventure;
  }

  updateLayout(cellsize: number, scale: number) {
    this.debugBg.setScale(scale);
    this.marker.setScale(0.2);

    this.setVisible(true);
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
    this.track.setScale(0.15);

    this.add([this.track]);
  }
}
