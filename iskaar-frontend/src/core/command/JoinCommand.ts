export type JoinGameCommand = {
  type: "JOIN_GAME";
  gameId: string;
  playerName: string;
};
