import SockJS from "sockjs-client";
import { Client, type IMessage } from "@stomp/stompjs";
import { GameEventBus } from "../../game/events/GameEventBus";

export class WebSocketConnection {
  private client?: Client;

  connect(gameId: string, onConnected?: () => void) {
    this.client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      reconnectDelay: 5000,

      onConnect: () => {
        console.log("WebSocket connected");

        onConnected?.();

        this.client!.subscribe("/user/queue/game", (msg: IMessage) => {
          const data = this.parseMessage(msg);
          if (data) {
            GameEventBus.emit("GAME_STATE", data);
          }
        });

        this.client!.subscribe(`/app/game/${gameId}`, (msg: IMessage) => {
          const data = this.parseMessage(msg);
          GameEventBus.emit("GAME_STATE", data);
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

  private parseMessage(msg: IMessage): any | null {
    try {
      return JSON.parse(msg.body);
    } catch (e) {
      console.error("Invalid message", msg.body);
      return null;
    }
  }
}
