import type { Mesh } from "three";

export const isMeshObject = (obj: unknown): obj is Mesh => {
  return !!obj && (obj as Mesh).isMesh;
};
