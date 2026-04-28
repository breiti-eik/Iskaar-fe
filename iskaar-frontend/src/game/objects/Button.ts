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
  ) {
    super(scene, x, y);

    this.textureKey = texture;
    this.image = scene.add.image(0, 0, texture);

    const BASE_FONT_SIZE = 40;

    this.displayText = scene.add
      .text(0, 0, text, {
        fontSize: `${BASE_FONT_SIZE}px`,
        fontFamily: "Cinzel",
        fontStyle: "bold",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 6,
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setShadow(2, 2, "#000000", 4, true, true);
    this.displayText.setPosition(0, 0);
    this.displayText.setOrigin(0.5);

    this.add(this.image);
    this.add(this.displayText);

    const scale = this.getScale(this.image, width);
    this.image.setScale(scale);
    this.setSize(width, this.image.height * scale);

    this.setInteractive();

    this.fitTextToWidth(width * 0.7);

    scene.add.existing(this);
  }

  public fitTextToWidth(maxWidth: number) {
    const text = this.displayText;

    const baseFontSize = 40;
    const minFontSize = 16;

    text.setFontSize(baseFontSize);

    // ❗ KEIN scale berücksichtigen
    const actualWidth = text.width;

    if (actualWidth <= maxWidth) return;

    const ratio = maxWidth / actualWidth;
    const newSize = Math.max(minFontSize, Math.floor(baseFontSize * ratio));

    text.setFontSize(newSize);
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
