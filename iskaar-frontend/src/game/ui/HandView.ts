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

    const total = cards.length;

    cards.forEach((cardData, index) => {
      const textureKey = cardData.name;
      const id = cardData.id;

      // 👉 Zielposition vorher berechnen
      const { x, y, rotation } = this.getCardTransform(index, total);

      // 👉 NICHT mehr (0,0)!
      const card = new Card(this.scene, x, y, id, textureKey);
      card.setRotation(rotation);

      this.setupInteractions(card);
      this.cards.push(card);
    });

    // 👉 WICHTIG: erstes Layout ohne Animation
    this.updateLayout(false);
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

  private updateLayout(animated: boolean = true) {
    const total = this.cards.length;

    this.cards.forEach((card, index) => {
      const { x, y, rotation } = this.getCardTransform(index, total);
      const isHovered = card === this.hoveredCard;

      if (!animated) {
        // 👉 direkt setzen (kein Flug!)
        card.setPosition(x, isHovered ? y - 60 : y);
        card.setScale(isHovered ? 1.1 : 1);
        card.setRotation(isHovered ? 0 : rotation);
        return;
      }

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
    const microWidth = 90;
    const minWidth = 110;
    const midWidth = 260;
    const maxWidth = 400;

    let maxTotalWidth: number;
    if (total == 2) {
      // Phase 1: klein → mittel
      const t = Phaser.Math.Clamp((total - 1) / 3, 0, 1);
      const eased = Math.pow(t, 0.75);
      maxTotalWidth = Phaser.Math.Linear(microWidth, minWidth, eased);
    } else if (total <= 4) {
      // Phase 1: klein → mittel
      const t = Phaser.Math.Clamp((total - 1) / 3, 0, 1);
      const eased = Math.pow(t, 0.75);
      maxTotalWidth = Phaser.Math.Linear(minWidth, midWidth, eased);
    } else {
      // Phase 2: mittel → groß
      const t = Phaser.Math.Clamp((total - 4) / 8, 0, 1);
      const eased = Math.pow(t, 0.9); // etwas flacher
      maxTotalWidth = Phaser.Math.Linear(midWidth, maxWidth, eased);
    }

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
