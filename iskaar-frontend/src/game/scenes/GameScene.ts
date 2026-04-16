import Phaser from "phaser";
import { HandView } from "../ui/HandView";
import { InPlayViewData } from "../view/InPlayViewData";
import { GameEventBus } from "../events/GameEventBus";
import { GameClient } from "../../core/network/GameClient";
import type { GameViewData } from "../view/GameViewData";
import { OpponentView } from "../ui/OpponentView";
import { OpponentViewData } from "../view/OpponentViewData";

export class GameScene extends Phaser.Scene {
  private gameClient!: GameClient;
  private handView!: HandView;
  private inPlayView!: InPlayViewData;
  private opponentViews: OpponentView[] = [];

  constructor() {
    super("GameScene");
  }

  init(data: { gameClient: GameClient }) {
    this.gameClient = data.gameClient;
  }

  create() {
    // 🔥 Background
    const bg = this.add.image(
      this.scale.width / 2,
      this.scale.height / 2,
      "Background",
    );
    bg.setDisplaySize(this.scale.width, this.scale.height);

    // Views
    this.handView = new HandView(this);
    this.inPlayView = new InPlayViewData(this);

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
  };

  private onGameView = (event: { view: any }) => {
    const view = event.view;

    console.log("GAME VIEW:", view);

    if (view?.me?.hand) {
      this.handView.setCards(view.me.hand);
    }
    const inPlayCards = this.getActiveInPlay(view);
    this.inPlayView.setCards(inPlayCards);

    this.updateOpponents(view);
  };

  private getActiveInPlay(view: GameViewData) {
    if (view.activePlayerId === view.me.playerId) {
      return view.me.inPlay;
    }

    const opponent = view.opponents.find(
      o => o.playerId === view.activePlayerId,
    );

    return opponent?.inPlay ?? [];
  }

  private updateOpponents(view: GameViewData) {
    const baseX = this.scale.width;
    const baseY = 100;
    const spacing = 120;
    const width = 300;

    view.opponents.filter(Boolean).forEach((opponent, index) => {
      const data = this.mapToOpponentViewData(opponent);

      // 👉 CREATE
      if (!this.opponentViews[index]) {
        this.opponentViews[index] = new OpponentView(
          this,
          baseX,
          baseY + index * spacing,
          width,
          data,
        );
      }

      // 👉 UPDATE
      else {
        this.opponentViews[index].update(data);
      }
    });
  }
  private mapToOpponentViewData(opp: any): OpponentViewData {
    return new OpponentViewData(
      opp.playerId,
      opp.playerName,
      opp.drawPileSize,
      opp.handSize,
      opp.inPlay ?? [],
      opp.discardTopCard ?? null,
    );
  }
}
