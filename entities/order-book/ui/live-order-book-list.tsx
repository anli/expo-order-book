import { useMarketOrderBook } from '@/shared/api';
import { OrderBookSummary } from './order-book-summary';
import { useLiveOrderBookChanges } from '../model/use-live-order-book-changes';
import { OrderBookList, OrderBookListProps } from './order-book-list';
import { memo } from 'react';

type LiveOrderBookListProps = Omit<OrderBookListProps, 'isLoading'> & {
  symbol: string;
};

const MemoOrderBookSummary = memo(OrderBookSummary);

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
      data={data?.orderBook}
      isLoading={isLoading}
      ListHeaderComponent={
        !!data?.summary ? (
          <MemoOrderBookSummary
            bidAveragePrice={data.summary?.bidAveragePrice}
            askAveragePrice={data.summary?.askAveragePrice}
            bidTotalTradeSize={data.summary?.bidTotalTradeSize}
            askTotalTradeSize={data.summary?.askTotalTradeSize}
          />
        ) : null
      }
      {...rest}
    />
  );
};
