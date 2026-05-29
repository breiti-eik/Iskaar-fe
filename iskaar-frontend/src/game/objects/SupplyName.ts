export const SupplyName = {
  SLOT_PLUS2: "Slot +2",
  SLOT_PLUS1: "Slot +1",
  SLOT_PLUS0: "Slot 0",
  SLOT_MINUS1: "Slot -1",
} as const;

export type SupplyNameType = (typeof SupplyName)[keyof typeof SupplyName];
