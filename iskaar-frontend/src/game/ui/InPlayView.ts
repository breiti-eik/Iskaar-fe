import Phaser from "phaser";
import { Card } from "../objects/Card";
import type { CardViewData } from "../view/CardViewData";

export class InPlayView {
  private container: Phaser.GameObjects.Container;
  private scene: Phaser.Scene;
  private frame!: Phaser.GameObjects.Image;
  private cards: Card[] = [];

  private readonly spacing = 155;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.container = this.scene.add.container(
      this.scene.scale.width / 2,
      this.scene.scale.height / 2,
    );
    this.frame = this.scene.add.image(0, 0, "Frame");
    this.frame.setOrigin(0.5);

    // wichtig: in Container!
    this.container.add(this.frame);

    // initial sichtbar (wie bei dir später sowieso)
    this.frame.setVisible(false);

    // Depth wie vorher
    this.frame.setDepth(5);
  }

  setCards(cards: CardViewData[]) {
    this.clear();

    const total = cards.length;

    cards.forEach((cardData, index) => {
      const x = this.getCardX(index, total);
      const card = new Card(this.scene, x, 0, cardData.id, cardData.name);

      this.container.add(card);
      this.cards.push(card);
    });

    this.updateLayout();
  }

  updateFrame(active: boolean) {
    const bounds = this.getBounds();

    let x: number;
    let y: number;

    if (bounds.width === 0 || bounds.height === 0) {
      x = this.scene.scale.width / 2;
      y = this.scene.scale.height / 2;
    } else {
      x = bounds.centerX;
      y = bounds.centerY;
    }

    this.frame.setPosition(x - this.container.x, y - this.container.y);

    this.frame.setVisible(true);

    const paddingX = this.scene.scale.width * 0.1;
    const targetWidth = this.scene.scale.width * 0.5 - paddingX;

    const aspectRatio = 0.419;
    const targetHeight = targetWidth * aspectRatio;

    this.frame.setDisplaySize(targetWidth, targetHeight);

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
