export const TurnPhase = {
  PLAY: "PLAY_CARD",
  BANK: "BANK",
  BUY: "BUY",
  SHIFT_SUPPLY: "SHIFT_SUPPLY",
  CLEANUP: "CLEANUP",
} as const;

export type TurnPhaseType = (typeof TurnPhase)[keyof typeof TurnPhase];
