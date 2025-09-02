import { useCursor, useGLTF } from "@react-three/drei";
import React, { useEffect, useMemo, useState } from "react";
import { SkeletonUtils } from "three-stdlib";

import type { GameItem } from "../../core/types/GameItem";
import { SIMS_MODELS_PATH } from "../../core/constants/game";
import { useGrid } from "../../hooks/useGrid";
import type { Rotation, TwoDPosition } from "../../core/types/Defaults";
import { getItemProportions } from "../../core/utils/getItemProportions";
import {
  mapGridDivisionSelector,
  useSimsStore,
} from "../../core/stores/simsStore";
import {
  isBuildModeSelector,
  useBuildModeStore,
} from "../../core/stores/buildModeStore";
import type { ThreeEvent } from "@react-three/fiber";
import { isMeshObject } from "../../core/utils/isMeshObject";

type ItemProps = {
  item: GameItem;
  onClick: (e: unknown) => void;
  isDragging: boolean;
  dragPosition: TwoDPosition | null;
  draggedItemRotation: Rotation | null;
  canDrop: boolean;
};

export const Item: React.FC<ItemProps> = ({
  item,
  onClick,
  isDragging,
  dragPosition,
  draggedItemRotation,
  canDrop,
}) => {
  const isBuildMode = useBuildModeStore(isBuildModeSelector);
  const { name, gridPosition, size, rotation } = item;
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const mapGridDivision = useSimsStore(mapGridDivisionSelector);
  const { scene } = useGLTF(`${SIMS_MODELS_PATH}/items/${name}.glb`);
  const { gridToVector3 } = useGrid();

  const itemRotation = isDragging ? draggedItemRotation ?? rotation : rotation;
  const { width, height } = getItemProportions({
    size,
    rotation: itemRotation,
  });
  const rotationY = ((itemRotation ?? 1) * Math.PI) / 2;
  useCursor(isBuildMode ? isHovered : false);

  // Skinned meshes cannot be re-used in threejs without cloning them
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  const onItemClick = (e: ThreeEvent<MouseEvent>) => {
    console.log("item clicked", e);
    onClick?.(e);
    // Event has to propogate in order for floor
    // to run it's event handler
    if (!isDragging) {
      e.stopPropagation();
    }
  };

  const groupPosition = useMemo(() => {
    return gridToVector3(
      isDragging ? dragPosition ?? gridPosition : gridPosition,
      width,
      height,
      isDragging ? 0.12 : 0
    );
  }, [dragPosition, gridPosition, gridToVector3, height, isDragging, width]);

  useEffect(() => {
    clone.traverse((child) => {
      if (isMeshObject(child)) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [clone]);

  return (
    <group
      onClick={onItemClick}
      position={groupPosition}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      <primitive object={clone} rotation-y={rotationY} />
      {isDragging && (
        <mesh>
          <boxGeometry
            args={[width / mapGridDivision, 0.2, height / mapGridDivision]}
          />
          <meshBasicMaterial
            color={canDrop ? "green" : "red"}
            opacity={0.2}
            transparent
          />
        </mesh>
      )}
    </group>
  );
};
