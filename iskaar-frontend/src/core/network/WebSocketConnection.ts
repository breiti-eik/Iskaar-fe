import SockJS from "sockjs-client";
import { Client, type IMessage } from "@stomp/stompjs";
import { GameEventBus } from "../../game/events/GameEventBus";
import { MessageFactory } from "../message/MessageFactory";
import type { ServerMessage } from "../message/ServerMessage";
import { GameViewMessage } from "../message/GameViewMessage";

export class WebSocketConnection {
  private client?: Client;

  connect(gameId: string, playerId: string, onConnected?: () => void) {
    this.client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      reconnectDelay: 0,

      connectHeaders: { playerId },

      onConnect: () => {
        console.log("WebSocket connected as", playerId);
        onConnected?.();
        this.client!.subscribe("/user/queue/game", (msg: IMessage) => {
          this.onMessage(msg);
        });

        // explizit initial GameView anfordern
        this.client!.publish({
          destination: "/app/game/init",
          body: JSON.stringify({ gameId }),
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

  private onMessage(raw: IMessage) {
    const json = JSON.parse(raw.body);
    let message = undefined;
    console.debug(json);
    message = MessageFactory.fromJson(json);

    this.dispatch(message);
  }

  private dispatch(message: ServerMessage) {
    switch (message.type) {
      case "GAME_VIEW":
        GameEventBus.emit("gameView", (message as GameViewMessage).view);
        break;
    }
  }
}
