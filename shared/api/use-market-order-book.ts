import { useQuery } from '@tanstack/react-query';
import invariant from 'tiny-invariant';

invariant(
  process.env.EXPO_PUBLIC_SERVER_HOST_URL,
  'EXPO_PUBLIC_SERVER_PIN is not set'
);
const url = `${process.env.EXPO_PUBLIC_SERVER_HOST_URL}/market/orderbook/level2_100`;

export type OrderBook = {
  time: string;
  sequence: string;
  bids: [price: string, size: string][];
  asks: [price: string, size: string][];
};

const getMarketOrderBook = async (symbol: string): Promise<OrderBook> => {
  const searchParams = new URLSearchParams({ symbol });
  const response = await fetch(`${url}?${searchParams.toString()}`);
  const { data } = await response.json();
  return data;
};

export const useMarketOrderBook = (symbol: string) => {
  return useQuery({
    queryKey: ['market-order-book', symbol],
    queryFn: () => getMarketOrderBook(symbol)
  });
};
