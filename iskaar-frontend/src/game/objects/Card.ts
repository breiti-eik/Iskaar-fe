import Phaser from "phaser";

export class Card extends Phaser.GameObjects.Container {
  private image: Phaser.GameObjects.Image;
  public textureKey: string;
  public id: string;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    id: string,
    texture: string,
  ) {
    super(scene, x, y);

    this.textureKey = texture;
    this.id = id;
    this.image = scene.add.image(0, 0, texture);
    this.image.setDisplaySize(150, 220);
    this.add(this.image);

    this.setSize(150, 220);
    this.setInteractive();

    scene.add.existing(this);
  }
}
