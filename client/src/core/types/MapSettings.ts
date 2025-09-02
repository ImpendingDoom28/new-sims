import type { TwoDPosition } from "./Defaults";
import type { GameItem } from "./GameItem";

export type MapSettings = {
  size: TwoDPosition;
  gridDivision: number;
  placedItems: GameItem[];
};
