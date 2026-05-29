import { Card } from "../objects/Card";
import type { CardViewData } from "../view/CardViewData";

export class PermanentView extends Phaser.GameObjects.Container {
  private debugBg!: Phaser.GameObjects.Rectangle;
  private cards: Card[] = [];

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);
    this.scene.add.existing(this);
    this.debugBg = this.scene.add.rectangle(0, 0, 100, 100, 0x225522, 0);
    this.add(this.debugBg);
  }

  setCards(cards: CardViewData[]) {
    this.clear();

    const total = cards.length;

    cards.forEach((cardData, index) => {
      const x = 0;
      const card = new Card(this.scene, x, 0, cardData.id, cardData.name);
      card.setScale(0.45);
      card.setPosition(this.getCardX(index, total, card.displayWidth), 0);
      this.add(card);
      this.cards.push(card);
    });
  }

  private getCardX(index: number, total: number, cardWidth: number): number {
    const spacing = this.getSpacing(total, cardWidth);

    return index * spacing;
  }

  private clear() {
    this.cards.forEach(c => c.destroy());
    this.cards = [];
  }

  private getSpacing(total: number, cardWidth: number): number {
    const maxWidth = this.debugBg.displayWidth * 0.75;
    const gap = 2;

    if (total <= 1) {
      return cardWidth + gap;
    }

    const neededWidth = (total - 1) * cardWidth;

    if (neededWidth <= maxWidth) {
      return cardWidth + gap;
    }

    return maxWidth / (total - 1) + gap;
  }
}
