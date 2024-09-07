import BigNumber from 'bignumber.js';

const numberFormat = {
  decimalSeparator: '.',
  groupSeparator: ',',
  groupSize: 3
};

const currencyFormat = {
  prefix: '$',
  ...numberFormat
};

export const formatCurrency = (value: BigNumber.Value) => {
  if (BigNumber(value).isNaN()) return null;

  return BigNumber(value).toFormat(2, currencyFormat);
};

export const formatCrypto = (value: BigNumber.Value, decimals: number = 8) => {
  if (BigNumber(value).isNaN()) return null;

  return BigNumber(value).toFormat(decimals, numberFormat);
};
