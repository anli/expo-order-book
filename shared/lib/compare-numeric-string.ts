export const compareNumericString = (a: string, b: string) => {
  return a.localeCompare(b, undefined, { numeric: true });
};
