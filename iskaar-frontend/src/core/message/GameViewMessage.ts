import { ServerMessage } from "./ServerMessage";
import { GameViewData } from "../../game/view/GameViewData";

export class GameViewMessage extends ServerMessage {
  readonly type = "GAME_VIEW";
  view: GameViewData;

  constructor(view: GameViewData) {
    super();
    this.view = view;
  }
}
