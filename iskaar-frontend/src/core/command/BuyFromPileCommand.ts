export type BuyFromPileCommand = {
  type: "BUY_FROM_PILE";
  gameId: string;
  playerId: string;
  pileName: string;
};
