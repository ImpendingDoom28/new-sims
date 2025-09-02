import { useCallback } from "react";
import type { Vector2, Vector3 } from "three";
import * as THREE from "three";

import {
  mapGridDivisionSelector,
  useSimsStore,
} from "../core/stores/simsStore";
import type { TwoDPosition } from "../core/types/Defaults";

export const useGrid = () => {
  const mapGridDivision = useSimsStore(mapGridDivisionSelector);

  const vector3ToGrid = useCallback(
    (vector3: Vector3) => {
      return [
        Math.floor(vector3.x * mapGridDivision),
        Math.floor(vector3.z * mapGridDivision),
      ] as TwoDPosition;
    },
    [mapGridDivision]
  );

  const vector2ToVector3 = useCallback((vector2: Vector2, up: number = 0) => {
    return new THREE.Vector3(vector2.x, up, vector2.y);
  }, []);

  const gridToVector3 = useCallback(
    (
      gridPosition: [number, number],
      width: number = 1,
      height: number = 1,
      up: number = 0
    ) => {
      return new THREE.Vector3(
        width / mapGridDivision / 2 + gridPosition[0] / mapGridDivision,
        up,
        height / mapGridDivision / 2 + gridPosition[1] / mapGridDivision
      );
    },
    [mapGridDivision]
  );

  return {
    vector3ToGrid,
    vector2ToVector3,
    gridToVector3,
  };
};
