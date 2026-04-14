import type { MeView } from "./MeView";
import type { OpponentView } from "./OpponentView";

export class GameView {
  gameId: string;
  me: MeView;
  opponents: OpponentView[];
  activePlayerId: string;

  constructor(
    gameId: string,
    me: MeView,
    opponents: OpponentView[],
    activePlayerId: string,
  ) {
    this.gameId = gameId;
    this.me = me;
    this.opponents = opponents;
    this.activePlayerId = activePlayerId;
  }
}
