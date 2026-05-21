import { WebSocketConnection } from "./WebSocketConnection";
import { PlayCardCommand } from "../command/PlayCardCommand";
import { ActionCommand } from "../command/ActionCommand";
import type { ActionType } from "../../game/objects/Actions";
import { BuyFromPileCommand } from "../command/BuyFromPileCommand";
import type { SupplyNameType } from "../../game/objects/SupplyName";
import type { SupplyDirectionType } from "../../game/objects/SupplyDirection";
import { ShiftSupplyCommand } from "../command/ShiftSupplyCommand";

export class GameClient {
  private connection = new WebSocketConnection();
  private gameId?: string;
  private playerId?: string;

  connect(gameId: string, playerId: string, onConnected?: () => void) {
    this.connection.connect(gameId, playerId, onConnected);
    this.gameId = gameId;
    this.playerId = playerId;
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

  buyFromPileforMe(pileName: string, playerId: string | undefined) {
    if (!playerId) {
      console.warn("Player ID is undefined. Cannot buy from pile.");
      return;
    }
    if (!this.gameId) {
      throw new Error("GameClient not connected");
    }

    this.send(new BuyFromPileCommand(this.gameId, playerId, pileName));
  }

  shiftCardFromPile(pileName: SupplyNameType, direction: SupplyDirectionType) {
    if (!this.playerId) {
      console.warn("Player ID is undefined. Cannot buy from pile.");
      return;
    }
    if (!this.gameId) {
      throw new Error("GameClient not connected");
    }

    this.send(
      new ShiftSupplyCommand(this.gameId, this.playerId, pileName, direction),
    );
  }

  sendAction(action: ActionType) {
    if (!this.gameId) {
      throw new Error("GameClient not connected");
    }
    switch (action) {
      default:
        this.send(new ActionCommand(this.gameId, action));
    }
  }
}
