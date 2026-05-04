import Phaser from "phaser";

export class TableauView extends Phaser.GameObjects.Container {
  private background!: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene) {
    super(scene);
    this.scene.add.existing(this);
  }

  create() {
    if (this.background) return;

    this.background = this.scene.add.image(0, 0, "Tableau");
    this.background.setOrigin(0, 1); // unten links

    this.add(this.background);
  }

  updateLayout(maxWidth: number) {
    const texture = this.background.texture.getSourceImage();

    const scale = maxWidth / texture.width;

    this.background.setScale(scale);
  }

  getWidth(): number {
    return this.background.displayWidth;
  }

  getHeight(): number {
    return this.background.displayHeight;
  }
}
