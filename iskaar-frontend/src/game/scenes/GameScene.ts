import Phaser from "phaser";
import { HandView } from "../ui/HandView";
import { InPlayViewData } from "../view/InPlayViewData";
import { GameEventBus } from "../events/GameEventBus";
import { GameClient } from "../../core/network/GameClient";
import type { GameViewData } from "../view/GameViewData";
import { OpponentView } from "../ui/OpponentView";
import { StackView } from "../ui/StatckView";

export class GameScene extends Phaser.Scene {
  private gameClient!: GameClient;
  private handView!: HandView;
  private inPlayView!: InPlayViewData;
  private opponentViews: OpponentView[] = [];
  private drawPileView!: StackView;
  private discardPileView!: StackView;
  private readonly DEV_MOCK_DISCARD = true;

  getCenterX() {
    return this.scale.width / 2;
  }

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
    this.drawPileView = new StackView(this, 0.6);
    this.handView = new HandView(this);
    this.discardPileView = new StackView(this, 0.6, false);
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

  private onGameView = (event: { view: GameViewData }) => {
    const view = event.view;

    console.log("GAME VIEW:", view);

    if (view?.me?.drawPileSize !== undefined) {
      this.updateDrawPile(view.me.drawPileSize);
    }

    if (view?.me?.hand) {
      this.handView.setCards(view.me.hand);
    }
    if (view?.me?.discard) {
      this.updateDiscardPile(
        view?.me?.discard as unknown as { texture: string }[],
      );
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

  private updateDrawPile(size: number) {
    const offsetX = -350;

    const x = this.handView.getCenterX() + offsetX;
    const y = this.scale.height - 110;

    this.drawPileView.setPosition(x, y);
    this.drawPileView.setCount(size);
  }

  private updateDiscardPile(cards: { texture: string }[]) {
    const offsetX = 350; // 👉 rechts vom Fächer

    const x = this.getCenterX() + offsetX;
    const y = this.scale.height - 120;
    this.discardPileView.setPosition(x, y);
    // ✅ echte Daten
    if (cards && cards.length > 0) {
      console.log("REAL DISCARD", cards);
      this.discardPileView.setCards(cards);
      return;
    }

    // ✅ DEV Mock
    if (this.DEV_MOCK_DISCARD) {
      console.log("MOCK DISCARD");
      this.discardPileView.setCards([{ texture: "Knut" }]);
      return;
    }
    console.log("NIX");

    // ✅ leer
    this.discardPileView.setCards([]);
  }

  private updateOpponents(view: GameViewData) {
    const baseX = this.scale.width;
    const baseY = 100;
    const spacing = 120;
    const width = 300;

    view.opponents.filter(Boolean).forEach((opponentData, index) => {
      if (!this.opponentViews[index]) {
        this.opponentViews[index] = new OpponentView(
          this,
          baseX,
          baseY + index * spacing,
          width,
          opponentData,
        );
      }
      // 👉 UPDATE
      else {
        this.opponentViews[index].update(opponentData);
      }
    });
  }
}
