import type { GameItem } from "../types/GameItem";

// ширина и длина
// [4, 2]
// поворот - 1

// 1 -
export const getItemProportions = ({
  size,
  rotation,
}: Pick<GameItem, "size" | "rotation">) => {
  return {
    width: rotation === 1 || rotation === 3 ? size[1] : size[0],
    height: rotation === 1 || rotation === 3 ? size[0] : size[1],
  };
};
