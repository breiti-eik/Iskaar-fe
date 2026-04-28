import { WebSocketConnection } from "./WebSocketConnection";
import { PlayCardCommand } from "../command/PlayCardCommand";
import { ActionCommand } from "../command/ActionCommand";
import type { ActionType } from "../../game/objects/Actions";

export class GameClient {
  private connection = new WebSocketConnection();
  private gameId?: string;

  connect(gameId: string, playerId: string, onConnected?: () => void) {
    this.connection.connect(gameId, playerId, onConnected);
    this.gameId = gameId;
  }

  disconnect() {
    this.connection.disconnect();
  }

  private send<T>(command: T) {
    this.connection.send(command);
  }

  playCard(cardId: string) {
    if (!this.gameId) {
      throw new Error("GameClient not connected");
    }

    this.send(new PlayCardCommand(this.gameId, cardId));
  }

  sendAction(action: ActionType) {
    if (!this.gameId) {
      throw new Error("GameClient not connected");
    }
    this.send(new ActionCommand(this.gameId, action));
  }
}
