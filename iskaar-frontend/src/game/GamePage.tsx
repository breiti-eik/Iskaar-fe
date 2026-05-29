import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { createGame } from "./Game";

export default function GamePage() {
  const location = useLocation();
  const { playerId, gameId } = location.state || {};

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const game = createGame("game-container", gameId, playerId);

    return () => {
      game.destroy(true);
    };
  }, [gameId, playerId]);

  return <div id="game-container" ref={containerRef} />;
}
