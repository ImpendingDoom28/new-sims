import { useEffect } from "react";

import {
  charactersSelector,
  initStateSelector,
  setCharactersSelector,
  setMapSelector,
  setRegisteredItemsSelector,
  useSimsStore,
} from "../core/stores/simsStore";
import { socket } from "../core/modules/socket";
import type { Character } from "../core/types/Character";
import type { MapSettings } from "../core/types/MapSettings";
import {
  setBuildModeItemsSelector,
  useBuildModeStore,
} from "../core/stores/buildModeStore";

export const SocketManager = () => {
  const setRegisteredItems = useSimsStore(setRegisteredItemsSelector);
  const setCharacters = useSimsStore(setCharactersSelector);
  const characters = useSimsStore(charactersSelector);
  const initState = useSimsStore(initStateSelector);
  const setMap = useSimsStore(setMapSelector);
  const setBuildModeItems = useBuildModeStore(setBuildModeItemsSelector);

  useEffect(() => {
    const onConnect = () => {
      console.log("connected to socket", socket.id);
    };

    const onDisconnect = () => {
      console.log("disconnected from socket");
    };

    const onWelcome = (appInitialState: {
      id: string;
      characters: Character[];
      map: MapSettings;
      registeredItems: Parameters<typeof setRegisteredItems>[0];
    }) => {
      initState({
        characters: appInitialState.characters,
        map: appInitialState.map,
        currentUserId: appInitialState.id,
      });
      setBuildModeItems(appInitialState.map.placedItems);
      setRegisteredItems(appInitialState.registeredItems);
    };

    const onCharacters = (value: Character[]) => {
      console.log("characters", value);
      setCharacters(value);
    };

    const onPlayerMoveStart = (value: Character) => {
      const newCharacters = characters.map((character) => {
        if (character.id === value.id) {
          return value;
        }

        return character;
      });
      setCharacters(newCharacters);
    };

    const onPlayerMoveEnd = (value: Character) => {
      const newCharacters = characters.map((character) => {
        if (character.id === value.id) {
          return value;
        }

        return character;
      });
      setCharacters(newCharacters);
    };

    const onBuildMapUpdated = (appState: {
      characters: Character[];
      map: MapSettings;
    }) => {
      setBuildModeItems(appState.map.placedItems);
      setCharacters(appState.characters);
      setMap(appState.map);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("welcome", onWelcome);
    socket.on("characters", onCharacters);
    socket.on("playerMove:start", onPlayerMoveStart);
    socket.on("playerMove:end", onPlayerMoveEnd);
    socket.on("build:mapUpdated", onBuildMapUpdated);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("welcome", onWelcome);
      socket.off("characters", onCharacters);
      socket.off("playerMove:start", onPlayerMoveStart);
      socket.off("playerMove:end", onPlayerMoveEnd);
      socket.off("build:mapUpdated", onBuildMapUpdated);
    };
  }, [characters, initState, setCharacters, setBuildModeItems, setMap]);

  return null;
};
