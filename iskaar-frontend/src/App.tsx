import { Routes, Route } from "react-router-dom";
import LobbyPage from "./lobby/LobbyPage";
import GamePage from "./game/GamePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LobbyPage />} />
      <Route path="/game" element={<GamePage />} />
    </Routes>
  );
}
