import { ServerMessage } from "./ServerMessage";
import { GameView } from "../../game/view/GameView";

export class GameViewMessage extends ServerMessage {
  readonly type = "GAME_VIEW";
  view: GameView;

  constructor(view: GameView) {
    super();
    this.view = view;
  }
}
