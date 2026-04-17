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
        { id: "1", name: "Knut" },
        { id: "2", name: "Knut" },
        { id: "3", name: "Knut" },
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
        discardTopCard: { id: null, name: null },
      },
    ],
    activePlayerId: "mock-player-id",
  },
};

export const MOCK_GAME_VIEW_FULL = {
  type: "GAME_VIEW",
  view: {
    gameId: "22222222-2222-2222-2222-222222222222",

    me: {
      playerId: "player-me",
      playerName: "You",

      drawPileSize: 12,

      persistentCards: [
        { id: "p1", name: "Banner" },
        { id: "p2", name: "Amulet" },
      ],

      hand: [
        { id: "h1", name: "Knut" },
        { id: "h2", name: "Knut" },
        { id: "h3", name: "Gro" },
      ],

      inPlay: [
        { id: "ip1", name: "Knut" },
        { id: "ip2", name: "Rand" },
      ],

      discard: [
        { id: "d1", name: "Knut" },
        { id: "d2", name: "Gro" },
        { id: "d3", name: "Rand" },
        { id: "d4", name: "Knut" },
        { id: "d5", name: "Gro" },
        { id: "d6", name: "Rand" },
      ],
    },

    opponents: [
      {
        playerId: "player-opp-1",
        playerName: "Opponent A",

        drawPileSize: 8,
        handSize: 4,

        inPlay: [{ id: "o1-ip1", name: "Knut" }],

        persistentCards: [{ id: "o1-p1", name: "Relic" }],

        discardTopCard: {
          id: "o1-d1",
          name: "Gro",
        },
      },

      {
        playerId: "player-opp-2",
        playerName: "Opponent B",

        drawPileSize: 3,
        handSize: 2,

        inPlay: [],

        persistentCards: [],

        discardTopCard: {
          id: null,
          name: null,
        },
      },
    ],

    activePlayerId: "player-me",
  },
};
