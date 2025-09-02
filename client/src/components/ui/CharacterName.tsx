import { Html } from "@react-three/drei";
import React, { useRef, useState } from "react";
import type { Camera, Object3D } from "three";
import {
  currentUserIdSelector,
  useSimsStore,
} from "../../core/stores/simsStore";

type CharacterNameProps = {
  characterId: string | undefined;
};

export const CharacterName: React.FC<CharacterNameProps> = ({
  characterId,
}) => {
  const idRef = useRef<HTMLDivElement>(null);
  const currentUserId = useSimsStore(currentUserIdSelector);

  const [isHidden, setIsHidden] = useState<boolean>();

  const onCalculateHtmlPosition = (
    el: Object3D,
    camera: Camera,
    size: { width: number; height: number }
  ) => {
    const widthHalf = size.width / 2;
    const heightHalf = size.height / 2;

    const idElemSizes = idRef.current?.getBoundingClientRect();

    if (!idElemSizes) return [0, 0];

    const nameHeight = idElemSizes.height;
    // Camera position dependant
    // FIXME: Adjust for fov, diffrent heights, calculate properly
    const characterHeight = 215;
    const heightOffset = characterHeight + nameHeight;

    const widthOffset = idElemSizes.width / 2;

    return [widthHalf - widthOffset, heightHalf - heightOffset];
  };

  // FIXME: Needs to be shown to other players as well
  return characterId === currentUserId ? (
    <Html
      occlude
      onOcclude={setIsHidden}
      style={{
        transition: "all 0.5s",
        opacity: isHidden ? 0 : 1,
        transform: `scale(${isHidden ? 0.5 : 1})`,
      }}
      calculatePosition={onCalculateHtmlPosition}
    >
      <div
        ref={idRef}
        className="bg-black/15 backdrop-blur-md py-1 px-2 rounded-2xl text-nowrap"
      >
        {characterId}
      </div>
    </Html>
  ) : null;
};
