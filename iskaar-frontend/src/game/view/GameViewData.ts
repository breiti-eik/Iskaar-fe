import type { AccountViewData } from "./AccountViewData";
import type { BoardViewData } from "./BoardViewData";
import type { MeViewData } from "./MeViewData";
import type { OpponentViewData } from "./OpponentViewData";
import type { TurnViewData } from "./TurnViewData";

export class GameViewData {
  gameId: string;
  board: BoardViewData;
  me: MeViewData;
  opponents: OpponentViewData[];
  activePlayerId: string;
  turn: TurnViewData;
  account: AccountViewData;

  constructor(
    gameId: string,
    board: BoardViewData,
    me: MeViewData,
    opponents: OpponentViewData[],
    activePlayerId: string,
    turn: TurnViewData,
    account: AccountViewData,
  ) {
    this.gameId = gameId;
    this.board = board;
    this.me = me;
    this.opponents = opponents;
    this.activePlayerId = activePlayerId;
    this.turn = turn;
    this.account = account;
  }
}
