import { default as Pathfinding } from "pathfinding";

import { map } from "../constants/map.js";

class Pathfinder {
  readonly #grid;
  readonly #finder;

  constructor(gridWidth: number, gridHeight: number) {
    this.#grid = new Pathfinding.Grid(gridWidth, gridHeight);

    this.#finder = new Pathfinding.AStarFinder({
      allowDiagonal: true,
      dontCrossCorners: true,
    });
  }

  findPath = (start: number[], end: number[]) => {
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

  updateGrid = (): void => {
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

      const { rotation, size, gridPosition } = item;

      const width = rotation === 1 || rotation === 3 ? size[1] : size[0];
      const height = rotation === 1 || rotation === 3 ? size[0] : size[1];

      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          this.#grid.setWalkableAt(
            gridPosition[0] + x,
            gridPosition[1] + y,
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
