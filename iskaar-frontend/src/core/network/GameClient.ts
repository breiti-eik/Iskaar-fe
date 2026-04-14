import { WebSocketConnection } from "./WebSocketConnection";
import { PlayCardCommand } from "../command/PlayCardCommand";
import { JoinGameCommand } from "../command/JoinGameCommand";

export class GameClient {
  private connection = new WebSocketConnection();

  connect(gameId: string, onConnected?: () => void) {
    this.connection.connect(gameId, onConnected);
  }

  disconnect() {
    this.connection.disconnect();
  }

  // Generic Sender
  private send<T>(command: T) {
    this.connection.send(command);
  }

  playCard(gameId: string, cardId: string) {
    this.send(new PlayCardCommand(gameId, cardId));
  }

  joinGame(gameId: string, playerName: string) {
    this.send(new JoinGameCommand(gameId, playerName));
  }
}
