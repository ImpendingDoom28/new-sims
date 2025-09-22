import { Character } from "../types/Character.ts";

export const generateRandomCharacterType = (): Character["type"] => {
  return Math.random() > 0.5 ? "male" : "female";
};
