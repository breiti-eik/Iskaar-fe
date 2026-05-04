import Phaser from "phaser";
import { HandView } from "../ui/HandView";
import { InPlayView } from "../ui/InPlayView";
import { GameEventBus } from "../events/GameEventBus";
import { GameClient } from "../../core/network/GameClient";
import type { GameViewData } from "../view/GameViewData";
import { OpponentView } from "../ui/OpponentView";
import { StackView } from "../ui/StackView";
import mock from "../../core/mock/mock-game-view.json";
import { MessageFactory } from "../../core/message/MessageFactory";
import { ActionView } from "../ui/ActionView";
import { AccountView } from "../ui/AccountView";
import type { ActionType } from "../objects/Actions";
import { RessourceView } from "../ui/RessourceView";
import { MarketView } from "../ui/MarketView";
import { GameViewMessage } from "../../core/message/GameViewMessage";
import { TableauView } from "../ui/TableauView";

export class GameScene extends Phaser.Scene {
  private gameClient!: GameClient;
  private marketView!: MarketView;
  private handView!: HandView;
  private inPlayView!: InPlayView;
  private actionView!: ActionView;
  private accountView!: AccountView;
  private resourceView!: RessourceView;
  private opponentViews: OpponentView[] = [];
  private drawPileView!: StackView;
  private discardPileView!: StackView;
  private tableauView!: TableauView;
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

    const w = this.scale.width;
    const h = this.scale.height;

    // Views
    this.marketView = new MarketView(this);
    this.marketView.setPosition(w * 0.45, h * 0.08);
    this.drawPileView = new StackView(this, 0.8);
    this.handView = new HandView(this);

    // 👉 Hand zentral unten
    this.handView.setPosition(w * 0.5, h - 150);
    this.discardPileView = new StackView(this, 0.6, false, true);
    this.inPlayView = new InPlayView(this);
    this.inPlayView.setPosition(
      this.scale.width * 0.5,
      this.scale.height * 0.5,
    );
    this.inPlayView.create();
    this.tableauView = new TableauView(this);
    this.actionView = new ActionView(this);
    this.actionView.create();
    this.accountView = new AccountView(this);
    this.accountView.create();

    this.resourceView = new RessourceView(this);
    this.resourceView.setPosition(w * 0.02, h * 0.02);

    // 🔥 Events
    GameEventBus.on("gameView", this.onGameView);
    GameEventBus.on("cardPlayed", this.onCardPlayed);
    GameEventBus.on("playerAction", this.sendActionToBackend);
    GameEventBus.on("buyCard", this.onBuyCard);
    if (this.isMock) {
      this.emitMockGameView();
    }
  }

  shutdown() {
    GameEventBus.off("gameView", this.onGameView);
    GameEventBus.off("cardPlayed", this.onCardPlayed);
  }

  private onBuyCard = (event: {
    pileName: string;
    buyerId: string | undefined;
  }) => {
    console.log(
      "Buy card from pile:",
      event.pileName,
      "by buyer:",
      event.buyerId,
    );
    this.gameClient.buyFromPileforMe(event.pileName, event.buyerId);
  };

  private sendActionToBackend = (event: ActionType) => {
    this.gameClient.sendAction(event);
  };

  private onCardPlayed = (event: { cardId: string }) => {
    this.gameClient.playCard(event.cardId);
    console.log("Click card:", event.cardId);
  };

  private onGameView = (event: GameViewData) => {
    const view = event;
    console.log("View: ", view);

    const w = this.scale.width;

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
    if (view.account) {
      this.accountView.setAccount(view.account);
    }
    if (view.board) {
      this.resourceView.setBoard(view.board, w * 0.18);
    }
    if (view.board?.market) {
      const { market } = view.board;
      this.marketView.setMarket(market.getSupplies(), w * 0.5);
    }

    const inPlayCards = this.getActiveInPlay(view);
    this.inPlayView.setCards(inPlayCards);
    const isActive = me.playerId === view.activePlayerId;
    this.inPlayView.updateFrame(isActive);

    const bounds = this.inPlayView.getBounds();

    // ActionView bleibt wie gehabt (ist OK so)
    this.actionView.updateActionView(bounds, view.turn);

    // 👉 AccountView Layout jetzt HIER (GameScene!)
    const gapToFrame = 30;
    const offsetX = bounds.width / 2 + gapToFrame;

    this.accountView.setPosition(bounds.centerX - offsetX, bounds.centerY);
    this.accountView.show();
    this.updateOpponents(view);
    this.updateTableauLayout();
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
    const offsetX = -this.handView.getHandViewWidth();

    const x = this.scale.width * 0.5 + offsetX;
    const y = this.scale.height - 110;

    this.drawPileView.setPosition(x, y);
    this.drawPileView.setCount(size);
  }

  private updateDiscardPile(cards: { name: string }[]) {
    const offsetX = this.handView.getHandViewWidth(); // 👉 rechts vom Fächer

    const x = this.scale.width * 0.5 + offsetX;
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

  private updateTableauLayout() {
    const leftMargin = 40; // vorher 20 → mehr Luft
    const gapToDrawPile = 30; // NEU: Abstand zum Stack

    // 👉 rechte Grenze = DrawPile
    const drawPileX = this.drawPileView.getWorldX();

    const availableWidth = drawPileX - leftMargin - gapToDrawPile; // NEU: Abstand links + Abstand zum DrawPile + Abstand rechts

    // 👉 Höhe begrenzen (nicht zu hoch)
    const scaleFactor = 0.7; // 🔥 30% kleiner

    const adjustedWidth = availableWidth * scaleFactor;
    const maxHeight = this.scale.height * 0.5 * scaleFactor;

    this.tableauView.create(leftMargin, this.scale.height - 20);

    this.tableauView.updateLayout(adjustedWidth);
  }

  private emitMockGameView() {
    const message = MessageFactory.fromJson(mock) as GameViewMessage; // oder .create / .parse (je nach API)
    GameEventBus.emit("gameView", message.view);
  }
}
