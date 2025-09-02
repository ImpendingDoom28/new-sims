import { useGLTF } from "@react-three/drei";

import { SIMS_MODELS_PATH } from "../../core/constants/game";
import { DEFAULT_ROTATION } from "../../core/constants/characters";
import type { CommonCharacterProps } from "./PlayableCharacter";
import { usePlayableCharacter } from "../hooks/usePlayableCharacter";
import { CharacterName } from "../ui/CharacterName";

type WomanProps = CommonCharacterProps;

const womanUrl = `${SIMS_MODELS_PATH}/woman.glb`;

export const Woman: React.FC<WomanProps> = ({
  hairColor = "green",
  topColor = "pink",
  bottomColor = "brown",
  id,
  path,
  position,
  isBuilding,
  ...props
}) => {
  const { group, nodes, materials, initialPosition, name } =
    usePlayableCharacter({
      modelUrl: womanUrl,
      animationNames: {
        idle: "CharacterArmature|Idle",
        run: "CharacterArmature|Run",
        active: "CharacterArmature|Interact",
      },
      characterId: id,
      gridPath: path,
      position,
      isBuilding,
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
      <group name="Root_Scen ">
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
              material={materials.Hair_Blond}
              skeleton={nodes.Casual_Head_2.skeleton}
              castShadow
            >
              <meshStandardMaterial color={hairColor} />
            </skinnedMesh>
            <skinnedMesh
              name="Casual_Head_3"
              geometry={nodes.Casual_Head_3.geometry}
              material={materials.Hair_Brown}
              skeleton={nodes.Casual_Head_3.skeleton}
              castShadow
            />
            <skinnedMesh
              name="Casual_Head_4"
              geometry={nodes.Casual_Head_4.geometry}
              material={materials.Brown}
              skeleton={nodes.Casual_Head_4.skeleton}
              castShadow
            />
          </group>
          <group name="Casual_Body" rotation={DEFAULT_ROTATION} scale={100}>
            <skinnedMesh
              name="Casual_Body_1"
              geometry={nodes.Casual_Body_1.geometry}
              material={materials.White}
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
          <skinnedMesh
            name="Casual_Legs"
            geometry={nodes.Casual_Legs.geometry}
            material={materials.Orange}
            skeleton={nodes.Casual_Legs.skeleton}
            rotation={DEFAULT_ROTATION}
            scale={100}
            castShadow
          >
            <meshStandardMaterial color={bottomColor} />
          </skinnedMesh>
          <group name="Casual_Feet" rotation={DEFAULT_ROTATION} scale={100}>
            <skinnedMesh
              name="Casual_Feet_1"
              geometry={nodes.Casual_Feet_1.geometry}
              material={materials.Skin}
              skeleton={nodes.Casual_Feet_1.skeleton}
              castShadow
            />
            <skinnedMesh
              name="Casual_Feet_2"
              geometry={nodes.Casual_Feet_2.geometry}
              material={materials.Grey}
              skeleton={nodes.Casual_Feet_2.skeleton}
              castShadow
            />
          </group>
        </group>
      </group>
    </group>
  );
};

useGLTF.preload(womanUrl);
