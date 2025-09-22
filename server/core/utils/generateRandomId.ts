export const generateRandomId = (name: string) => {
  const randomPart = Math.random().toString(36).substring(2, 11);
  return `${name}-${randomPart}`;
};
