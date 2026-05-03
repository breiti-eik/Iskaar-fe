import Phaser from "phaser";

export class TableauView {
  private scene: Phaser.Scene;
  private container!: Phaser.GameObjects.Container;
  private background!: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  create(x: number, y: number) {
    if (this.container) return;

    this.container = this.scene.add.container(x, y);

    this.background = this.scene.add.image(0, 0, "Tableau");
    this.background.setOrigin(0, 1); // unten links

    this.container.add(this.background);
  }

  setPosition(x: number, y: number) {
    this.container.setPosition(x, y);
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
