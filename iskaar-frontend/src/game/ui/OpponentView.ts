import Phaser from "phaser";
import type { OpponentViewData } from "../view/OpponentViewData";
import { Card } from "../objects/Card";

export class OpponentView {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;

  private hiddenX: number;
  private visibleX: number;

  private expanded = false;

  private nameText!: Phaser.GameObjects.Text;

  private handIcons: Phaser.GameObjects.Image[] = [];
  private drawPileIcon!: Phaser.GameObjects.Image;
  private discardImage!: Phaser.GameObjects.Image;

  private cardAreaContainer!: Phaser.GameObjects.Container;

  private readonly WIDTH = 455;
  private readonly HEIGHT = 110;

  private readonly CARD_WIDTH = 40;
  private readonly CARD_HEIGHT = 60;

  private readonly DEV_MOCK_DISCARD = true;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    data: OpponentViewData,
  ) {
    this.scene = scene;

    this.visibleX = x;
    this.hiddenX = x + width + 20;

    this.container = scene.add.container(this.hiddenX, y);

    this.buildBase();
    this.buildInteraction();

    this.update(data);
  }

  private buildBase(): void {
    const bg = this.scene.add
      .image(0, 0, "OpponentBarBg")
      .setOrigin(1, 0.5)
      .setDisplaySize(this.WIDTH, this.HEIGHT);

    // NAME (links sichtbar im collapsed state)
    this.nameText = this.scene.add
      .text(-this.WIDTH + 20, 5, "", {
        fontSize: "20px",
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

    this.container.add([bg, this.nameText, this.cardAreaContainer]);
  }

  private buildInteraction(): void {
    const hit = this.scene.add
      .rectangle(0, 0, this.WIDTH, this.HEIGHT)
      .setOrigin(1, 0.5)
      .setInteractive({ useHandCursor: true });

    this.container.add(hit);

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
      targets: this.container,
      x: this.visibleX,
      duration: 180,
      ease: "Power2",
    });
  }

  private collapse(lock = false): void {
    if (this.expanded && !lock) return;

    this.scene.tweens.add({
      targets: this.container,
      x: this.hiddenX,
      duration: 180,
      ease: "Power2",
    });
  }

  update(data: OpponentViewData): void {
    if (!data) return;

    // NAME
    this.nameText.setText(data.playerName);

    // HAND
    this.handIcons.forEach((icon, i) => {
      icon.setVisible(i < data.handSize);
    });
    // DRAW
    this.drawPileIcon.setVisible(data.drawPileSize > 0);

    // 🔥 DISCARD mit Flag
    let discardCard: Card | null = data.discardTopCard;

    const textureKey =
      data.discardTopCard?.textureKey ??
      (this.DEV_MOCK_DISCARD ? "Knut" : null);

    if (textureKey) {
      this.discardImage.setTexture(textureKey);
      this.discardImage.setDisplaySize(this.CARD_WIDTH, this.CARD_HEIGHT);
      this.discardImage.setVisible(true);
    } else {
      this.discardImage.setVisible(false);
    }
  }
}
