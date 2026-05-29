export class VPMarker extends Phaser.GameObjects.Container {
  private image: Phaser.GameObjects.Image;
  public textureKey: string;
  public id: string;

  constructor(scene: Phaser.Scene, id: string, texture: string, scale: number) {
    super(scene);
    this.textureKey = texture;
    this.id = id;
    this.image = scene.add.image(0, 0, texture);
    this.image.setScale(scale);
    this.image.setOrigin(0.5, 0.5);
    this.add(this.image);
    scene.add.existing(this);
  }
}
