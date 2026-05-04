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
import { GraveyardView } from "../ui/GraveyardView";

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
  private graveyardView!: GraveyardView;
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
    this.drawPileView = new StackView(this, 0.8, false, false);
    this.handView = new HandView(this);

    // 👉 Hand zentral unten
    this.handView.setPosition(w * 0.5, h - 150);
    this.discardPileView = new StackView(this, 0.8, false, true);
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

    this.graveyardView = new GraveyardView(this);

    this.graveyardView.setPosition(
      this.scale.width * 0.9,
      this.scale.height * 0.85,
    );

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
    const { ressources } = view.board;
    const { market } = view.board;
    const { graveyard } = view.board;

    if (market) {
      this.marketView.setMarket(market.getSupplies(), w * 0.5);
    }

    if (ressources) {
      this.resourceView.setBoard(ressources, w * 0.18);
    }
    if (view.account) {
      this.accountView.setAccount(view.account);
    }
    if (me.drawPileSize !== undefined) {
      this.updateDrawPile(me.drawPileSize);
    }

    if (me.hand) {
      this.handView.setCards(me.hand);
    }
    if (me.discard) {
      this.updateDiscardPile(me.discard);
    }
    if (graveyard) {
      this.graveyardView.setCards(graveyard);
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
    const centerX = this.getHandCenterX();
    const offset = this.handView.getHandViewWidth();

    const x = centerX - offset;
    const y = this.scale.height * 0.85;

    this.drawPileView.setPosition(x, y);
    this.drawPileView.setCount(size);
  }

  private updateDiscardPile(cards: { name: string }[]) {
    const centerX = this.getHandCenterX();
    const offset = this.handView.getHandViewWidth();

    const x = centerX + offset;
    const y = this.scale.height * 0.85;

    this.discardPileView.setPosition(x, y);

    this.discardPileView.setCards(cards ?? []);
  }

  private updateOpponents(view: GameViewData) {
    const w = this.scale.width;
    const h = this.scale.height;

    const baseX = w; // ❗ NICHT ANFASSEN (wichtig für slide)

    const baseY = h * 0.12;
    const spacing = h * 0.14;

    const width = 320; // ❗ NICHT ANFASSEN

    view.opponents.filter(Boolean).forEach((opponentData, index) => {
      if (!this.opponentViews[index]) {
        this.opponentViews[index] = new OpponentView(
          this,
          baseX,
          baseY + index * spacing,
          width,
          opponentData,
        );
      } else {
        // 👉 NEU: Position updaten (wichtig bei resize / responsive)
        this.opponentViews[index].setY(baseY + index * spacing);
        this.opponentViews[index].update(opponentData);
      }
    });
  }

  private getHandCenterX() {
    return this.scale.width * 0.5;
  }

  private updateTableauLayout() {
    const leftMargin = 40; // vorher 20 → mehr Luft
    const gapToDrawPile = 30; // NEU: Abstand zum Stack

    // 👉 rechte Grenze = DrawPile
    const drawPileX = this.drawPileView.x;

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
