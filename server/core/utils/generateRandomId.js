export const generateRandomId = (name) => {
  const randomPart = Math.random().toString(36).substr(2, 9);
  return `${name}-${randomPart}`;
};
