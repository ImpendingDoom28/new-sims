import Pathfinding from "pathfinding";

import { map } from "../constants/map.js";

class Pathfinder {
  #grid;
  #finder;

  constructor(gridWidth, gridHeight) {
    this.#grid = new Pathfinding.Grid(gridWidth, gridHeight);

    this.#finder = new Pathfinding.AStarFinder({
      allowDiagonal: true,
      dontCrossCorners: true,
    });
  }

  findPath = (start, end) => {
    const gridClone = this.#grid.clone();
    const path = this.#finder.findPath(
      start[0],
      start[1],
      end[0],
      end[1],
      gridClone
    );
    return path;
  };

  updateGrid = () => {
    // Reseting grid walkable
    for (let x = 0; x < map.size[0] * map.gridDivision; x++) {
      for (let y = 0; y < map.size[1] * map.gridDivision; y++) {
        this.#grid.setWalkableAt(x, y, true);
      }
    }

    map.placedItems.forEach((item) => {
      if (item.walkable || item.wall) {
        return;
      }

      const width =
        item.rotation === 1 || item.rotation === 3
          ? item.size[1]
          : item.size[0];
      const height =
        item.rotation === 1 || item.rotation === 3
          ? item.size[0]
          : item.size[1];

      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          this.#grid.setWalkableAt(
            item.gridPosition[0] + x,
            item.gridPosition[1] + y,
            false
          );
        }
      }
    });
  };

  get grid() {
    return this.#grid;
  }
}

export const PathFinder = new Pathfinder(
  map.size[0] * map.gridDivision,
  map.size[1] * map.gridDivision
);
