import { useMarketOrderBook } from '@/shared/api';
import {
  OrderBookWholeNumberListProps,
  OrderBookWholeNumberList
} from './order-book-whole-number-list';
import { RefreshControl } from 'react-native-gesture-handler';
import { OrderBookSummary } from './order-book-summary';
import { getSummary } from '../model/get-summary';

type StaticOrderBookListProps = Omit<
  OrderBookWholeNumberListProps,
  'isLoading'
> & {
  symbol: string;
};

export const StaticOrderBookList = ({
  symbol,
  ...rest
}: StaticOrderBookListProps) => {
  const { data, refetch, isLoading, isFetching } = useMarketOrderBook(symbol);
  const { averagePrice: bidAveragePrice, totalSize: bidTotalTradeSize } =
    getSummary(data?.bids);
  const { averagePrice: askAveragePrice, totalSize: askTotalTradeSize } =
    getSummary(data?.asks);

  return (
    <OrderBookWholeNumberList
      onRefresh={refetch}
      refreshing={isFetching}
      refreshControl={
        <RefreshControl refreshing={isFetching} onRefresh={refetch} />
      }
      data={data}
      isLoading={isLoading}
      ListHeaderComponent={
        !!data ? (
          <OrderBookSummary
            askAveragePrice={askAveragePrice}
            bidAveragePrice={bidAveragePrice}
            askTotalTradeSize={askTotalTradeSize}
            bidTotalTradeSize={bidTotalTradeSize}
          />
        ) : null
      }
      {...rest}
    />
  );
};
