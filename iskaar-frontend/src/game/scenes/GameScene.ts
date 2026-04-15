import Phaser from "phaser";
import { HandView } from "../ui/HandView";
import { InPlayView } from "../view/InPlayView";
import { GameEventBus } from "../events/GameEventBus";
import { GameClient } from "../../core/network/GameClient";
import type { GameView } from "../view/GameView";

export class GameScene extends Phaser.Scene {
  private gameClient!: GameClient;
  private handView!: HandView;
  private inPlayView!: InPlayView;

  constructor() {
    super("GameScene");
  }

  init(data: { gameClient: GameClient }) {
    this.gameClient = data.gameClient;
  }

  create() {
    // 🔥 Background
    console.log("GameScene created", this);
    const bg = this.add.image(
      this.scale.width / 2,
      this.scale.height / 2,
      "background",
    );
    bg.setDisplaySize(this.scale.width, this.scale.height);

    // Views
    this.handView = new HandView(this);
    this.inPlayView = new InPlayView(this);

    // 🔥 Events
    GameEventBus.on("gameView", this.onGameView);
    GameEventBus.on("cardPlayed", this.onCardPlayed);
  }

  shutdown() {
    GameEventBus.off("gameView", this.onGameView);
    GameEventBus.off("cardPlayed", this.onCardPlayed);
  }

  private onCardPlayed = (event: { cardId: string }) => {
    console.log("Play card:", event.cardId);

    this.gameClient.playCard(
      "11111111-1111-1111-1111-111111111111",
      event.cardId,
    );
    /* 
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
    }); */
  };

  private onGameView = (event: { view: any }) => {
    const view = event.view;

    console.log("GAME VIEW:", view);

    if (view?.me?.hand) {
      this.handView.setCards(view.me.hand);
      if (view.activePlayerId === view.me.playerId) {
        this.inPlayView.setCards(view.me.inPlay);
      } else {
        this.inPlayView.setCards(view.opponents[0].inPlay);
      }
    }
  };

  private getActiveInPlay(view: GameView) {
    if (view.activePlayerId === view.me.playerId) {
      return view.me.inPlay;
    }

    const opponent = view.opponents.find(
      o => o.playerId === view.activePlayerId,
    );

    return opponent?.inPlay ?? [];
  }
}
