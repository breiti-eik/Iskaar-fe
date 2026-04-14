import { ServerMessage } from "./ServerMessage";
import { CardPlayedMessage } from "./CardPlayedMessage";
import { GameViewMessage } from "./GameViewMessage";

export class MessageFactory {
  static fromJson(json: any): ServerMessage {
    switch (json.type) {
      case "CARD_PLAYED":
        return new CardPlayedMessage(json.playerId, json.card);
      case "GAME_STATE":
        return new GameViewMessage(json);

      default:
        throw new Error("Unknown message type: " + json.type);
    }
  }
}
