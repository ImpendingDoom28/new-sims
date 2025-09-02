import { create } from "zustand/react";
import type { Character } from "../types/Character";
import type { MapSettings } from "../types/MapSettings";
import type { GameItem } from "../types/GameItem";

type SimsStoreType = {
  currentUserId: string | null;
  characters: Character[];
  map: MapSettings | null;
  mapGridDivision: number;
  registeredItems: Omit<GameItem, "gridPosition" | "id" | "rotation">[];
  setCharacters: (characters: SimsStoreType["characters"]) => void;
  setMap: (map: SimsStoreType["map"]) => void;
  initState: (
    state: Pick<SimsStoreType, "characters" | "map" | "currentUserId">
  ) => void;
  setRegisteredItems: (items: SimsStoreType["registeredItems"]) => void;
};

export const useSimsStore = create<SimsStoreType>((set, get) => ({
  currentUserId: null,
  characters: [],
  map: null,
  mapGridDivision: get()?.map?.gridDivision ?? 2,
  registeredItems: [],
  setMap: (map) => {
    set({ map });
  },
  setCharacters: (characters) => {
    set({ characters });
  },
  setRegisteredItems: (items) => {
    set({ registeredItems: items });
  },
  initState: (state) => {
    localStorage.setItem("userId", state.currentUserId ?? "");
    set({ ...state });
  },
}));

export const initStateSelector = (state: SimsStoreType) => state.initState;
export const currentUserIdSelector = (state: SimsStoreType) =>
  state.currentUserId;
export const charactersSelector = (state: SimsStoreType) => state.characters;
export const setCharactersSelector = (state: SimsStoreType) =>
  state.setCharacters;
export const mapSelector = (state: SimsStoreType) => state.map;

export const mapGridDivisionSelector = (state: SimsStoreType) =>
  state.mapGridDivision;
export const setMapSelector = (state: SimsStoreType) => state.setMap;

export const registeredItemsSelector = (state: SimsStoreType) =>
  state.registeredItems;
export const setRegisteredItemsSelector = (state: SimsStoreType) =>
  state.setRegisteredItems;
