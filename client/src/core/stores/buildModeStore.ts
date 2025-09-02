import { create } from "zustand/react";

import type { Rotation, TwoDPosition } from "../types/Defaults";
import type { GameItem } from "../types/GameItem";

type BuildModeStoreType = {
  isShopOpened: boolean;
  isBuildMode: boolean;
  draggedItemIndex: number | null;
  draggedItemPosition: TwoDPosition | null;
  draggedItemRotation: Rotation | null;
  buildModeItems: GameItem[];
  canDrop: boolean;
  setIsShopOpened: (value: BuildModeStoreType["isShopOpened"]) => void;
  setIsBuildMode: (value: BuildModeStoreType["isBuildMode"]) => void;
  setBuildModeItems: (items: BuildModeStoreType["buildModeItems"]) => void;
  setDraggedItemIndex: (index: BuildModeStoreType["draggedItemIndex"]) => void;
  setDraggedItemPosition: (
    position: BuildModeStoreType["draggedItemPosition"]
  ) => void;
  updateDraggedItemRotation: () => void;
  setDraggedItemRotation: (
    rotation: BuildModeStoreType["draggedItemRotation"]
  ) => void;
  setCanDrop: (value: BuildModeStoreType["canDrop"]) => void;
  resetDraggedItem: () => void;
};

export const useBuildModeStore = create<BuildModeStoreType>((set, get) => ({
  isShopOpened: false,
  isBuildMode: false,
  buildModeItems: [],
  draggedItemIndex: null,
  draggedItemPosition: null,
  draggedItemRotation: null,
  canDrop: false,
  resetDraggedItem: () => {
    set({
      draggedItemIndex: null,
      draggedItemPosition: null,
      draggedItemRotation: null,
      canDrop: false,
    });
  },
  setIsShopOpened: (value) => {
    set({ isShopOpened: value });
  },
  setIsBuildMode: (value) => {
    set({ isBuildMode: value });
  },
  setBuildModeItems: (items) => {
    set({ buildModeItems: items });
  },
  setDraggedItemPosition: (position) => {
    set({ draggedItemPosition: position });
  },
  setDraggedItemIndex: (index) => {
    set({ draggedItemIndex: index });
  },
  updateDraggedItemRotation: () => {
    const currentRotation = get().draggedItemRotation!;
    const newRotation = currentRotation === 4 ? 1 : currentRotation + 1;

    set({
      draggedItemRotation:
        newRotation as BuildModeStoreType["draggedItemRotation"],
    });
  },
  setDraggedItemRotation: (rotation) => {
    set({ draggedItemRotation: rotation });
  },
  setCanDrop: (value) => {
    set({ canDrop: value });
  },
}));

export const isBuildModeSelector = (state: BuildModeStoreType) =>
  state.isBuildMode;
export const setIsBuildModeSelector = (state: BuildModeStoreType) =>
  state.setIsBuildMode;
export const draggedItemIndexSelector = (state: BuildModeStoreType) =>
  state.draggedItemIndex;
export const setDraggedItemIndexSelector = (state: BuildModeStoreType) =>
  state.setDraggedItemIndex;
export const draggedItemPositionSelector = (state: BuildModeStoreType) =>
  state.draggedItemPosition;
export const setDraggedItemPositionSelector = (state: BuildModeStoreType) =>
  state.setDraggedItemPosition;
export const buildModeItemsSelector = (state: BuildModeStoreType) =>
  state.buildModeItems;
export const setBuildModeItemsSelector = (state: BuildModeStoreType) =>
  state.setBuildModeItems;

export const setCanDropSelector = (state: BuildModeStoreType) =>
  state.setCanDrop;
export const canDropSelector = (state: BuildModeStoreType) => state.canDrop;

export const draggedItemRotationSelector = (state: BuildModeStoreType) =>
  state.draggedItemRotation;
export const updateDraggedItemRotationSelector = (state: BuildModeStoreType) =>
  state.updateDraggedItemRotation;

export const setDraggedItemRotationSelector = (state: BuildModeStoreType) =>
  state.setDraggedItemRotation;

export const isShopOpenedSelector = (state: BuildModeStoreType) =>
  state.isShopOpened;
export const setIsShopOpenedSelector = (state: BuildModeStoreType) =>
  state.setIsShopOpened;

export const resetDraggedItemSelector = (state: BuildModeStoreType) =>
  state.resetDraggedItem;
