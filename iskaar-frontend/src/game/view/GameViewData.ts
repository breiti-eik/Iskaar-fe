import type { MeViewData } from "./MeViewData";
import type { OpponentViewData } from "./OpponentViewData";
import type { TurnViewData } from "./TurnViewData";

export class GameViewData {
  gameId: string;
  me: MeViewData;
  opponents: OpponentViewData[];
  activePlayerId: string;
  turn: TurnViewData;

  constructor(
    gameId: string,
    me: MeViewData,
    opponents: OpponentViewData[],
    activePlayerId: string,
    turn: TurnViewData,
  ) {
    this.gameId = gameId;
    this.me = me;
    this.opponents = opponents;
    this.activePlayerId = activePlayerId;
    this.turn = turn;
  }
}
