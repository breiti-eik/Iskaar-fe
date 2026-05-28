export const Selection = {
  NONE: "NONE",
  TARGET: "TARGET",
  DIRECTION: "DIRECTION",
  CARD: "CARD",
  PILE: "PILE",
  CARD_SHIFT: "CARD_SHIFT",
  CHOICE: "CHOICE",
  REACTION: "REACTION",
} as const;

export type SelectionType = (typeof Selection)[keyof typeof Selection];
