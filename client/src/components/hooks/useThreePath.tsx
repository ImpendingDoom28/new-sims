import { useEffect, useState } from "react";
import type { Vector3 } from "three";

import { useGrid } from "../../hooks/useGrid";
import type { TwoDPosition } from "../../core/types/Defaults";

type UseThreePathArgs = {
  gridPath?: TwoDPosition[];
};

export const useThreePath = ({ gridPath }: UseThreePathArgs) => {
  const { gridToVector3 } = useGrid();
  const [threePath, setThreePath] = useState<Vector3[]>([]);

  useEffect(() => {
    const newPath: Vector3[] = [];
    if (!gridPath) return;
    gridPath.forEach((gridPosition) => {
      newPath.push(gridToVector3(gridPosition));
    });
    setThreePath(newPath);
  }, [gridPath, gridToVector3]);

  return { threePath };
};
