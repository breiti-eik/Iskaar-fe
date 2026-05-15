import mitt from "mitt";
import type { GameViewData } from "../view/GameViewData";
import type { ActionType } from "../objects/Actions";
import type { SupplyNameType } from "../objects/SupplyName";
import type { SupplyDirectionType } from "../objects/SupplyDirection";

type Events = {
  cardPlayed: { cardId: string };
  playerAction: ActionType;
  gameView: GameViewData;
  buyCard: { pileName: string; buyerId: string | undefined }; // pileName to buy from;
  shiftCard: { pileName: SupplyNameType; direction: SupplyDirectionType };
};

export const GameEventBus = mitt<Events>();
