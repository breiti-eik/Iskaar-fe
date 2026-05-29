import Phaser from "phaser";
import { Card } from "../objects/Card";
import type { CardViewData } from "../view/CardViewData";

export class InPlayView extends Phaser.GameObjects.Container {
  private debugBg!: Phaser.GameObjects.Rectangle;
  private frame!: Phaser.GameObjects.Image;
  private cards: Card[] = [];

  private readonly spacing = 155;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);
    this.scene.add.existing(this);
    this.create();
  }

  create() {
    // 👉 Frame
    this.debugBg = this.scene.add.rectangle(0, 0, 5, 5, 0xaa0000, 0);
    this.frame = this.scene.add.image(0, 0, "Frame");
    this.frame.setOrigin(0.5);
    this.frame.setVisible(false);
    this.frame.setDepth(5);

    this.add([this.frame, this.debugBg]);
  }

  setCards(cards: CardViewData[]) {
    this.clear();

    const total = cards.length;

    cards.forEach((cardData, index) => {
      const x = this.getCardX(index, total);
      const card = new Card(this.scene, x, 0, cardData.id, cardData.name);

      this.add(card);
      this.cards.push(card);
    });

    this.updateLayout();
  }

  updateFrame(active: boolean) {
    this.frame.setPosition(0, 0);
    this.frame.setVisible(true);

    const paddingX = this.scene.scale.width * 0.1;
    const targetWidth = this.scene.scale.width * 0.5 - paddingX;

    const aspectRatio = 0.419;
    const targetHeight = targetWidth * aspectRatio;

    this.frame.setDisplaySize(targetWidth, targetHeight);
    this.debugBg.setDisplaySize(targetWidth, targetHeight);

    if (active) {
      this.frame.setTint(0xfff3cd);
    } else {
      this.frame.clearTint();
    }
  }

  private clear() {
    this.cards.forEach(c => c.destroy());
    this.cards = [];
  }

  private getCardX(index: number, total: number): number {
    const spacing = this.getSpacing(total);
    const totalWidth = (total - 1) * spacing;
    return -totalWidth / 2 + index * spacing;
  }

  private updateLayout() {
    const total = this.cards.length;

    this.cards.forEach((card, index) => {
      const x = this.getCardX(index, total);
      const y = 0;

      this.scene.tweens.add({
        targets: card,
        x,
        y,
        scale: 1,
        rotation: 0,
        duration: 150,
      });
    });
  }

  getBounds(): Phaser.Geom.Rectangle {
    return super.getBounds();
  }

  private getSpacing(total: number): number {
    const maxWidth = this.frame.displayWidth * 0.75;

    if (total <= 1) {
      return this.spacing;
    }

    const neededWidth = (total - 1) * this.spacing;

    if (neededWidth <= maxWidth) {
      return this.spacing;
    }

    return maxWidth / (total - 1);
  }
}
