import { WebSocketConnection } from "./WebSocketConnection";
import { PlayCardCommand } from "../command/PlayCardCommand";

export class GameClient {
  private connection = new WebSocketConnection();

  connect(gameId: string, playerId: string, onConnected?: () => void) {
    this.connection.connect(gameId, playerId, onConnected);
  }

  disconnect() {
    this.connection.disconnect();
  }

  private send<T>(command: T) {
    this.connection.send(command);
  }

  playCard(gameId: string, cardId: string) {
    this.send(new PlayCardCommand(gameId, cardId));
  }
}
