import Phaser from "phaser";
import { Card } from "../objects/Card";
import { GameEventBus } from "../events/GameEventBus";
import type { CardViewData } from "../view/CardViewData";

export class HandView {
  getCenterX() {
    return this.scene.scale.width / 2;
  }

  getHandViewWidth() {
    return this.handViewWidth;
  }

  private scene: Phaser.Scene;
  private cards: Card[] = [];

  private get baseY(): number {
    return this.scene.scale.height - 150;
  }

  private hoveredCard?: Card;
  private handViewWidth = 400;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  setCards(cards: CardViewData[]) {
    this.clear();

    cards.forEach(cardData => {
      const textureKey = cardData.name;
      const id = cardData.id;

      const card = new Card(this.scene, 0, 0, id, textureKey);

      this.setupInteractions(card);
      this.cards.push(card);
    });

    this.updateLayout();
  }

  removeCard(card: Card) {
    this.cards = this.cards.filter(c => c !== card);
    this.updateLayout();
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
        cardId: card.id,
      });
    });
  }

  private updateLayout() {
    const total = this.cards.length;

    this.cards.forEach((card, index) => {
      const { x, y, rotation } = this.getCardTransform(index, total);

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

  private getCardTransform(index: number, total: number) {
    const centerX = this.getCenterX();
    const baseY = this.baseY;

    if (total === 1) {
      return { x: centerX, y: baseY, rotation: 0 };
    }

    const minWidth = 180; // kleine Hände (2–3 Karten)
    const maxWidth = 400; // 🔥 harte Grenze wegen Kollision

    // normalisieren (wie viele Karten im Verhältnis zu "viel")
    const t = Phaser.Math.Clamp((total - 1) / 12, 0, 1);

    // 🔥 easing → wichtig für gutes Gefühl bei kleinen Händen
    const eased = Math.pow(t, 0.75);

    // finale Breite
    const maxTotalWidth = Phaser.Math.Linear(minWidth, maxWidth, eased);

    // Radius bleibt gleich
    const radius = 500;

    // 🔥 Winkel berechnen basierend auf gewünschter Breite
    const maxSpread = Math.min(
      2 * Math.asin(maxTotalWidth / (2 * radius)),
      1.2, // optionales hartes Limit
    );

    const startAngle = -maxSpread / 2;
    const step = maxSpread / (total - 1);

    const angle = startAngle + index * step;

    const x = centerX + Math.sin(angle) * radius;
    const y = baseY - Math.cos(angle) * radius + radius;

    return {
      x,
      y,
      rotation: angle * 0.8, // Karten folgen dem Bogen
    };
  }
}
