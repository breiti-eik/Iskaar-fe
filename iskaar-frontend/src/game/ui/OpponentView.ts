import Phaser from "phaser";
import type { OpponentViewData } from "../view/OpponentViewData";

export class OpponentView extends Phaser.GameObjects.Container {
  private hiddenX: number;
  private visibleX: number;

  private visibleBarWidth;

  private expanded = false;

  private nameText!: Phaser.GameObjects.Text;

  private handIcons: Phaser.GameObjects.Image[] = [];
  private drawPileIcon!: Phaser.GameObjects.Image;
  private discardImage!: Phaser.GameObjects.Image;

  private cardAreaContainer!: Phaser.GameObjects.Container;

  private readonly BAR_WIDTH = 455;
  private readonly HEIGHT = 110;

  private readonly CARD_WIDTH = 40;
  private readonly CARD_HEIGHT = 60;

  private readonly LEFT_PADDING = 10;
  private readonly RIGHT_PADDING = 5;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    data: OpponentViewData,
  ) {
    super(scene, x, y);

    this.visibleX = x;
    this.hiddenX = x + width;

    this.visibleBarWidth = this.BAR_WIDTH - width;

    scene.add.existing(this);

    this.setX(this.hiddenX);

    this.buildBase();
    this.buildInteraction();

    this.update(data);
  }

  private buildBase(): void {
    const bg = this.scene.add
      .image(0, 0, "OpponentBarBg")
      .setOrigin(1, 0.5)
      .setDisplaySize(this.BAR_WIDTH, this.HEIGHT);

    // NAME (links sichtbar im collapsed state)
    this.nameText = this.scene.add
      .text(-this.BAR_WIDTH + this.LEFT_PADDING, 5, "", {
        fontSize: "20px",
        fontFamily: "Cinzel",
        fontStyle: "bold",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 3,
      })
      .setOrigin(0, 0.5);

    // DRAW PILE
    this.drawPileIcon = this.scene.add
      .image(0, 0, "CardBack")
      .setDisplaySize(this.CARD_WIDTH, this.CARD_HEIGHT)
      .setOrigin(1, 0.5);

    // HAND (max 5 Karten visuell)
    const handStartX = 60;

    for (let i = 0; i < 5; i++) {
      const card = this.scene.add
        .image(handStartX - i * 6, 0, "CardBack")
        .setDisplaySize(this.CARD_WIDTH - 10, this.CARD_HEIGHT - 10)
        .setOrigin(1, 0.5);

      this.handIcons.push(card);
    }

    // DISCARD
    this.discardImage = this.scene.add
      .image(100, 0, "")
      .setDisplaySize(this.CARD_WIDTH, this.CARD_HEIGHT)
      .setVisible(false);

    this.cardAreaContainer = this.scene.add.container(-270, 0);

    this.cardAreaContainer.add([
      this.drawPileIcon,
      this.discardImage,
      ...this.handIcons,
    ]);

    this.add([bg, this.nameText, this.cardAreaContainer]);
  }

  private buildInteraction(): void {
    const hit = this.scene.add
      .rectangle(0, 0, this.BAR_WIDTH, this.HEIGHT)
      .setOrigin(1, 0.5)
      .setInteractive({ useHandCursor: true });

    this.add(hit);

    hit.on("pointerdown", () => this.toggle());
    hit.on("pointerover", () => this.expand());
    hit.on("pointerout", () => this.collapse());
  }

  private toggle(): void {
    this.expanded ? this.collapse(true) : this.expand(true);
    this.expanded = !this.expanded;
  }

  private expand(lock = false): void {
    this.scene.tweens.add({
      targets: this,
      x: this.visibleX,
      duration: 180,
      ease: "Power2",
    });
  }

  private collapse(lock = false): void {
    if (this.expanded && !lock) return;

    this.scene.tweens.add({
      targets: this,
      x: this.hiddenX,
      duration: 180,
      ease: "Power2",
    });
  }

  update(data: OpponentViewData): void {
    if (!data) return;

    // NAME
    this.nameText.setText(data.playerName);

    const maxWidth =
      this.visibleBarWidth - (this.LEFT_PADDING + this.RIGHT_PADDING);

    this.nameText.setScale(1);

    const textWidth = this.nameText.width;

    let finalScale = 1;

    if (textWidth > maxWidth) {
      finalScale = maxWidth / textWidth;
      this.nameText.setScale(finalScale);
    }

    // 🔥 NEU: zentrieren innerhalb des sichtbaren Bereichs
    const scaledWidth = textWidth * finalScale;

    const leftEdge = -this.BAR_WIDTH + this.LEFT_PADDING;
    const centerOffset = (maxWidth - scaledWidth) / 2;

    this.nameText.x = leftEdge + centerOffset;

    // HAND
    this.handIcons.forEach((icon, i) => {
      icon.setVisible(i < data.handSize);
    });
    // DRAW
    this.drawPileIcon.setVisible(data.drawPileSize > 0);

    const textureKey = data.discardTopCard?.name;

    if (textureKey) {
      this.discardImage.setTexture(textureKey);
      this.discardImage.setDisplaySize(this.CARD_WIDTH, this.CARD_HEIGHT);
      this.discardImage.setVisible(true);
    } else {
      this.discardImage.setVisible(false);
    }
  }
}
