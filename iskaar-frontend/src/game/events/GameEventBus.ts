import mitt from "mitt";
import type { GameViewData } from "../view/GameViewData";
import type { ActionType } from "../objects/Actions";

type Events = {
  cardPlayed: { cardId: string };
  playerAction: ActionType;
  gameView: GameViewData;
  buyCard: { pileName: string; buyerId: string | undefined }; // pileName to buy from;
};

export const GameEventBus = mitt<Events>();
