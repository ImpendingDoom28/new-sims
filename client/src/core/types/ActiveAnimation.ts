import type { SupportedAnimationNames } from "./SupportedAnimationNames";

export type ActiveAnimation = {
  name: keyof SupportedAnimationNames;
  pausible: boolean;
};
