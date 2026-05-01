import { ServerMessage } from "./ServerMessage";
import { GameViewData } from "../../game/view/GameViewData";
import { BoardViewData } from "../../game/view/BoardViewData";
import { MeViewData } from "../../game/view/MeViewData";
import { OpponentViewData } from "../../game/view/OpponentViewData";
import { AccountViewData } from "../../game/view/AccountViewData";
import { SupplyViewData } from "../../game/view/SupplyViewData";
import { MarketViewData } from "../../game/view/MarketViewData";
import { RessourceViewData } from "../../game/view/RessourceViewData";

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
        new RessourceViewData(
          new SupplyViewData(
            raw.board?.ressources?.knutSupply?.pileName ?? null,
            raw.board?.ressources?.knutSupply?.buyerId ?? undefined,
            raw.board?.ressources?.knutSupply?.topCard ?? null,
            raw.board?.ressources?.knutSupply?.size ?? 0,
            raw.board?.ressources?.knutSupply?.cost ?? 0,
            raw.board?.ressources?.knutSupply?.open ?? false,
          ),
          new SupplyViewData(
            raw.board?.ressources?.groSupply?.pileName ?? null,
            raw.board?.ressources?.groSupply?.buyerId ?? undefined,
            raw.board?.ressources?.groSupply?.topCard ?? null,
            raw.board?.ressources?.groSupply?.size ?? 0,
            raw.board?.ressources?.groSupply?.cost ?? 0,
            raw.board?.ressources?.groSupply?.open ?? false,
          ),
          new SupplyViewData(
            raw.board?.ressources?.randSupply?.pileName ?? null,
            raw.board?.ressources?.randSupply?.buyerId ?? undefined,
            raw.board?.ressources?.randSupply?.topCard ?? null,
            raw.board?.ressources?.randSupply?.size ?? 0,
            raw.board?.ressources?.randSupply?.cost ?? 0,
            raw.board?.ressources?.randSupply?.open ?? false,
          ),
          new SupplyViewData(
            raw.board?.ressources?.trollSupply?.pileName ?? null,
            raw.board?.ressources?.trollSupply?.buyerId ?? undefined,
            raw.board?.ressources?.trollSupply?.topCard ?? null,
            raw.board?.ressources?.trollSupply?.size ?? 0,
            raw.board?.ressources?.trollSupply?.cost ?? 0,
            raw.board?.ressources?.trollSupply?.open ?? false,
          ),
        ),
        new MarketViewData(
          new SupplyViewData(
            raw.board?.market?.minusOne?.pileName ?? null,
            raw.board?.market?.minusOne?.buyerId ?? undefined,
            raw.board?.market?.minusOne?.topCard ?? null,
            raw.board?.market?.minusOne?.size ?? 0,
            raw.board?.market?.minusOne?.cost ?? 0,
            raw.board?.market?.minusOne?.open ?? false,
          ),
          new SupplyViewData(
            raw.board?.market?.plusZero?.pileName ?? null,
            raw.board?.market?.plusZero?.buyerId ?? undefined,
            raw.board?.market?.plusZero?.topCard ?? null,
            raw.board?.market?.plusZero?.size ?? 0,
            raw.board?.market?.plusZero?.cost ?? 0,
            raw.board?.market?.plusZero?.open ?? false,
          ),
          new SupplyViewData(
            raw.board?.market?.plusOne?.pileName ?? null,
            raw.board?.market?.plusOne?.buyerId ?? undefined,
            raw.board?.market?.plusOne?.topCard ?? null,
            raw.board?.market?.plusOne?.size ?? 0,
            raw.board?.market?.plusOne?.cost ?? 0,
            raw.board?.market?.plusOne?.open ?? false,
          ),
          new SupplyViewData(
            raw.board?.market?.plusTwo?.pileName ?? null,
            raw.board?.market?.plusTwo?.buyerId ?? undefined,
            raw.board?.market?.plusTwo?.topCard ?? null,
            raw.board?.market?.plusTwo?.size ?? 0,
            raw.board?.market?.plusTwo?.cost ?? 0,
            raw.board?.market?.plusTwo?.open ?? false,
          ),
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
