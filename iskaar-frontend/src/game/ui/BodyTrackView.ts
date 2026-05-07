import { BodyViewData } from "./../view/BodyViewData";
export class BodyTrackView extends Phaser.GameObjects.Container {
  private debugBg!: Phaser.GameObjects.Rectangle;
  private marker!: Phaser.GameObjects.Image;

  private bodyViewData!: BodyViewData;
  private space = -0.06;

  constructor(scene: Phaser.Scene) {
    super(scene);
    this.scene.add.existing(this);
    this.marker = this.scene.add.image(0, 0, "PosMarker");
    this.marker.setOrigin(0, 1);
    this.setVisible(false);
    this.add(this.marker);
    this.debugBg = this.scene.add.rectangle(0, 0, 100, 100, 0xff5500, 0);
    this.debugBg.setOrigin(0, 1);

    this.add(this.debugBg);
  }

  updateLayout(
    x: number,
    y: number,
    width: number,
    height: number,
    cellSize: number,
  ) {
    this.setPosition(x, y);
    this.marker.setScale(0.2);
    this.debugBg.setSize(width, height);

    const positionY = Math.round(
      height * this.space - this.bodyViewData.health * cellSize,
    );
    const postionX = Math.round((width - this.marker.displayWidth) * 0.5);

    this.marker.setPosition(postionX, positionY);
    this.setVisible(true);
  }

  setBodyTrackData(body: BodyViewData) {
    this.bodyViewData = body;
  }
}
