import SockJS from "sockjs-client";
import { Client, type IMessage } from "@stomp/stompjs";
import { GameEventBus } from "../../game/events/GameEventBus";
import { MessageFactory } from "../message/MessageFactory";
import type { ServerMessage } from "../message/ServerMessage";
import { GameViewMessage } from "../message/GameViewMessage";
import type { CardPlayedMessage } from "../message/CardPlayedMessage";

export class WebSocketConnection {
  private client?: Client;

  connect(gameId: string, onConnected?: () => void) {
    this.client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      reconnectDelay: 5000,

      onConnect: () => {
        console.log("WebSocket connected");

        onConnected?.();

        this.client!.subscribe("/topic/game", (msg: IMessage) => {
          this.onMessage(msg);
        });
      },
    });

    this.client.activate();
  }

  disconnect() {
    this.client?.deactivate();
  }

  send(payload: any) {
    if (!this.client || !this.client.connected) {
      throw new Error("WebSocket not connected");
    }

    this.client.publish({
      destination: "/app/game/command",
      body: JSON.stringify(payload),
    });
  }

  private onMessage(raw: any) {
    const json = JSON.parse(raw.body);
    const message = MessageFactory.fromJson(json);

    this.dispatch(message);
  }

  private dispatch(message: ServerMessage) {
    switch (message.type) {
      case "CARD_PLAYED":
        GameEventBus.emit("cardPlayed", {
          card: (message as CardPlayedMessage).card,
        });
        break;
      case "GAME_VIEW":
        GameEventBus.emit("gameViewReceived", {
          view: (message as GameViewMessage).view,
        });
        break;
    }
  }
}
