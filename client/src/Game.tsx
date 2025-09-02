import {
  charactersSelector,
  mapSelector,
  useSimsStore,
} from "./core/stores/simsStore";
import { SocketManager } from "./components/SocketManager";
import { GameField } from "./components/GameField";
import { Item } from "./components/entities/Item";
import { PlayableCharacter } from "./components/entities/PlayableCharacter";
import { GameHUD } from "./components/GameHUD";
import {
  buildModeItemsSelector,
  canDropSelector,
  draggedItemIndexSelector,
  draggedItemPositionSelector,
  draggedItemRotationSelector,
  isBuildModeSelector,
  setDraggedItemIndexSelector,
  setDraggedItemRotationSelector,
  useBuildModeStore,
} from "./core/stores/buildModeStore";

export const Game = () => {
  const characters = useSimsStore(charactersSelector);
  const map = useSimsStore(mapSelector);

  const isBuildMode = useBuildModeStore(isBuildModeSelector);
  const draggedItemIndex = useBuildModeStore(draggedItemIndexSelector);
  const setDraggedItemIndex = useBuildModeStore(setDraggedItemIndexSelector);
  const dragPosition = useBuildModeStore(draggedItemPositionSelector);
  const buildModeItems = useBuildModeStore(buildModeItemsSelector);
  const canDrop = useBuildModeStore(canDropSelector);
  const draggedItemRotation = useBuildModeStore(draggedItemRotationSelector);
  const setDraggedItemRotation = useBuildModeStore(
    setDraggedItemRotationSelector
  );

  return (
    <>
      <SocketManager />
      <GameField>
        {(isBuildMode ? buildModeItems : map?.placedItems)?.map(
          (item, index) => {
            return (
              <Item
                key={item.id}
                item={item}
                onClick={() => {
                  if (!isBuildMode) return;
                  setDraggedItemIndex(draggedItemIndex ?? index);
                  setDraggedItemRotation(item.rotation ?? 1);
                }}
                draggedItemRotation={draggedItemRotation}
                isDragging={draggedItemIndex === index}
                dragPosition={dragPosition}
                canDrop={canDrop}
              />
            );
          }
        )}

        {characters.map((character) => (
          <PlayableCharacter
            key={character.id}
            id={character.id}
            path={character.path}
            type={character.type}
            position={character.position}
            hairColor={character.hairColor}
            topColor={character.topColor}
            bottomColor={character.bottomColor}
            isBuilding={character.isBuilding}
          />
        ))}

        <GameHUD />
      </GameField>
    </>
  );
};
