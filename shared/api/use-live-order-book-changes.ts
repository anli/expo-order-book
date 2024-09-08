import { useDevice } from '@/shared/lib';
import { useEffect, useRef, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import * as Crypto from 'expo-crypto';
import { QueryObserverResult } from '@tanstack/react-query';
import { OrderBook } from './use-market-order-book';
import { useBulletPublic } from './use-bullet-public';

const messageId = Crypto.randomUUID();

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

const getUpdatedPriceSize = (
  changes: [price: string, size: string, sequence: string][],
  current: [price: string, size: string][],
  sequence: string
) => {
  return changes.reduce<[price: string, size: string][]>(
    (acc, [askChangePrice, askChangeSize, askChangeSequence]) => {
      if (askChangeSequence <= sequence) {
        return acc;
      }

      const matchingIndex = acc.findIndex(
        ([price]) => askChangePrice === price
      );
      if (matchingIndex >= 0) {
        if (askChangeSize === '0') {
          return acc.toSpliced(matchingIndex, 1);
        }

        acc[matchingIndex][1] = askChangeSize;
        return acc;
      }

      return [...acc, [askChangePrice, askChangeSize]];
    },
    [...current]
  );
};

type UseLiveOrderBookChangesProps = {
  symbol: string;
  refetchInitialData: () => Promise<QueryObserverResult<OrderBook, Error>>;
  throttleMs?: number;
  limit?: number;
};

export const useLiveOrderBookChanges = ({
  symbol,
  refetchInitialData,
  throttleMs = 10000,
  limit = 100
}: UseLiveOrderBookChangesProps) => {
  const messagesRef = useRef<MarketDataChange['data']['changes'][]>([]);
  const dataRef = useRef<OrderBook | undefined>();
  const [data, setData] = useState<OrderBook | undefined>();
  const { data: bulletPublic } = useBulletPublic();
  const { data: device } = useDevice();
  const topic = `/market/level2:${symbol}`;
  const { sendJsonMessage, readyState } = useWebSocket<MarketDataChange | null>(
    bulletPublic?.instanceServers[0].endpoint ?? '',
    {
      queryParams: {
        connectId: device?.deviceId ?? '',
        token: bulletPublic?.token ?? ''
      },
      heartbeat: {
        message: JSON.stringify({ type: 'ping', id: device?.deviceId }),
        returnMessage: JSON.stringify({ type: 'pong', id: device?.deviceId }),
        timeout: bulletPublic?.instanceServers[0].pingTimeout,
        interval: bulletPublic?.instanceServers[0].pingInterval
      },
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
    !!bulletPublic?.token && !!device?.deviceId && !!symbol
  );
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
    const interval = setInterval(() => {
      if (!!dataRef.current) {
        const processMessages = messagesRef.current.splice(0);
        dataRef.current = {
          ...dataRef.current,
          bids: getUpdatedPriceSize(
            processMessages.flatMap((message) => message.bids),
            dataRef.current.bids,
            dataRef.current.sequence
          ).slice(-limit),
          asks: getUpdatedPriceSize(
            processMessages.flatMap((message) => message.asks),
            dataRef.current.asks,
            dataRef.current.sequence
          ).slice(-limit)
        };
      }
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [limit]);

  useEffect(() => {
    const initialize = async () => {
      const initialData = await refetchInitialData();
      dataRef.current = initialData.data;
      setData(dataRef.current);
    };
    initialize();
  }, [refetchInitialData]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(dataRef.current);
    }, throttleMs);

    return () => {
      clearInterval(interval);
    };
  }, [throttleMs]);

  return { data, isLoading: !data };
};
