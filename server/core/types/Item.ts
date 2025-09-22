export type Item = {
  name: string;
  size: number[];
  walkable?: boolean;
  wall?: boolean;
  rotation?: number;
};

export type PlacedItem = Item & {
  id: string;
  gridPosition: number[];
};
