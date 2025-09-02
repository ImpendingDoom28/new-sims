import { Canvas } from "@react-three/fiber";
import { Suspense, type FC, type PropsWithChildren } from "react";

import { GameFieldDefaults } from "./GameFieldDefaults";
import { CAMERA_OPTIONS } from "../core/constants/game";
import { GameFieldFloor } from "./GameFieldFloor";

type GameFieldProps = PropsWithChildren;

export const GameField: FC<GameFieldProps> = ({ children }) => {
  return (
    <Canvas shadows camera={CAMERA_OPTIONS}>
      <Suspense fallback={"Loading..."}>
        <GameFieldDefaults />
        <GameFieldFloor />
        {children}
      </Suspense>
    </Canvas>
  );
};
