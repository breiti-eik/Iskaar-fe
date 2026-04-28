export const MOCK_GAME_VIEW = {
  type: "GAME_VIEW",
  view: {
    gameId: "11111111-1111-1111-1111-111111111111",
    me: {
      playerId: "mock-player-id",
      playerName: "Mock Player A",
      drawPileSize: 2,
      persistentCards: [],
      hand: [
        { id: "4", name: "Knut" },
        { id: "5", name: "Knut" },
      ],
      inPlay: [{ id: "3", name: "Knut" }],
      discard: [
        { id: "4", name: "Knut" },
        { id: "5", name: "Knut" },
        { id: "6", name: "Knut" },
      ],
    },
    opponents: [
      {
        playerId: "mock-opponent-id",
        playerName: "Mock Player B",
        drawPileSize: 2,
        handSize: 3,
        inPlay: [],
        persistentCards: [],
        discardTopCard: null,
      },
    ],
    activePlayerId: "mock-player-id",
    turn: {
      phase: "PLAY",
      allowedActions: ["PASS_PLAY"] as const,
    },
  },
};
