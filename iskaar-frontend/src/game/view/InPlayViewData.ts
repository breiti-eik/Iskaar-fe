import Phaser from "phaser";
import { Card } from "../objects/Card";
import type { CardViewData } from "./CardViewData";

export class InPlayViewData {
  private scene: Phaser.Scene;
  private cards: Card[] = [];

  private readonly centerX = 1000;
  private readonly spacing = 140;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  setCards(cards: CardViewData[]) {
    this.clear();

    cards.forEach(cardData => {
      const card = new Card(this.scene, 0, 0, cardData.id, cardData.name);

      this.cards.push(card);
    });

    this.updateLayout();
  }

  private clear() {
    this.cards.forEach(c => c.destroy());
    this.cards = [];
  }

  private get baseY(): number {
    return this.scene.scale.height / 2; // 👈 Mitte!
  }

  private getCardX(index: number, total: number): number {
    const totalWidth = (total - 1) * this.spacing;
    return this.centerX - totalWidth / 2 + index * this.spacing;
  }

  private updateLayout() {
    const total = this.cards.length;

    this.cards.forEach((card, index) => {
      const x = this.getCardX(index, total);
      const y = this.baseY;

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
}
