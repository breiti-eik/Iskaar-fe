import mitt from "mitt";
import type { GameView } from "../view/GameView";

type Events = {
  cardPlayed: { cardId: string };
  gameView: { view: GameView };
};

export const GameEventBus = mitt<Events>();
