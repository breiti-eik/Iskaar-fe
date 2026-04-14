import mitt from "mitt";
import { Card } from "../objects/Card";
import type { GameView } from "../view/GameView";

type Events = {
  cardPlayed: { card: Card };
  gameViewReceived: { view: GameView };
};

export const GameEventBus = mitt<Events>();
