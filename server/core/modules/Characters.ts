import { Character } from "../types/Character.ts";
import { generateRandomCharacterType } from "../utils/generateRandomCharacterType.ts";
import { generateRandomHexColor } from "../utils/generateRandomHexColor.ts";
import { generateRandomPosition } from "../utils/generateRandomPosition.ts";

export class Characters {
  private static characters: Character[] = [];

  static addCharacter(character: Character): void {
    this.characters.push(character);
  }

  static removeCharacter(id: string): void {
    this.characters = this.characters.filter(
      (character) => character.id !== id
    );
  }

  static findCharacter(id: string): Character | undefined {
    return this.characters.find((character) => character.id === id);
  }

  static get placedCharacters(): Character[] {
    return this.characters;
  }

  static updateCharacter(id: string, newCharacter: Partial<Character>): void {
    this.characters = this.characters.map((character) => {
      if (character.id === id) {
        return {
          ...character,
          ...newCharacter,
        };
      }
      return character;
    });
  }

  static createNewCharacter(id: string): Character {
    const initialPosition = generateRandomPosition() ?? [0, 0];
    const newCharacter: Character = {
      id,
      position: initialPosition,
      hairColor: generateRandomHexColor(),
      topColor: generateRandomHexColor(),
      bottomColor: generateRandomHexColor(),
      type: generateRandomCharacterType(),
      path: [],
      isBuilding: false,
      isShopping: false,
    };
    this.addCharacter(newCharacter);
    return newCharacter;
  }
}
