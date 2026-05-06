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
import { PermanentView } from "../ui/PermanentView";

export class GameScene extends Phaser.Scene {
  private gameClient!: GameClient;
  private marketView!: MarketView;
  private handView!: HandView;
  private permanentView!: PermanentView;
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
    // Views
    this.marketView = new MarketView(this);

    this.drawPileView = new StackView(this, 0.8, true, false, true);
    this.handView = new HandView(this);
    this.permanentView = new PermanentView(this);
    this.discardPileView = new StackView(this, 0.8, false, true);
    this.inPlayView = new InPlayView(this);
    this.tableauView = new TableauView(this);
    this.actionView = new ActionView(this);
    this.accountView = new AccountView(this);
    this.resourceView = new RessourceView(this);
    this.graveyardView = new GraveyardView(this);

    // 🔥 Events
    GameEventBus.on("gameView", this.onGameView);
    GameEventBus.on("cardPlayed", this.onCardPlayed);
    GameEventBus.on("playerAction", this.sendActionToBackend);
    GameEventBus.on("buyCard", this.onBuyCard);
    if (this.isMock) {
      this.emitMockGameView();
    }
    this.layoutUI();
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
    const { tableau } = me;
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
    if (tableau) {
      this.tableauView.setTableauData(tableau);
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

    this.actionView.updateActionView(this.inPlayView.getBounds(), view.turn);

    this.accountView.show();

    this.updateOpponents(view);
    const tableauWidth = this.scale.width * 0.18;
    this.tableauView.updateLayout(tableauWidth);
    this.layoutUI();
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
    this.drawPileView.setCount(size);
  }

  private updateDiscardPile(cards: { name: string }[]) {
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

  private emitMockGameView() {
    const message = MessageFactory.fromJson(mock) as GameViewMessage; // oder .create / .parse (je nach API)
    GameEventBus.emit("gameView", message.view);
  }

  private layoutUI() {
    const w = this.scale.width;
    const h = this.scale.height;

    // =========================
    // 🔴 TOP ZONE (FIXED)
    // =========================
    const topYOffset = -30;
    const topY = h * 0.045 + topYOffset;

    // 👉 Ressource weiter links + höher
    this.resourceView.setPosition(w * 0.02, topY);

    // 👉 Market höher + weiter rechts
    this.marketView.setPosition(w * 0.45, topY);

    // =========================
    // 🟢 LEFT SIDE (FIXED)
    // =========================
    const leftX = w * 0.032; // weiter links

    // 👉 Tableau deutlich tiefer + links
    this.tableauView.setPosition(leftX, h * 0.98);

    // =========================
    // 🟣 CENTER PUBLIC ZONE
    // =========================
    const centerX = w * 0.5;
    const inPlayY = h * 0.48;

    this.inPlayView.setPosition(centerX, inPlayY);

    // 👉 Account sauber links außerhalb (mehr Abstand)
    const accountOffset = w * 0.22;
    this.accountView.setPosition(centerX - accountOffset, inPlayY);

    // =========================
    // 🟡 PLAYER BOTTOM ZONE
    // =========================
    const bottomY = h * 0.85;

    this.handView.setPosition(centerX, bottomY);

    const offset = this.handView.getHandViewWidth();

    const drawX = centerX - offset;
    const discardX = centerX + offset;

    this.drawPileView.setPosition(drawX, bottomY);
    this.discardPileView.setPosition(discardX, bottomY);

    // =========================
    // ⚙️ ACTION ROW
    // =========================

    const inPlayBounds = this.inPlayView.getBounds();

    const actionRowGap = 20;

    const actionRowY = inPlayBounds.bottom + actionRowGap;

    const actionRowWidth = w * 0.4;

    const permanentWidth = actionRowWidth * 0.2;
    const actionWidth = actionRowWidth * 0.6;

    const rowStartX = centerX - actionRowWidth / 2;

    this.permanentView.setPosition(rowStartX + permanentWidth / 2, actionRowY);

    this.actionView.setPosition(
      rowStartX + permanentWidth + actionWidth / 2,
      actionRowY,
    );

    // =========================
    // 🟠 RIGHT BOTTOM
    // =========================
    this.graveyardView.setPosition(w * 0.92, bottomY);
  }
}
