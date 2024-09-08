import { useQuery } from '@tanstack/react-query';
import invariant from 'tiny-invariant';

invariant(
  process.env.EXPO_PUBLIC_SERVER_HOST_URL,
  'EXPO_PUBLIC_SERVER_HOST_URL is not set'
);
const url = `${process.env.EXPO_PUBLIC_SERVER_HOST_URL}/v1/symbols`;

export type CurrencySymbol = {
  symbol: string;
};

const getSymbols = async (): Promise<CurrencySymbol[]> => {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const response = await fetch(url);
  const { data } = await response.json();
  return data.sort((a: CurrencySymbol, b: CurrencySymbol) =>
    a.symbol.localeCompare(b.symbol)
  );
};

export const useSymbols = () => {
  return useQuery({
    queryKey: ['symbols'],
    queryFn: getSymbols
  });
};
