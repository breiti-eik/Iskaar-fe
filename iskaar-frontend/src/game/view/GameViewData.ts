import type { MeViewData } from "./MeViewData";
import type { OpponentViewData } from "./OpponentViewData";

export class GameViewData {
  gameId: string;
  me: MeViewData;
  opponents: OpponentViewData[];
  activePlayerId: string;

  constructor(
    gameId: string,
    me: MeViewData,
    opponents: OpponentViewData[],
    activePlayerId: string,
  ) {
    this.gameId = gameId;
    this.me = me;
    this.opponents = opponents;
    this.activePlayerId = activePlayerId;
  }
}
