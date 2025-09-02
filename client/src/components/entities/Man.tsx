import React from "react";

import { SIMS_MODELS_PATH } from "../../core/constants/game";
import { DEFAULT_ROTATION } from "../../core/constants/characters";
import type { CommonCharacterProps } from "./PlayableCharacter";
import { usePlayableCharacter } from "../hooks/usePlayableCharacter";
import { CharacterName } from "../ui/CharacterName";

type ManProps = CommonCharacterProps;

const manUrl = `${SIMS_MODELS_PATH}/man.glb`;

export const Man: React.FC<ManProps> = ({
  hairColor = "green",
  topColor = "pink",
  bottomColor = "brown",
  id,
  path,
  position,
  isBuilding,
  isShopping,
  ...props
}) => {
  const { group, initialPosition, materials, nodes, name } =
    usePlayableCharacter({
      modelUrl: manUrl,
      animationNames: {
        idle: "CharacterArmature|Idle",
        run: "CharacterArmature|Run",
        active: "CharacterArmature|Interact",
      },
      characterId: id,
      gridPath: path,
      position,
      isBuilding,
      isShopping,
    });

  return (
    <group
      ref={group}
      {...props}
      dispose={null}
      position={initialPosition}
      name={name}
    >
      <CharacterName characterId={id} />
      <group name="Root_Scene">
        <group name="RootNode">
          <group
            name="CharacterArmature"
            rotation={DEFAULT_ROTATION}
            scale={100}
          >
            <primitive object={nodes.Root} />
          </group>
          <group name="Casual_Head" rotation={DEFAULT_ROTATION} scale={100}>
            <skinnedMesh
              name="Casual_Head_1"
              geometry={nodes.Casual_Head_1.geometry}
              material={materials.Skin}
              skeleton={nodes.Casual_Head_1.skeleton}
              castShadow
            />
            <skinnedMesh
              name="Casual_Head_2"
              geometry={nodes.Casual_Head_2.geometry}
              material={materials.Eyebrows}
              skeleton={nodes.Casual_Head_2.skeleton}
              castShadow
            />
            <skinnedMesh
              name="Casual_Head_3"
              geometry={nodes.Casual_Head_3.geometry}
              material={materials.Eye}
              skeleton={nodes.Casual_Head_3.skeleton}
              castShadow
            />
            <skinnedMesh
              name="Casual_Head_4"
              geometry={nodes.Casual_Head_4.geometry}
              material={materials.Hair}
              skeleton={nodes.Casual_Head_4.skeleton}
              castShadow
            >
              <meshStandardMaterial color={hairColor} />
            </skinnedMesh>
          </group>
          <group
            name="Casual_Body"
            position={[0, 0.007, 0]}
            rotation={DEFAULT_ROTATION}
            scale={100}
          >
            <skinnedMesh
              name="Casual_Body_1"
              geometry={nodes.Casual_Body_1.geometry}
              material={materials.Purple}
              skeleton={nodes.Casual_Body_1.skeleton}
              castShadow
            >
              <meshStandardMaterial color={topColor} />
            </skinnedMesh>
            <skinnedMesh
              name="Casual_Body_2"
              geometry={nodes.Casual_Body_2.geometry}
              material={materials.Skin}
              skeleton={nodes.Casual_Body_2.skeleton}
              castShadow
            />
          </group>
          <group name="Casual_Legs" rotation={DEFAULT_ROTATION} scale={100}>
            <skinnedMesh
              name="Casual_Legs_1"
              geometry={nodes.Casual_Legs_1.geometry}
              material={materials.Skin}
              skeleton={nodes.Casual_Legs_1.skeleton}
              castShadow
            />
            <skinnedMesh
              name="Casual_Legs_2"
              geometry={nodes.Casual_Legs_2.geometry}
              material={materials.LightBlue}
              skeleton={nodes.Casual_Legs_2.skeleton}
              castShadow
            >
              <meshStandardMaterial color={bottomColor} />
            </skinnedMesh>
          </group>
          <group name="Casual_Feet" rotation={DEFAULT_ROTATION} scale={100}>
            <skinnedMesh
              name="Casual_Feet_1"
              geometry={nodes.Casual_Feet_1.geometry}
              material={materials.White}
              skeleton={nodes.Casual_Feet_1.skeleton}
              castShadow
            />
            <skinnedMesh
              name="Casual_Feet_2"
              geometry={nodes.Casual_Feet_2.geometry}
              material={materials.Purple}
              skeleton={nodes.Casual_Feet_2.skeleton}
              castShadow
            />
          </group>
        </group>
      </group>
    </group>
  );
};
