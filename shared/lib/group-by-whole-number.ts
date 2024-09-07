import BigNumber from 'bignumber.js';

export const groupByWholeNumber = (orders: [price: string, size: string][]) => {
  return orders.reduce<[string, string][]>((acc, [price, size]) => {
    const wholeNumber = `${Math.floor(parseFloat(price))}`;
    const previousValue = [...acc].pop();

    if (previousValue?.[0] === wholeNumber) {
      return [
        ...acc.slice(0, -1),
        [wholeNumber, BigNumber(previousValue[1]).plus(size).toString()]
      ];
    }

    return [...acc, [wholeNumber, size]];
  }, []);
};
