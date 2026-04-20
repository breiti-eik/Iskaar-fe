import Phaser from "phaser";
import { Card } from "../objects/Card";
import type { CardViewData } from "../view/CardViewData";

export class InPlayView {
  private container: Phaser.GameObjects.Container;
  private scene: Phaser.Scene;
  private cards: Card[] = [];

  private readonly spacing = 140;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.container = this.scene.add.container(
      this.scene.scale.width / 2,
      this.scene.scale.height / 2,
    );
  }

  setCards(cards: CardViewData[]) {
    this.clear();

    cards.forEach(cardData => {
      const card = new Card(this.scene, 0, 0, cardData.id, cardData.name);

      this.container.add(card);
      this.cards.push(card);
    });

    this.updateLayout();
  }

  private clear() {
    this.cards.forEach(c => c.destroy());
    this.cards = [];
  }

  private getCardX(index: number, total: number): number {
    const totalWidth = (total - 1) * this.spacing;
    return -totalWidth / 2 + index * this.spacing;
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
    return this.container.getBounds();
  }
}
