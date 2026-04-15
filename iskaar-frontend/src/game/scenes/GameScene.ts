import Phaser from "phaser";
import { HandView } from "../ui/HandView";
import { GameEventBus } from "../events/GameEventBus";
import type { Card } from "../objects/Card";

export class GameScene extends Phaser.Scene {
  private handView!: HandView;

  constructor() {
    super("GameScene");
  }
  create() {
    // 🔥 Background
    const bg = this.add.image(
      this.scale.width / 2,
      this.scale.height / 2,
      "background",
    );
    bg.setDisplaySize(this.scale.width, this.scale.height);

    // 🔥 HandView
    this.handView = new HandView(this);

    // 🔥 Events
    GameEventBus.on("gameView", this.onGameView);
  }

  shutdown() {
    GameEventBus.off("gameView", this.onGameView);
  }

  private onCardPlayed(event: { card: Card }) {
    const card = event.card;

    //Karte aus Hand entfernen
    this.handView.removeCard(card);

    //visuell nach vorne holen
    this.children.bringToTop(card);

    //Animation
    this.tweens.add({
      targets: card,
      x: 640,
      y: 400,
      scale: 1.3,
      rotation: 0,
      duration: 700,
      ease: "Power2",
      onComplete: () => {
        this.time.delayedCall(300, () => {
          card.destroy();
        });
      },
    });
  }

  private onGameView = (event: { view: any }) => {
    const view = event.view;

    console.log("GAME VIEW:", view);

    if (view?.me?.hand) {
      this.handView.setCards(view.me.hand);
    }
  };
}
