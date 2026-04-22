import Phaser from "phaser";

export class Button extends Phaser.GameObjects.Container {
  private image: Phaser.GameObjects.Image;
  private displayText: Phaser.GameObjects.Text;
  public textureKey: string;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    text: string,
    texture: string,
    onClick?: () => void,
  ) {
    super(scene, x, y);

    this.textureKey = texture;
    this.image = scene.add.image(0, 0, texture);

    this.displayText = scene.add
      .text(0, 0, text, {
        fontSize: "70px",
        fontFamily: "Cinzel",
        fontStyle: "bold",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 6,
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setShadow(2, 2, "#000000", 4, true, true);

    this.add(this.image);
    this.add(this.displayText);

    this.setSize(this.image.width, this.image.height);
    this.setInteractive();

    this.setScale(this.getScale(this.image, width));

    if (onClick) {
      this.on("pointerdown", onClick);
    }

    scene.add.existing(this);
  }

  private getScale(image: Phaser.GameObjects.Image, targetWidth: number) {
    return targetWidth / image.width;
  }

  show(on: boolean) {
    if (on) {
      this.fadeIn();
    } else {
      this.setVisible(false);
    }
  }

  private fadeIn() {
    this.setAlpha(0);
    this.setVisible(true);

    this.scene.tweens.add({
      targets: this,
      alpha: 1,
      duration: 300,
      ease: "Power2",
    });
  }
}
