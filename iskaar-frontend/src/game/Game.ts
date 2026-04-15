import Phaser from "phaser";
import { GameScene } from "./scenes/GameScene";
import { BootScene } from "./scenes/BootScene";
import { GameClient } from "../core/network/GameClient";

export function createGame(
  parentId: string,
  gameId: string,
  playerId: string,
): Phaser.Game {
  console.log("CreateGame:", { gameId, playerId });
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 2000,
    height: 980,
    parent: parentId,
    backgroundColor: "#1e1e1e",
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [BootScene, GameScene],
  });

  const client = new GameClient();
  client.connect(gameId, playerId);

  (game as any).client = client;

  return game;
}
