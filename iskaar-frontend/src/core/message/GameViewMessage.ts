import { ServerMessage } from "./ServerMessage";
import { GameViewData } from "../../game/view/GameViewData";
import { BoardViewData } from "../../game/view/BoardViewData";
import { MeViewData } from "../../game/view/MeViewData";
import { OpponentViewData } from "../../game/view/OpponentViewData";
import { AccountViewData } from "../../game/view/AccountViewData";
import { SupplyViewData } from "../../game/view/SupplyViewData";

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
      new BoardViewData(
        new SupplyViewData(
          raw.board?.knutSupply?.topCard ?? null,
          raw.board?.knutSupply?.size ?? 0,
          raw.board?.knutSupply?.cost ?? 0,
          raw.board?.knutSupply?.open ?? false,
        ),
        new SupplyViewData(
          raw.board?.groSupply?.topCard ?? null,
          raw.board?.groSupply?.size ?? 0,
          raw.board?.groSupply?.cost ?? 0,
          raw.board?.groSupply?.open ?? false,
        ),
        new SupplyViewData(
          raw.board?.randSupply?.topCard ?? null,
          raw.board?.randSupply?.size ?? 0,
          raw.board?.randSupply?.cost ?? 0,
          raw.board?.randSupply?.open ?? false,
        ),
        new SupplyViewData(
          raw.board?.trollSupply?.topCard ?? null,
          raw.board?.trollSupply?.size ?? 0,
          raw.board?.trollSupply?.cost ?? 0,
          raw.board?.trollSupply?.open ?? false,
        ),
      ),

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
      new AccountViewData(
        raw.account?.action ?? 0,
        raw.account?.budget ?? 0,
        raw.account?.buy ?? 0,
        raw.account?.moneyAction ?? 0,
      ),
    );
  }
}
