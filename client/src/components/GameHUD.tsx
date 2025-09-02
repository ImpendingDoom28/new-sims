import React, { useCallback, useEffect } from "react";
import { Html, Hud, PerspectiveCamera } from "@react-three/drei";

import {
  isBuildModeSelector,
  updateDraggedItemRotationSelector,
  setIsBuildModeSelector,
  useBuildModeStore,
  draggedItemIndexSelector,
  isShopOpenedSelector,
  setIsShopOpenedSelector,
} from "../core/stores/buildModeStore";
import { IconButton } from "./ui/IconButton";
import { socket } from "../core/modules/socket";
import classNames from "classnames";

export const GameHUD: React.FC = () => {
  const isShopOpened = useBuildModeStore(isShopOpenedSelector);
  const isBuildMode = useBuildModeStore(isBuildModeSelector);
  const setIsBuildMode = useBuildModeStore(setIsBuildModeSelector);
  const draggedItemIndex = useBuildModeStore(draggedItemIndexSelector);
  const updateDraggedItemRotation = useBuildModeStore(
    updateDraggedItemRotationSelector
  );
  const setIsShopOpened = useBuildModeStore(setIsShopOpenedSelector);

  const onBuildModeButtonClick = useCallback(() => {
    setIsBuildMode(!isBuildMode);
    if (isBuildMode) {
      socket.emit("build:ended");
    } else {
      socket.emit("build:started");
    }
  }, [isBuildMode, setIsBuildMode]);

  const onRotateButtonClick = useCallback(() => {
    updateDraggedItemRotation();
  }, [updateDraggedItemRotation]);

  const onShopButtonClick = () => {
    setIsShopOpened(!isShopOpened);
    if (isShopOpened) {
      socket.emit("shop:closed");
    } else {
      socket.emit("shop:opened");
    }
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const pressedKey = event.key.toLowerCase();
      let handler;
      if (pressedKey === "b") {
        handler = onBuildModeButtonClick;
      }
      if (pressedKey === "r" && isBuildMode) {
        handler = onRotateButtonClick;
      }

      if (handler) {
        event.preventDefault();
        handler();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [
    isBuildMode,
    onBuildModeButtonClick,
    onRotateButtonClick,
    setIsBuildMode,
  ]);

  return (
    <Hud>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} />
      <Html fullscreen castShadow receiveShadow>
        <div className="grid grid-cols-4 grid-rows-4 h-dvh">
          <div
            className={classNames(
              "flex items-end self-end justify-center h-16 col-start-2 col-end-4 row-start-4 row-end-4 gap-2 p-3 -mb-1 rounded-tl-lg shadow-lg bg-gradient-to-r backdrop-blur-md bg-black/15 transition-transform",
              !isShopOpened && "transform-perspective rounded-tr-lg"
            )}
          >
            <IconButton isActive={isBuildMode} onClick={onBuildModeButtonClick}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                />
              </svg>
            </IconButton>
            <IconButton isActive={isShopOpened} onClick={onShopButtonClick}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
            </IconButton>
            {isBuildMode && (
              <>
                <IconButton
                  onClick={onRotateButtonClick}
                  isDisabled={draggedItemIndex === null}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
                    />
                  </svg>
                </IconButton>
              </>
            )}
          </div>

          {isShopOpened && (
            <div className="flex flex-col col-start-4 col-end-4 row-start-1 row-end-5 bg-gradient-to-r backdrop-blur-md bg-black/15">
              {"text"}
            </div>
          )}
        </div>
      </Html>
    </Hud>
  );
};
