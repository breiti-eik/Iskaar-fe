import { ServerMessage } from "./ServerMessage";
import { GameViewData } from "../../game/view/GameViewData";
import { BoardViewData } from "../../game/view/BoardViewData";
import { MeViewData } from "../../game/view/MeViewData";
import { OpponentViewData } from "../../game/view/OpponentViewData";
import { AccountViewData } from "../../game/view/AccountViewData";
import { SupplyViewData } from "../../game/view/SupplyViewData";
import { MarketViewData } from "../../game/view/MarketViewData";
import { RessourceViewData } from "../../game/view/RessourceViewData";
import { TableauViewData } from "../../game/view/TableauViewData";
import { AdventureViewData } from "../../game/view/AdventureViewData";
import { BodyViewData } from "../../game/view/BodyViewData";
import { VictoryPointsViewData } from "../../game/view/VictoryPointsViewData";
import { BankViewData } from "../../game/view/BankViewData";
import { TurnViewData } from "../../game/view/TurnViewData";
import { InteractionViewData } from "../../game/view/InteractionViewData";

export class GameViewMessage extends ServerMessage {
  readonly type = "GAME_VIEW";
  view: GameViewData;

  constructor(raw: any) {
    super();
    this.view = this.map(raw);
  }

  private map(raw: any): GameViewData {
    const { knutSupply } = raw.board.ressources;
    const { groSupply } = raw.board.ressources;
    const { randSupply } = raw.board.ressources;
    const { trollSupply } = raw.board.ressources;

    const { minusOne } = raw.board.market;
    const { plusZero } = raw.board.market;
    const { plusOne } = raw.board.market;
    const { plusTwo } = raw.board.market;

    const { graveyard } = raw.board;

    const { tableau } = raw.me;
    const { bank } = tableau;
    const { adventure } = tableau;
    const { victoryPoints } = tableau;
    const { body } = tableau;

    const { me } = raw;

    return new GameViewData(
      raw.gameId,
      new BoardViewData(
        new RessourceViewData(
          new SupplyViewData(
            knutSupply.pileName ?? null,
            knutSupply.buyerId ?? undefined,
            knutSupply.topCard ?? null,
            knutSupply.size ?? 0,
            knutSupply.cost ?? 0,
            knutSupply.open ?? false,
          ),
          new SupplyViewData(
            groSupply.pileName ?? null,
            groSupply.buyerId ?? undefined,
            groSupply.topCard ?? null,
            groSupply.size ?? 0,
            groSupply.cost ?? 0,
            groSupply.open ?? false,
          ),
          new SupplyViewData(
            randSupply.pileName ?? null,
            randSupply.buyerId ?? undefined,
            randSupply.topCard ?? null,
            randSupply.size ?? 0,
            randSupply.cost ?? 0,
            randSupply.open ?? false,
          ),
          new SupplyViewData(
            trollSupply.pileName ?? null,
            trollSupply.buyerId ?? undefined,
            trollSupply.topCard ?? null,
            trollSupply.size ?? 0,
            trollSupply.cost ?? 0,
            trollSupply.open ?? false,
          ),
        ),
        new MarketViewData(
          new SupplyViewData(
            minusOne.pileName ?? null,
            minusOne.buyerId ?? undefined,
            minusOne.topCard ?? null,
            minusOne.size ?? 0,
            minusOne.cost ?? 0,
            minusOne.open ?? false,
          ),
          new SupplyViewData(
            plusZero.pileName ?? null,
            plusZero.buyerId ?? undefined,
            plusZero.topCard ?? null,
            plusZero.size ?? 0,
            plusZero.cost ?? 0,
            plusZero.open ?? false,
          ),
          new SupplyViewData(
            plusOne.pileName ?? null,
            plusOne.buyerId ?? undefined,
            plusOne.topCard ?? null,
            plusOne.size ?? 0,
            plusOne.cost ?? 0,
            plusOne.open ?? false,
          ),
          new SupplyViewData(
            plusTwo.pileName ?? null,
            plusTwo.buyerId ?? undefined,
            plusTwo.topCard ?? null,
            plusTwo.size ?? 0,
            plusTwo.cost ?? 0,
            plusTwo.open ?? false,
          ),
        ),
        graveyard ?? [],
      ),

      // 🔵 ME
      new MeViewData(
        me.playerId,
        me.playerName,
        me.drawPileSize,
        me.persistentCards ?? [],
        me.hand ?? [],
        me.inPlay ?? [],
        me.discard ?? [],
        new TableauViewData(
          new AdventureViewData(adventure.size, adventure.position),
          new BankViewData(bank.cards, bank.amount, bank.open),
          new BodyViewData(body.strength, body.health, body.unconscious),
          new VictoryPointsViewData(
            victoryPoints.total,
            victoryPoints.ones,
            victoryPoints.fives,
            victoryPoints.tens,
          ),
        ),
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
      new TurnViewData(raw.turn?.phase ?? ""),
      new InteractionViewData(
        raw.interaction?.actions ?? [],
        raw.interaction?.selections ?? [],
      ),
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
