export const SupplyDirection = {
  TOWARDS_GRAVEYARD: "TOWARDS_GRAVEYARD",
  AWAY_FROM_GRAVEYARD: "AWAY_FROM_GRAVEYARD",
} as const;

export type SupplyDirectionType =
  (typeof SupplyDirection)[keyof typeof SupplyDirection];
