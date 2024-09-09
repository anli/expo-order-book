export const getUpdatedPriceSize = (
  changes: [price: string, size: string, sequence: string][],
  current: [price: string, size: string][],
  sequence: string
) => {
  return changes.reduce<[price: string, size: string][]>(
    (acc, [askChangePrice, askChangeSize, askChangeSequence]) => {
      if (askChangeSequence <= sequence) {
        return acc;
      }

      const matchingIndex = acc.findIndex(
        ([price]) => askChangePrice === price
      );
      if (matchingIndex >= 0) {
        if (askChangeSize === '0') {
          return acc.toSpliced(matchingIndex, 1);
        }

        acc[matchingIndex][1] = askChangeSize;
        return acc;
      }

      return [...acc, [askChangePrice, askChangeSize]];
    },
    [...current]
  );
};
