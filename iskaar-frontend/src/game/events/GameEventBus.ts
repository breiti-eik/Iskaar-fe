import mitt from "mitt";
import type { GameViewData } from "../view/GameViewData";

type Events = {
  cardPlayed: { cardId: string };
  gameView: { view: GameViewData };
};

export const GameEventBus = mitt<Events>();
