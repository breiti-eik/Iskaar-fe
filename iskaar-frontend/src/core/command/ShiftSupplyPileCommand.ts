export type ShiftSupplyPileCommand = {
  type: "SHIFT_SUPPLY";
  gameId: string;
  playerId: string;
  pileName: string;
};
