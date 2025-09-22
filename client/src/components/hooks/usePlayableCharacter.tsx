import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import {
  useFrame,
  useGraph,
  type RootState,
  type Vector3,
} from "@react-three/fiber";

import { CAMERA_POSITION, MOVEMENT_SPEED } from "../../core/constants/game";
import {
  currentUserIdSelector,
  mapGridDivisionSelector,
  mapSelector,
  useSimsStore,
} from "../../core/stores/simsStore";
import type { TwoDPosition } from "../../core/types/Defaults";
import { useThreePath } from "./useThreePath";
import type { Object3D } from "three";
import { socket } from "../../core/modules/socket";
import { useGrid } from "../../hooks/useGrid";
import type { SupportedAnimationNames } from "../../core/types/SupportedAnimationNames";
import type { ActiveAnimation } from "../../core/types/ActiveAnimation";

export type UsePlayableCharacterArgs = {
  modelUrl: string;
  animationNames: SupportedAnimationNames;
  characterId?: string;
  gridPath?: TwoDPosition[];
  position?: Vector3;
  isBuilding: boolean;
  isShopping: boolean;
};

const ANIMATION_SPEED = MOVEMENT_SPEED * 10;

export const usePlayableCharacter = ({
  modelUrl,
  animationNames,
  characterId,
  position,
  gridPath,
  isBuilding,
  isShopping,
}: UsePlayableCharacterArgs) => {
  const map = useSimsStore(mapSelector);
  const mapGridDivision = useSimsStore(mapGridDivisionSelector);
  const currentUserId = useSimsStore(currentUserIdSelector);

  const name = `character-${characterId}`;
  const initialPosition = useMemo(() => {
    return position;
  }, []);
  const INITIAL_ACTIVE_ANIMATION = useMemo(
    () =>
      ({
        name: animationNames.idle,
        pausible: false,
      } as ActiveAnimation),
    [animationNames]
  );

  const { vector3ToGrid } = useGrid();

  const { threePath } = useThreePath({ gridPath });

  const group = useRef<Object3D>(null);
  const { scene, materials, animations } = useGLTF(modelUrl);
  const { actions } = useAnimations(animations, group);
  const [currentActiveAnimation, setCurrentActiveAnimation] =
    useState<ActiveAnimation>(INITIAL_ACTIVE_ANIMATION);
  const [isMovementFinished, setIsMovementFinished] = useState<boolean>(false);
  const {
    runCurrentActiveAnimation,
    idleCurrentActiveAnimation,
    activeCurrentActiveAnimation,
  } = useMemo(() => {
    const runCurrentActiveAnimation: ActiveAnimation = {
      name: "run",
      pausible: false,
    };
    const activeCurrentActiveAnimation: ActiveAnimation = {
      name: "active",
      pausible: true,
    };
    const idleCurrentActiveAnimation: ActiveAnimation = {
      name: "idle",
      pausible: false,
    };

    return {
      runCurrentActiveAnimation,
      idleCurrentActiveAnimation,
      activeCurrentActiveAnimation,
    };
  }, []);

  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes } = useGraph(clonedScene);

  // Make groupCurrent follow the cursor pointer on the grid plane (XZ) with correct world coordinates
  const followPointerOnGrid = useCallback(
    (state: RootState, groupCurrent: Object3D) => {
      const pointer = state.pointer; // {x, y} in NDC (-1 to 1)
      const mapSize = map?.size ?? [10, 10];
      const gridDiv = mapGridDivision;

      // Convert NDC pointer to world coordinates on the XZ grid plane
      const x = ((pointer.x + 1) / gridDiv) * mapSize[0];
      const z = ((-pointer.y + 1) / gridDiv) * mapSize[1];

      groupCurrent.lookAt(x, groupCurrent.position.y, z);
    },
    [map?.size, mapGridDivision]
  );

  // Render loop
  useFrame((state, delta) => {
    const groupCurrent = group.current;

    if (!groupCurrent) return;

    const firstPath: Vector3 | undefined = threePath?.[0];

    if (firstPath && groupCurrent?.position.distanceTo(firstPath) > 0.1) {
      const direction = groupCurrent.position
        .clone()
        .sub(firstPath)
        .normalize()
        .multiplyScalar(MOVEMENT_SPEED);
      groupCurrent.position.sub(direction);
      groupCurrent.lookAt(firstPath);
      setCurrentActiveAnimation(runCurrentActiveAnimation);
      setIsMovementFinished(false);
    } else if (threePath?.length) {
      // TODO: Think through, avoids using react state model
      // by mutating state directly
      threePath.shift();
    } else if (isBuilding || isShopping) {
      followPointerOnGrid(state, groupCurrent);
      setCurrentActiveAnimation(activeCurrentActiveAnimation);
    } else {
      setCurrentActiveAnimation(idleCurrentActiveAnimation);
      setIsMovementFinished(true);
    }

    // Follow the character with the camera
    if (characterId === currentUserId) {
      state.camera.position.x =
        groupCurrent.position.x + CAMERA_POSITION[0] + delta;
      state.camera.position.y =
        groupCurrent.position.y + CAMERA_POSITION[1] + delta;
      state.camera.position.z =
        groupCurrent.position.z + CAMERA_POSITION[2] + delta;
      state.camera.lookAt(groupCurrent.position);
    }
  });

  // Play active animation
  useEffect(() => {
    const animationAction =
      actions[animationNames[currentActiveAnimation.name]];
    const isPausible = currentActiveAnimation.pausible;

    if (animationAction) {
      if (isPausible) {
        if (animationAction.paused) animationAction.reset();
        animationAction.fadeIn(ANIMATION_SPEED).play();
        // Play the animation, wait for half its duration, then pause
        const duration = animationAction.getClip().duration;
        console.log(ANIMATION_SPEED, duration);
        setTimeout(() => {
          animationAction.paused = true;
        }, duration * 500); // Pause at halfway point (duration is in seconds, setTimeout in ms)
      } else {
        animationAction.reset().fadeIn(ANIMATION_SPEED).play();
      }
    }

    return () => {
      if (isPausible) {
        setTimeout(() => {
          animationAction?.reset();
        }, (animationAction?.getClip().duration ?? 0) * 1000);
      }
      animationAction?.fadeOut(ANIMATION_SPEED);
    };
  }, [
    currentActiveAnimation.name,
    currentActiveAnimation.pausible,
    actions,
    animationNames,
  ]);

  // Finish movement and tell it to server
  useEffect(() => {
    if (isMovementFinished && group.current?.position) {
      socket.emit("playerMove:end", vector3ToGrid(group.current.position));
    }
  }, [isMovementFinished, vector3ToGrid]);

  return { nodes, group, materials, initialPosition, name };
};
