import Phaser from "phaser";
import { Card } from "../objects/Card";
import { GameEventBus } from "../events/GameEventBus";

export class HandView {
  private scene: Phaser.Scene;
  private cards: Card[] = [];

  private get baseY(): number {
    return this.scene.scale.height - 150;
  }
  private readonly centerX = 1000;
  private readonly spacing = 120;
  private readonly curveStrength = 10;
  private hoveredCard?: Card;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  setCards(cardIds: string[]) {
    this.clear();

    cardIds.forEach((id, index) => {
      const card = new Card(this.scene, 0, 0, id);

      this.setupInteractions(card);
      this.cards.push(card);
    });

    this.updateLayout();
  }

  removeCard(card: Card) {
    this.cards = this.cards.filter(c => c !== card);
    this.updateLayout();
  }

  private getCardX(index: number, total: number): number {
    const totalWidth = (total - 1) * this.spacing;
    return this.centerX - totalWidth / 2 + index * this.spacing;
  }

  private clear() {
    this.cards.forEach(c => c.destroy());
    this.cards = [];
  }

  private setupInteractions(card: Card) {
    card.setInteractive({ useHandCursor: true });

    card.on("pointerover", () => {
      this.hoveredCard = card;
      this.updateLayout();
    });

    card.on("pointerout", () => {
      if (this.hoveredCard === card) {
        this.hoveredCard = undefined;
      }
      this.updateLayout();
    });

    card.on("pointerdown", () => {
      GameEventBus.emit("cardPlayed", {
        card: card,
      });
    });
  }

  private getRotation(index: number, total: number): number {
    if (total <= 1) return 0;
    const mid = (total - 1) / 2;
    const distanceFromCenter = index - mid;

    const maxAngle = 0.25; // ca. 14°
    return (distanceFromCenter / mid) * maxAngle;
  }

  private getCardY(index: number, total: number): number {
    if (total <= 1) return this.baseY;
    const mid = (total - 1) / 2;
    const distanceFromCenter = index - mid;

    return this.baseY + Math.pow(distanceFromCenter, 2) * this.curveStrength;
  }

  private updateLayout() {
    const total = this.cards.length;

    this.cards.forEach((card, index) => {
      const x = this.getCardX(index, total);
      const y = this.getCardY(index, total);
      const rotation = this.getRotation(index, total);

      const isHovered = card === this.hoveredCard;

      this.scene.tweens.add({
        targets: card,
        x,
        y: isHovered ? y - 60 : y,
        scale: isHovered ? 1.1 : 1,
        rotation: isHovered ? 0 : rotation,
        duration: 150,
      });
    });
  }
}
