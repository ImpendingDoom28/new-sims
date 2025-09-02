import type { Rotation, TwoDPosition } from "./Defaults";

export type GameItem = {
  id: string;
  name: string;
  gridPosition: TwoDPosition;
  size: TwoDPosition;
  rotation?: Rotation;
  walkable?: boolean;
  wall?: boolean;
};
