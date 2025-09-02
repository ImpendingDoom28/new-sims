import { generateRandomId } from "../utils/generateRandomId.js";

/**
 * @typedef Item
 * @property {string} name
 * @property {number[]} size
 * @property {boolean | undefined} wall - If can be placed on wall
 * @property {boolean | undefined} walkable - If can be walked over
 */
export const registeredItems = {
  chair: {
    name: "chair",
    size: [1, 1],
  },
  table: {
    name: "table",
    size: [2, 4],
  },
};

export const map = {
  size: [10, 10],
  gridDivision: 2,
  placedItems: [
    {
      ...registeredItems.chair,
      id: generateRandomId(registeredItems.chair.name),
      gridPosition: [15, 18],
    },
    {
      ...registeredItems.chair,
      id: generateRandomId(registeredItems.chair.name),
      gridPosition: [15, 15],
      rotation: 2,
    },
    {
      ...registeredItems.table,
      id: generateRandomId(registeredItems.chair.table),
      gridPosition: [10, 10],
    },
  ],
};
