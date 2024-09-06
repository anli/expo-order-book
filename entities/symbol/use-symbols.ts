import { useQuery } from '@tanstack/react-query';

const url = `https://api.kucoin.com/api/v1/symbols`;

const getSymbols = async (): Promise<{ symbol: string }[]> => {
  const response = await fetch(url);
  const { data } = await response.json();
  return data;
};

export const useSymbols = () => {
  return useQuery({
    queryKey: ['symbols'],
    queryFn: getSymbols
  });
};
