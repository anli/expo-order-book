import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import invariant from 'tiny-invariant';

invariant(
  process.env.EXPO_PUBLIC_SERVER_HOST_URL,
  'EXPO_PUBLIC_SERVER_HOST_URL is not set'
);
const url = `${process.env.EXPO_PUBLIC_SERVER_HOST_URL}/v1/market/orderbook/level2_100`;

export type OrderBook = {
  time: string;
  sequence: string;
  bids: [price: string, size: string][];
  asks: [price: string, size: string][];
};

const getMarketOrderBook = async (symbol: string): Promise<OrderBook> => {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const searchParams = new URLSearchParams({ symbol });
  const response = await fetch(`${url}?${searchParams.toString()}`);
  const { data } = await response.json();
  return data;
};

export const useMarketOrderBook = (
  symbol: string,
  options?: Omit<UseQueryOptions<OrderBook>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['market-order-book', symbol],
    queryFn: () => getMarketOrderBook(symbol),
    ...options
  });
};
