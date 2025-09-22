import { Server } from "socket.io";

import { generateRandomPosition } from "./core/utils/generateRandomPosition.ts";
import { map, registeredItems } from "./core/constants/map.ts";
import { PathFinder } from "./core/modules/Pathfinder.ts";
import { Characters } from "./core/modules/Characters.ts";

const startServer = () => {
  PathFinder.updateGrid();

  const io = new Server({
    cors: {
      // FIXME: hard-coded url
      origin: [
        "http://localhost:3000",
        "http://10.10.27.211:3000",
        "http://192.168.1.40:3000",
      ],
    },
  });

  io.listen(5050);

  io.on("connection", async (socket) => {
    console.log("a user connected", socket.id);

    Characters.createNewCharacter(socket.id);

    // Default events
    socket.emit("welcome", {
      id: socket.id,
      characters: Characters.placedCharacters,
      map,
      registeredItems,
    });
    socket.on("disconnect", () => {
      console.log("user disconnected");

      Characters.removeCharacter(socket.id);

      io.emit("characters", Characters.placedCharacters);
    });

    io.emit("characters", Characters.placedCharacters);

    // Movement
    socket.on("move", (from: number[], to: number[]) => {
      const path = PathFinder.findPath(from, to);

      if (!path) {
        return;
      }

      const character = Characters.findCharacter(socket.id);

      if (!character) {
        return;
      }

      character.position = from;
      character.path = path;
      io.emit("playerMove:start", character);
    });

    socket.on("playerMove:end", (position: number[]) => {
      const character = Characters.findCharacter(socket.id);

      if (!character) {
        return;
      }

      character.path = [];
      character.position = position;
    });

    // Build Mode
    socket.on("build:started", () => {
      Characters.updateCharacter(socket.id, {
        isBuilding: true,
      });
      io.emit("characters", Characters.placedCharacters);
    });

    socket.on("build:itemPlaced", (newItem: any) => {
      const newPlacedItems = map.placedItems.map((item) => {
        if ((item as any).id === newItem.id) {
          return newItem;
        }
        return item;
      });

      map.placedItems = newPlacedItems as any;
      PathFinder.updateGrid();
      // FIXME: Getting random position and prevents moving, wtf
      Characters.placedCharacters.forEach((character) => {
        character.path = [];
        const nextPosition = generateRandomPosition();
        if (nextPosition) {
          character.position = nextPosition;
        }
      });
      io.emit("build:mapUpdated", {
        map,
        characters: Characters.placedCharacters,
      });
    });

    socket.on("build:ended", () => {
      Characters.updateCharacter(socket.id, {
        isBuilding: false,
      });
      io.emit("characters", Characters.placedCharacters);
    });

    // Shop mode
    socket.on("shop:opened", () => {
      Characters.updateCharacter(socket.id, {
        isShopping: true,
      });
      io.emit("characters", Characters.placedCharacters);
    });

    socket.on("shop:closed", () => {
      Characters.updateCharacter(socket.id, {
        isShopping: false,
      });
      io.emit("characters", Characters.placedCharacters);
    });
  });
};

startServer();
