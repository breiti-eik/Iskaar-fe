import Phaser from "phaser";
import { HandView } from "../ui/HandView";
import { InPlayView } from "../ui/InPlayView";
import { GameEventBus } from "../events/GameEventBus";
import { GameClient } from "../../core/network/GameClient";
import type { GameViewData } from "../view/GameViewData";
import { OpponentView } from "../ui/OpponentView";
import { StackView } from "../ui/StatckView";
import { MOCK_GAME_VIEW } from "../../core/mock/MockGameData";

export class GameScene extends Phaser.Scene {
  private gameClient!: GameClient;
  private handView!: HandView;
  private inPlayView!: InPlayView;
  private activeFrame!: Phaser.GameObjects.Image;
  private opponentViews: OpponentView[] = [];
  private drawPileView!: StackView;
  private discardPileView!: StackView;
  private isMock = import.meta.env.VITE_USE_MOCK === "true";

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

    this.activeFrame = this.add.image(0, 0, "Frame");

    this.activeFrame.setOrigin(0.5);
    this.activeFrame.setDisplaySize(
      this.scale.width * 0.5,
      this.scale.height * 0.35,
    );

    this.activeFrame.setDepth(5);
    this.activeFrame.setVisible(false);

    // Views
    this.drawPileView = new StackView(this, 0.6);
    this.handView = new HandView(this);
    this.discardPileView = new StackView(this, 0.6, false, true);
    this.inPlayView = new InPlayView(this);

    // 🔥 Events
    GameEventBus.on("gameView", this.onGameView);
    GameEventBus.on("cardPlayed", this.onCardPlayed);
    if (this.isMock) {
      this.emitMockGameView();
    }
  }

  shutdown() {
    GameEventBus.off("gameView", this.onGameView);
    GameEventBus.off("cardPlayed", this.onCardPlayed);
  }

  private onCardPlayed = (event: { cardId: string }) => {
    this.gameClient.playCard(
      "11111111-1111-1111-1111-111111111111",
      event.cardId,
    );
    console.log("Click card:", event.cardId);
  };

  private onGameView = (event: GameViewData) => {
    const view = event;
    console.log("View: ", view);

    if (!view.turn.phase) {
      return;
    }

    if (!view?.me) {
      console.warn("Invalid GameViewData", event);
      return;
    }
    const { me } = view;

    if (me.drawPileSize !== undefined) {
      this.updateDrawPile(view.me.drawPileSize);
    }

    if (me.discard) {
      this.updateDiscardPile(me.discard);
    }
    if (me.hand) {
      this.handView.setCards(me.hand);
    }
    const inPlayCards = this.getActiveInPlay(view);
    this.inPlayView.setCards(inPlayCards);
    const isActive = me.playerId === view.activePlayerId;
    this.updateActiveFrame(isActive);

    this.updateOpponents(view);
    console.log(this.activeFrame.width, this.activeFrame.height);
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

  private updateActiveFrame(active: boolean) {
    const bounds = this.inPlayView.getBounds();

    let x: number;
    let y: number;

    if (bounds.width === 0 || bounds.height === 0) {
      x = this.scale.width / 2;
      y = this.scale.height / 2;
    } else {
      x = bounds.centerX;
      y = bounds.centerY;
    }

    this.activeFrame.setPosition(x, y);
    this.activeFrame.setVisible(true);

    const paddingX = this.scale.width * 0.1;
    const targetWidth = this.scale.width * 0.5 - paddingX;

    const aspectRatio = 0.419; //RATIO bei 1050x440
    const targetHeight = targetWidth * aspectRatio;

    this.activeFrame.setDisplaySize(targetWidth, targetHeight);

    if (active) {
      this.activeFrame.setTint(0xfff3cd);
    } else {
      this.activeFrame.clearTint();
    }
  }

  private updateDrawPile(size: number) {
    const offsetX = -this.handView.getHandViewWidth();

    const x = this.handView.getCenterX() + offsetX;
    const y = this.scale.height - 110;

    this.drawPileView.setPosition(x, y);
    this.drawPileView.setCount(size);
  }

  private updateDiscardPile(cards: { name: string }[]) {
    const offsetX = this.handView.getHandViewWidth(); // 👉 rechts vom Fächer

    const x = this.getCenterX() + offsetX;
    const y = this.scale.height - 120;
    this.discardPileView.setPosition(x, y);
    // ✅ echte Daten
    if (cards && cards.length > 0) {
      console.log("REAL DISCARD", cards);
      this.discardPileView.setCards(cards);
      return;
    }
    // ✅ leer
    this.discardPileView.setCards([]);
  }

  private updateOpponents(view: GameViewData) {
    const baseX = this.scale.width;
    const baseY = 100;
    const spacing = 120;
    const width = 320;

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

  private emitMockGameView() {
    GameEventBus.emit("gameView", MOCK_GAME_VIEW.view);
  }

  private isActivePlayer(playerId: string, view: GameViewData): boolean {
    return playerId === view.activePlayerId;
  }
}
