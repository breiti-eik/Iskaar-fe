import Phaser from "phaser";
import { GameScene } from "./scenes/GameScene";
import { BootScene } from "./scenes/BootScene";
import { GameClient } from "../core/network/GameClient";

export function createGame(
  parentId: string,
  gameId: string,
  playerId: string,
): Phaser.Game {
  const isMock = import.meta.env.VITE_USE_MOCK === "true";
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
    scene: [BootScene],
  });
  if (isMock) {
    game.scene.add("GameScene", GameScene);
  } else {
    const client = new GameClient();
    client.connect(gameId, playerId);

    (game as any).client = client;

    game.scene.add("GameScene", GameScene, false, { gameClient: client });
  }

  return game;
}
