import { map } from "../constants/map.js";
import { PathFinder } from "../modules/Pathfinder.js";

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
