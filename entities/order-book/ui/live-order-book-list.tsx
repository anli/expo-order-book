import { useLiveOrderBookChanges, useMarketOrderBook } from '@/shared/api';
import { OrderBookList, OrderBookListProps } from './order-book-list';
import { OrderBookSummary } from './order-book-summary';

type LiveOrderBookListProps = Omit<OrderBookListProps, 'isLoading'> & {
  symbol: string;
};

export const LiveOrderBookList = ({
  symbol,
  ...rest
}: LiveOrderBookListProps) => {
  const { refetch: refetchInitialData } = useMarketOrderBook(symbol, {
    enabled: false
  });
  const { data, isLoading } = useLiveOrderBookChanges({
    symbol: symbol,
    refetchInitialData
  });

  return (
    <OrderBookList
      data={data}
      isLoading={isLoading}
      ListHeaderComponent={
        !!data ? <OrderBookSummary bids={data?.bids} asks={data?.asks} /> : null
      }
      {...rest}
    />
  );
};
