import mitt from "mitt";
import type { Card } from "../objects/Card";

type Events = {
  GAME_STATE: any; // 👈 wichtig
  cardPlayed: { card: Card };
  buyCardRequest: { cardId: string };
};

export const GameEventBus = mitt<Events>();
