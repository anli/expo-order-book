import { useMarketOrderBook } from '@/shared/api';
import { OrderBookList, OrderBookListProps } from './order-book-list';
import { RefreshControl } from 'react-native-gesture-handler';
import { OrderBookSummary } from './order-book-summary';

type StaticOrderBookListProps = Omit<OrderBookListProps, 'isLoading'> & {
  symbol: string;
};

export const StaticOrderBookList = ({
  symbol,
  ...rest
}: StaticOrderBookListProps) => {
  const { data, refetch, isLoading, isFetching } = useMarketOrderBook(symbol);

  return (
    <OrderBookList
      onRefresh={refetch}
      refreshing={isFetching}
      refreshControl={
        <RefreshControl refreshing={isFetching} onRefresh={refetch} />
      }
      data={data}
      isLoading={isLoading}
      ListHeaderComponent={
        !!data ? <OrderBookSummary bids={data?.bids} asks={data?.asks} /> : null
      }
      {...rest}
    />
  );
};
