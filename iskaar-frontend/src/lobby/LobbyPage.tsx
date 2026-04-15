import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FIXED_GAME_ID = "11111111-1111-1111-1111-111111111111";

export default function LobbyPage() {
  const [playerName, setPlayerName] = useState("");
  const navigate = useNavigate();

  const handleJoin = async () => {
    const response = await fetch(
      `http://localhost:8080/games/${FIXED_GAME_ID}/join`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playerName,
        }),
      },
    );

    if (!response.ok) {
      console.error("Join failed");
      return;
    }

    const data = await response.json();

    console.log("Joined:", data);

    navigate("/game", {
      state: {
        gameId: FIXED_GAME_ID,
        playerId: data.playerId,
      },
    });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Iskaar Lobby</h1>

      <div>
        <label>Player Name:</label>
        <input
          type="text"
          value={playerName}
          onChange={e => setPlayerName(e.target.value)}
        />
      </div>

      <button onClick={handleJoin}>Join Game</button>
    </div>
  );
}
