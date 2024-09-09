import BigNumber from 'bignumber.js';

export const getSummary = (
  data?: [price: string, size: string][]
): { averagePrice: string; totalSize: string } => {
  if (!data || data?.length === 0) {
    return { averagePrice: '0', totalSize: '0' };
  }

  const [totalPriceBN, totalSizeBN] = data.reduce(
    ([accPrice, accSize], [price, size]) => {
      return [accPrice.plus(BigNumber(price)), accSize.plus(BigNumber(size))];
    },
    [BigNumber(0), BigNumber(0)]
  );

  return {
    averagePrice: totalPriceBN.dividedBy(data.length).toString(),
    totalSize: totalSizeBN.toString()
  };
};
