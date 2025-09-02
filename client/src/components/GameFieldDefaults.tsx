import { Environment, OrbitControls } from "@react-three/drei";
import { suspend } from "suspend-react";
import { mapSelector, useSimsStore } from "../core/stores/simsStore";

const city = import("@pmndrs/assets/hdri/city.exr").then(
  (module) => module.default
);

export const GameFieldDefaults = () => {
  const map = useSimsStore(mapSelector);

  return (
    <>
      <color attach="background" args={["#bcbcbc"]} />
      <Environment files={suspend(city) as string} />\
      <ambientLight intensity={0.1} />
      {/** FIXME: Make the light to follow the character for better shadows */}
      <directionalLight
        position={[-4, 4, -4]}
        castShadow
        intensity={1.2}
        shadow-mapSize={[1024, 1024]}
      >
        <orthographicCamera
          attach={"shadow-camera"}
          // FIXME: Won't work on bigger maps as the size is constant :'(
          args={[-(map?.size[0] ?? 10), map?.size[1] ?? 10, 10, -10]}
          far={(map?.size[0] ?? 10) + (map?.size[1] ?? 10)}
        />
      </directionalLight>
      <OrbitControls
        maxDistance={20}
        minDistance={5}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={0}
        screenSpacePanning={false}
      />
    </>
  );
};
