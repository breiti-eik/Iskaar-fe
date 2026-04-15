import { ServerMessage } from "./ServerMessage";
import { CardPlayedMessage } from "./CardPlayedMessage";
import { GameViewMessage } from "./GameViewMessage";

export class MessageFactory {
  static fromJson(json: any): ServerMessage {
    switch (json.type) {
      case "CARD_PLAYED":
        return new CardPlayedMessage(json.playerId, json.card);
      case "GAME_VIEW":
        return new GameViewMessage(json.view);

      default:
        console.log("Unknown message type:", json.type, json);
        throw new Error("Unknown message type: " + json.type);
    }
  }
}
