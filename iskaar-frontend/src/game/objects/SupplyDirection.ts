export const SupplyDirection = {
  TOWARDS_GRAVEYARD: "TOWARDS_GRAVEYARD",
  TOWARDS_SUPPLY: "TOWARDS_SUPPLY",
} as const;

export type SupplyDirectionType =
  (typeof SupplyDirection)[keyof typeof SupplyDirection];
