import { useQuery } from '@tanstack/react-query';
import invariant from 'tiny-invariant';

invariant(
  process.env.EXPO_PUBLIC_SERVER_HOST_URL,
  'EXPO_PUBLIC_SERVER_PIN is not set'
);
const url = `${process.env.EXPO_PUBLIC_SERVER_HOST_URL}/symbols`;

const getSymbols = async (): Promise<{ symbol: string }[]> => {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const response = await fetch(url);
  const { data } = await response.json();
  return data.sort((a: { symbol: string }, b: { symbol: string }) =>
    a.symbol.localeCompare(b.symbol)
  );
};

export const useSymbols = () => {
  return useQuery({
    queryKey: ['symbols'],
    queryFn: getSymbols
  });
};
