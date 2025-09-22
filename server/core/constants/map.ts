import { generateRandomId } from "../utils/generateRandomId.js";
import { Item } from "../types/Item.js";
import { MapSettings } from "../types/MapSettings.js";

export const registeredItems: Record<string, Item> = {
  chair: {
    name: "chair",
    size: [1, 1],
  },
  table: {
    name: "table",
    size: [2, 4],
  },
};

export const map: MapSettings = {
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
      id: generateRandomId(registeredItems.table.name),
      gridPosition: [10, 10],
    },
  ],
};
