import Phaser from "phaser";
import { HandView } from "../ui/HandView";
import { GameEventBus } from "../events/GameEventBus";
import type { Card } from "../objects/Card";
import { GameClient } from "../../core/network/GameClient";

export class GameScene extends Phaser.Scene {
  private handView!: HandView;
  private gameClient!: GameClient;

  private gameId: string = "11111111-1111-1111-1111-111111111111"; // MOCK später dynamisch!

  constructor() {
    super("GameScene");
  }

  create() {
    // 🔥 GameClient initialisieren
    this.gameClient = new GameClient();
    this.gameClient.connect(this.gameId, () => {
      // 🔥 JETZT erst joinen
      this.gameClient.joinGame(this.gameId, "Player1");
    });

    // 🔥 Background
    const bg = this.add.image(
      this.scale.width / 2,
      this.scale.height / 2,
      "background",
    );
    bg.setDisplaySize(this.scale.width, this.scale.height);

    // 🔥 HandView
    this.handView = new HandView(this);

    // 🔥 Server → View
    GameEventBus.on("GAME_STATE", this.onGameState);

    GameEventBus.on("cardPlayed", event => this.onCardPlayed(event));
  }

  shutdown() {
    GameEventBus.off("GAME_STATE", this.onGameState);
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

  private onGameState = (view: any) => {
    console.log("GameView update", {
      hand: view?.me?.hand?.length,
      opponents: view?.opponents?.length,
    });

    // 👉 später sauber typisieren!
    if (view?.me?.hand) {
      this.handView.setCards(view.me.hand);
    }
  };
}
