import type { TwoDPosition } from "./Defaults";

export type Character = {
  id: string;
  position: TwoDPosition;
  path: TwoDPosition[];
  hairColor: string;
  topColor: string;
  bottomColor: string;
  type: "male" | "female";
  isBuilding: boolean;
  isShopping: boolean;
};
