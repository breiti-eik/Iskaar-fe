import type { SelectionViewData } from "./../view/SelectionViewData";
import Phaser from "phaser";

import { Card } from "../objects/Card";
import type { CardViewData } from "../view/CardViewData";
import { GameEventBus } from "../events/GameEventBus";
import type { CardSelectionViewData } from "../view/CardSelectionViewData";

export class CardSelectionOverlayView extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Rectangle;
  private cards: Card[] = [];

  private cardContainer: Phaser.GameObjects.Container;
  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);
    this.background = scene.add.rectangle(
      0,
      0,
      scene.scale.width,
      scene.scale.height,
      0x000000,
      0.65,
    );
    this.cardContainer = scene.add.container(
      scene.scale.width * 0.5,
      scene.scale.height * 0.55,
    );

    this.background.setOrigin(0);

    this.add([this.background, this.cardContainer]);
    this.bringToTop(this.cardContainer);

    this.scene.add.existing(this);
    this.setDepth(10000);
    this.setVisible(false);
  }

  setCards(cards: CardViewData[]) {
    this.clearCards();

    cards.forEach((cardData, index) => {
      const card = new Card(
        this.scene,
        index * 170,
        0,
        cardData.id,
        cardData.name,
      );

      this.scene.add.existing(card);

      this.cardContainer.add(card);
      this.cards.push(card);
      this.setupInteraction(card);
    });
    this.layoutCards();
  }

  private layoutCards() {
    const spacing = 170;
    const totalWidth = (this.cards.length - 1) * spacing;

    this.cards.forEach((card, index) => {
      card.setPosition(index * spacing - totalWidth * 0.5, 0);
    });
  }

  private setupInteraction(card: Card) {
    card.setInteractive({ useHandCursor: true });

    card.on("pointerdown", () => {
      GameEventBus.emit("cardSelected", {
        cardId: card.id,
      });
    });
  }

  show(cards: SelectionViewData[]) {
    this.setCards(cards.map(card => (card as CardSelectionViewData).card));
    this.setVisible(true);
  }

  hide() {
    this.clearCards();
    this.setVisible(false);
  }

  private clearCards() {
    this.cards.forEach(card => card.destroy());
    this.cards = [];
  }
}
