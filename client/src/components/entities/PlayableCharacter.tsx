import React, { memo } from "react";

import { Man } from "./Man";
import { Woman } from "./Woman";
import type { Character } from "../../core/types/Character";
import { useGrid } from "../../hooks/useGrid";
import type { Vector3 } from "three";

export type CommonCharacterProps = Omit<Character, "type" | "position"> & {
  position: Vector3;
};

type PlayableCharacterProps = Omit<CommonCharacterProps, "position"> & {
  position: Character["position"];
  type?: "male" | "female";
};

export const PlayableCharacter: React.FC<PlayableCharacterProps> = memo(
  ({ type, position, ...props }) => {
    const { gridToVector3 } = useGrid();
    const vector3Position = gridToVector3(position);

    switch (type) {
      case "male":
        return <Man {...props} position={vector3Position} />;
      case "female":
        return <Woman {...props} position={vector3Position} />;
      default:
        console.error("Unknown PlayableCharacter type!!!", type);
        return null;
    }
  }
);

PlayableCharacter.displayName = "PlayableCharacter";
