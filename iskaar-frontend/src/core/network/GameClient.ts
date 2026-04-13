import { WebSocketConnection } from "./WebSocketConnection";
import type { PlayCardCommand } from "../command/PlayCardCommand";

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
    const command: PlayCardCommand = {
      type: "PLAY_CARD",
      gameId,
      cardId,
    };

    this.send(command);
  }

  joinGame(gameId: string, playerName: string) {
    this.connection.send({
      type: "JOIN_GAME",
      gameId,
      playerName,
    });
  }
}
