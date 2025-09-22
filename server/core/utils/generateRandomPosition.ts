import { map } from "../constants/map.ts";
import { PathFinder } from "../modules/Pathfinder.ts";

const RETRY_AMOUNT = 100;

export const generateRandomPosition = () => {
  for (let i = 0; i < RETRY_AMOUNT; i++) {
    const x = Math.floor(Math.random() * map.size[0] * map.gridDivision);
    const y = Math.floor(Math.random() * map.size[1] * map.gridDivision);

    if (PathFinder.grid.isWalkableAt(x, y)) {
      return [x, y];
    }
  }
};
