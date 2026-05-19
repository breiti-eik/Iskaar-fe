export const Selection = {
  NONE: "NONE",
  TARGET: "TARGET",
  DIRECTION: "DIRECTION",
  DRAWPILE_CARD: "DRAWPILE_CARD",
  HAND_CARD: "HAND_CARD",
  INPLAY_CARD: "INPLAY_CARD",
  PILE: "PILE",
  CARD_SHIFT: "CARD_SHIFT",
  CHOICE: "CHOICE",
  REACTION: "REACTION",
} as const;

export type SelectionType = (typeof Selection)[keyof typeof Selection];
