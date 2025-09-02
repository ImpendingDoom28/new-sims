import { Server } from "socket.io";

import { generateRandomPosition } from "./core/utils/generateRandomPosition.js";
import { generateRandomHexColor } from "./core/utils/generateRandomHexColor.js";
import { generateRandomCharacterType } from "./core/utils/generateRandomCharacterType.js";
import { map, registeredItems } from "./core/constants/map.js";
import { PathFinder } from "./core/modules/Pathfinder.js";

/**
 * @typedef Character
 * @property {string} id
 * @property {number[]} position
 * @property {string} hairColor
 * @property {string} topColor - HEX color for top wear
 * @property {string} bottomColor
 * @property {"male" | "female"} type
 * @property {number[][]} path
 * @property {boolean} isBuilding
 * @property {boolean} isShopping
 */

/**
 * @type {Character[]}
 */
let characters = [];
const findCharacter = (id) => {
  return characters.find((character) => character.id === id);
};

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

    const newCharacter = {
      id: socket.id,
      position: generateRandomPosition(),
      hairColor: generateRandomHexColor(),
      topColor: generateRandomHexColor(),
      bottomColor: generateRandomHexColor(),
      type: generateRandomCharacterType(),
      path: [],
      isBuilding: false,
      isShopping: false,
    };
    characters.push(newCharacter);

    // Default events
    socket.emit("welcome", {
      id: socket.id,
      characters,
      map,
      registeredItems,
    });
    socket.on("disconnect", () => {
      console.log("user disconnected");

      characters.splice(
        characters.findIndex((character) => character.id === socket.id),
        1
      );

      io.emit("characters", characters);
    });

    io.emit("characters", characters);

    // Movement
    socket.on("move", (from, to) => {
      const path = PathFinder.findPath(from, to);

      if (!path) {
        return;
      }

      const character = findCharacter(socket.id);

      if (!character) {
        return;
      }

      character.position = from;
      character.path = path;
      io.emit("playerMove:start", character);
    });

    socket.on("playerMove:end", (position) => {
      const character = findCharacter(socket.id);

      if (!character) {
        return;
      }

      character.path = [];
      character.position = position;
    });

    // Build Mode
    socket.on("build:started", () => {
      characters = characters.map((character) => {
        if (character.id === socket.id) {
          return {
            ...character,
            isBuilding: true,
          };
        }

        return character;
      });
      io.emit("characters", characters);
    });

    socket.on("build:itemPlaced", (newItem) => {
      const newPlacedItems = map.placedItems.map((item) => {
        if (item.id === newItem.id) {
          return newItem;
        }
        return item;
      });

      map.placedItems = newPlacedItems;
      PathFinder.updateGrid();
      // FIXME: Getting random position and prevents moving, wtf
      characters.forEach((character) => {
        character.path = [];
        character.position = generateRandomPosition();
      });
      io.emit("build:mapUpdated", {
        map,
        characters,
      });
    });

    socket.on("build:ended", () => {
      characters = characters.map((character) => {
        if (character.id === socket.id) {
          return {
            ...character,
            isBuilding: false,
          };
        }

        return character;
      });
      io.emit("characters", characters);
    });

    // Shop mode
    socket.on("shop:opened", () => {
      characters = characters.map((character) => {
        if (character.id === socket.id) {
          return {
            ...character,
            isShopping: true,
          };
        }

        return character;
      });
      io.emit("characters", characters);
    });

    socket.on("shop:closed", () => {
      characters = characters.map((character) => {
        if (character.id === socket.id) {
          return {
            ...character,
            isShopping: false,
          };
        }

        return character;
      });
      io.emit("characters", characters);
    });
  });
};

startServer();
