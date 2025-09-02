import { useCallback, useEffect, useState } from "react";
import { useThree, type ThreeEvent } from "@react-three/fiber";
import { Grid, useCursor } from "@react-three/drei";

import { useGrid } from "../hooks/useGrid";
import { socket } from "../core/modules/socket";
import {
  currentUserIdSelector,
  mapGridDivisionSelector,
  mapSelector,
  useSimsStore,
} from "../core/stores/simsStore";
import {
  buildModeItemsSelector,
  canDropSelector,
  draggedItemIndexSelector,
  draggedItemPositionSelector,
  draggedItemRotationSelector,
  isBuildModeSelector,
  setBuildModeItemsSelector,
  setCanDropSelector,
  setDraggedItemIndexSelector,
  setDraggedItemPositionSelector,
  setDraggedItemRotationSelector,
  useBuildModeStore,
} from "../core/stores/buildModeStore";
import { getItemProportions } from "../core/utils/getItemProportions";

export const GameFieldFloor = () => {
  const [onFloor, setOnFloor] = useState(false);
  const { vector3ToGrid } = useGrid();

  const map = useSimsStore(mapSelector);
  const currentUserId = useSimsStore(currentUserIdSelector);
  const mapGridDivision = useSimsStore(mapGridDivisionSelector);

  const isBuildMode = useBuildModeStore(isBuildModeSelector);
  const draggedItemPosition = useBuildModeStore(draggedItemPositionSelector);
  const setDragPosition = useBuildModeStore(setDraggedItemPositionSelector);
  const draggedItemIndex = useBuildModeStore(draggedItemIndexSelector);
  const setDraggedItemIndex = useBuildModeStore(setDraggedItemIndexSelector);
  const buildModeItems = useBuildModeStore(buildModeItemsSelector);
  const setBuildModeItems = useBuildModeStore(setBuildModeItemsSelector);
  const setCanDrop = useBuildModeStore(setCanDropSelector);
  const canDrop = useBuildModeStore(canDropSelector);
  const draggedItemRotation = useBuildModeStore(draggedItemRotationSelector);
  const setDraggedItemRotation = useBuildModeStore(
    setDraggedItemRotationSelector
  );

  const scene = useThree((state) => state.scene);

  useCursor(onFloor, "pointer", "auto");

  // Check if the item can be droppable on the floor
  useEffect(() => {
    if (draggedItemIndex === null || draggedItemPosition === null) {
      return;
    }

    const currentDraggedItem = buildModeItems[draggedItemIndex];
    const { width, height } = getItemProportions({
      size: currentDraggedItem.size,
      rotation: draggedItemRotation ?? undefined,
    });

    const dragX = draggedItemPosition[0];
    const dragY = draggedItemPosition[1];

    let droppable = true;
    // Check if item is in bounds
    if (dragX < 0 || dragX + width > (map?.size?.[0] ?? 10) * mapGridDivision) {
      droppable = false;
    }
    if (
      dragY < 0 ||
      dragY + height > (map?.size?.[1] ?? 10) * mapGridDivision
    ) {
      droppable = false;
    }

    // Check if item is not colliding with other items
    if (!currentDraggedItem.walkable && !currentDraggedItem.wall) {
      buildModeItems.forEach((item, idx) => {
        // ignore self
        if (idx === draggedItemIndex) {
          return;
        }

        // ignore walls and walkables
        if (item.walkable || item.wall) {
          return;
        }

        // check item collision
        const { gridPosition } = item;
        const { width: itemWidth, height: itemHeight } = getItemProportions({
          ...item,
        });
        if (
          dragX < gridPosition[0] + itemWidth &&
          dragX + width > gridPosition[0] &&
          dragY < gridPosition[1] + itemHeight &&
          dragY + height > gridPosition[1]
        ) {
          droppable = false;
        }
      });
    }

    setCanDrop(droppable);
  }, [
    draggedItemPosition,
    draggedItemIndex,
    buildModeItems,
    setCanDrop,
    map?.size,
    mapGridDivision,
    draggedItemRotation,
  ]);

  const onFloorBaseModeClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      const character = scene.getObjectByName(`character-${currentUserId}`);
      if (!character) {
        return;
      }

      socket.emit(
        "move",
        vector3ToGrid(character.position),
        vector3ToGrid(e.point)
      );
    },
    [currentUserId, scene, vector3ToGrid]
  );

  const onFloorBuildModeClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      if (draggedItemIndex !== null) {
        if (canDrop) {
          const newItems = [...buildModeItems];
          const droppingItem = newItems[draggedItemIndex];
          droppingItem.gridPosition = vector3ToGrid(e.point);
          droppingItem.rotation = draggedItemRotation ?? 1;
          setBuildModeItems(newItems);
          socket.emit("build:itemPlaced", droppingItem);
        }
        setDraggedItemIndex(null);
        setDraggedItemRotation(null);
      }
    },
    [
      buildModeItems,
      canDrop,
      draggedItemIndex,
      draggedItemRotation,
      setBuildModeItems,
      setDraggedItemIndex,
      setDraggedItemRotation,
      vector3ToGrid,
    ]
  );

  const onFloorClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      if (!isBuildMode) {
        onFloorBaseModeClick(e);
      } else {
        onFloorBuildModeClick(e);
      }
    },
    [isBuildMode, onFloorBaseModeClick, onFloorBuildModeClick]
  );

  const onFloorPointerMove = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      const newPosition = vector3ToGrid(e.point);
      if (
        !draggedItemPosition ||
        newPosition[0] !== draggedItemPosition[0] ||
        newPosition[1] !== draggedItemPosition[1]
      ) {
        setDragPosition(newPosition);
      }
    },
    [draggedItemPosition, setDragPosition, vector3ToGrid]
  );

  const onFloorPointerEnter = useCallback(() => setOnFloor(true), []);
  const onFloorPointerLeave = useCallback(() => setOnFloor(false), []);

  return (
    <>
      <mesh
        rotation-x={-Math.PI / 2}
        position-y={-0.01}
        position-x={(map?.size[0] ?? 10) / 2}
        position-z={(map?.size[1] ?? 10) / 2}
        onPointerEnter={onFloorPointerEnter}
        onPointerLeave={onFloorPointerLeave}
        onPointerMove={isBuildMode ? onFloorPointerMove : undefined}
        onClick={onFloorClick}
        receiveShadow
      >
        <planeGeometry args={map?.size ?? [10, 10]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      {isBuildMode && <Grid infiniteGrid fadeDistance={50} fadeStrength={5} />}
    </>
  );
};
