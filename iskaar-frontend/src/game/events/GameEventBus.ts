import mitt from "mitt";
import { Card } from "../objects/Card";
import type { GameView } from "../view/GameView";

type Events = {
  cardPlayed: { cardId: string };
  gameView: { view: GameView };
};

export const GameEventBus = mitt<Events>();
