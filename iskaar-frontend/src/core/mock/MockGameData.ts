export const MOCK_GAME_VIEW = {
  type: "GAME_VIEW",
  view: {
    gameId: "11111111-1111-1111-1111-111111111111",
    board: {
      knutSupply: {
        topCard: { id: "1", name: "Knut" },
        size: 10,
        cost: 0,
        open: true,
      },
      groSupply: {
        topCard: { id: "2", name: "Gro" },
        size: 8,
        cost: 3,
        open: false,
      },
      randSupply: {
        topCard: { id: "3", name: "Rand" },
        size: 6,
        cost: 5,
        open: false,
      },
      trollSupply: {
        topCard: { id: "4", name: "Troll" },
        size: 4,
        cost: 5,
        open: false,
      },
    },
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
      phase: "BANK",
      allowedActions: ["PASS_BANK"] as const,
    },
    account: {
      action: 1,
      budget: 2,
      buy: 1,
      moneyAction: 0,
    },
  },
};
