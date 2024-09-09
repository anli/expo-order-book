import { useEffect, useRef, useState } from 'react';
import { ReadyState } from 'react-use-websocket';
import * as Crypto from 'expo-crypto';
import { QueryObserverResult } from '@tanstack/react-query';
import { OrderBook, useKucoinWebSocket } from '@/shared/api';
import { getUpdatedPriceSize } from './get-updated-price-size';
import { getSummary } from './get-summary';
import BigNumber from 'bignumber.js';

const messageId = Crypto.randomUUID();
const processMessagesMs = 500;

type MarketDataChange = {
  topic: string;
  data: {
    changes: {
      asks: [price: string, size: string, sequence: string][];
      bids: [price: string, size: string, sequence: string][];
    };
    sequenceEnd: string;
    sequenceStart: string;
    symbol: string;
    time: string;
  };
};

type OrderbookSummary = {
  bidAveragePrice: string;
  askAveragePrice: string;
  bidTotalTradeSize: string;
  askTotalTradeSize: string;
};

type UseLiveOrderBookChangesProps = {
  symbol: string;
  refetchInitialData: () => Promise<QueryObserverResult<OrderBook, Error>>;
  orderBookIntervalMs?: number;
  summaryIntervalMs?: number;
  limit?: number;
};

type Data = {
  orderBook?: OrderBook;
  summary?: OrderbookSummary;
};

export const useLiveOrderBookChanges = ({
  symbol,
  refetchInitialData,
  orderBookIntervalMs = 2000,
  summaryIntervalMs = 20000,
  limit = 1000
}: UseLiveOrderBookChangesProps) => {
  const messagesRef = useRef<MarketDataChange['data']['changes'][]>([]);
  const orderBookRef = useRef<OrderBook | undefined>();
  const [data, setData] = useState<Data | undefined>();
  const topic = `/market/level2:${symbol}`;
  const { sendJsonMessage, readyState } = useKucoinWebSocket<MarketDataChange>({
    options: {
      onMessage: ({ data }: MessageEvent<string>) => {
        try {
          const messageJson = JSON.parse(data);

          if (messageJson?.topic === topic) {
            messagesRef.current.push(
              (messageJson as MarketDataChange).data.changes
            );
          }
        } catch (error) {
          console.error('useWebSocket.onMessage', { error, data });
        }
      },
      filter: () => false
    },
    enabled: !!symbol
  });
  const canSendMessages = readyState === ReadyState.OPEN;

  useEffect(() => {
    if (canSendMessages) {
      sendJsonMessage({
        id: messageId,
        type: 'subscribe',
        topic,
        response: true
      });

      return () => {
        sendJsonMessage({
          id: messageId,
          type: 'unsubscribe',
          topic
        });
      };
    }
  }, [canSendMessages, sendJsonMessage, topic]);

  useEffect(() => {
    const processMessageInterval = setInterval(() => {
      if (!!orderBookRef.current) {
        const processMessages = messagesRef.current.splice(0);
        orderBookRef.current = {
          ...orderBookRef.current,
          bids: getUpdatedPriceSize(
            processMessages.flatMap((message) => message.bids),
            orderBookRef.current.bids,
            orderBookRef.current.sequence
          )
            .filter(([_, size]) => BigNumber(size).gt(0))
            .slice(-limit),
          asks: getUpdatedPriceSize(
            processMessages.flatMap((message) => message.asks),
            orderBookRef.current.asks,
            orderBookRef.current.sequence
          )
            .filter(([_, size]) => BigNumber(size).gt(0))
            .slice(-limit)
        };
      }
    }, processMessagesMs);

    return () => {
      clearInterval(processMessageInterval);
    };
  }, [limit]);

  useEffect(() => {
    const initialize = async () => {
      const initialData = await refetchInitialData();
      orderBookRef.current = initialData.data;
      const { averagePrice: bidAveragePrice, totalSize: bidTotalTradeSize } =
        getSummary(initialData.data?.bids);
      const { averagePrice: askAveragePrice, totalSize: askTotalTradeSize } =
        getSummary(initialData.data?.asks);
      setData({
        summary: {
          bidAveragePrice,
          askAveragePrice,
          bidTotalTradeSize,
          askTotalTradeSize
        },
        orderBook: initialData.data
      });
    };
    initialize();
  }, [refetchInitialData]);

  useEffect(() => {
    const orderBookUpdateInterval = setInterval(() => {
      setData((_data) => ({ ..._data, orderBook: orderBookRef.current }));
    }, orderBookIntervalMs);

    return () => {
      clearInterval(orderBookUpdateInterval);
    };
  }, [orderBookIntervalMs]);

  useEffect(() => {
    const summaryUpdateInterval = setInterval(() => {
      setData((_data) => {
        const { averagePrice: bidAveragePrice, totalSize: bidTotalTradeSize } =
          getSummary(_data?.orderBook?.bids);
        const { averagePrice: askAveragePrice, totalSize: askTotalTradeSize } =
          getSummary(_data?.orderBook?.asks);

        return {
          ..._data,
          summary: {
            bidAveragePrice,
            askAveragePrice,
            bidTotalTradeSize,
            askTotalTradeSize
          }
        };
      });
    }, summaryIntervalMs);

    return () => {
      clearInterval(summaryUpdateInterval);
    };
  }, [summaryIntervalMs]);

  return { data, isLoading: !data };
};
