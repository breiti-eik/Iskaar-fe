import { ServerMessage } from "./ServerMessage";
import { GameViewData } from "../../game/view/GameViewData";
import { MeViewData } from "../../game/view/MeViewData";
import { OpponentViewData } from "../../game/view/OpponentViewData";

export class GameViewMessage extends ServerMessage {
  readonly type = "GAME_VIEW";
  view: GameViewData;

  constructor(raw: any) {
    super();
    this.view = this.map(raw);
  }

  private map(raw: any): GameViewData {
    return new GameViewData(
      raw.gameId,

      // 🔵 ME
      new MeViewData(
        raw.me.playerId,
        raw.me.playerName,
        raw.me.drawPileSize,
        raw.me.persistentCards ?? [],
        raw.me.hand ?? [],
        raw.me.inPlay ?? [],
        raw.me.discard ?? [],
      ),

      // 🟡 OPPONENTS
      (raw.opponents ?? []).map(
        (o: any) =>
          new OpponentViewData(
            o.playerId,
            o.playerName,
            o.drawPileSize,
            o.handSize,
            o.inPlay ?? [],
            o.discardTopCard ?? null,
          ),
      ),

      // 🟣 ACTIVE PLAYER
      raw.activePlayerId,

      // 🟠 TURN
      {
        phase: raw.turn?.phase ?? "",
        allowedActions: raw.turn?.allowedActions ?? [],
      },

      // 🔴 ACCOUNT
      {
        action: raw.account?.action ?? 0,
        budget: raw.account?.budget ?? 0,
        buy: raw.account?.buy ?? 0,
        moneyAction: raw.account?.moneyAction ?? 0,
      },
    );
  }
}
