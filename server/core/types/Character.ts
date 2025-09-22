export type Character = {
  id: string;
  position: number[];
  hairColor: string;
  topColor: string; // HEX color for top wear
  bottomColor: string;
  type: "male" | "female";
  path: number[][];
  isBuilding: boolean;
  isShopping: boolean;
};
