import { Pressable, View } from 'react-native';

import { useSession } from '@/entities/session';
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Button, List, Text } from 'react-native-paper';
import { useMarketOrderBook } from '@/shared/api';
import BigNumber from 'bignumber.js';
import { groupByWholeNumber } from '@/shared/lib';
import tw from 'twrnc';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatCurrency, formatCrypto } from '@/shared/lib';
import { FlatList, RefreshControl } from 'react-native-gesture-handler';

export default function OrderBook() {
  const { signOut } = useSession();
  const params = useLocalSearchParams<{ symbol: string }>();
  const { bottom } = useSafeAreaInsets();
  const {
    data: orderBook = { bids: [], asks: [] },
    refetch,
    isLoading,
    isFetching
  } = useMarketOrderBook(params.symbol);
  const bidAveragePrice = formatCurrency(
    orderBook.bids
      .reduce((acc, bid) => acc.plus(BigNumber(bid[0])), BigNumber(0))
      .dividedBy(orderBook.bids.length)
  );
  const askAveragePrice = formatCurrency(
    orderBook.asks
      .reduce((acc, ask) => acc.plus(BigNumber(ask[0])), BigNumber(0))
      .dividedBy(orderBook.asks.length)
  );
  const bidTotalTradeSize = formatCrypto(
    orderBook.bids.reduce(
      (acc, bid) => acc.plus(BigNumber(bid[1])),
      BigNumber(0)
    )
  );
  const askTotalTradeSize = formatCrypto(
    orderBook.asks.reduce(
      (acc, ask) => acc.plus(BigNumber(ask[1])),
      BigNumber(0)
    )
  );
  const wholeNumberBids = groupByWholeNumber(orderBook.bids).toReversed();
  const wholeNumberAsks = groupByWholeNumber(orderBook.asks);
  const maxRowLength = Math.max(wholeNumberBids.length, wholeNumberAsks.length);
  const rows = Array.from({ length: maxRowLength }, (_, index) => {
    const bid = wholeNumberBids[index];
    const ask = wholeNumberAsks[index];
    return { ask, bid };
  });

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'Order Book',
          headerLeft: () => (
            <Link href="/real-time-order-book" asChild>
              <Button>Real Time</Button>
            </Link>
          ),
          headerRight: () => (
            <Pressable onPress={signOut}>
              <Button>Sign Out</Button>
            </Pressable>
          )
        }}
      />
      <FlatList
        onRefresh={refetch}
        refreshing={isFetching}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <View style={tw`m-4`}>
            {isLoading ? <ActivityIndicator /> : <Text>0 results</Text>}
          </View>
        }
        style={tw`bg-white`}
        data={rows}
        renderItem={({ item: { ask, bid } }) => (
          <View style={tw`flex flex-row gap-2 mx-4 my-1`}>
            <View style={tw`flex-1 flex-row justify-between`}>
              <Text>{formatCrypto(bid?.[1])}</Text>
              <Text style={tw`text-green-600 text-justify`}>{bid?.[0]}</Text>
            </View>
            <View style={tw`flex-1 flex-row justify-between`}>
              <Text style={tw`text-red-600 text-justify`}>{ask?.[0]}</Text>
              <Text>{formatCrypto(ask?.[1])}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={tw`pb-[${bottom}px]`}
        ListHeaderComponent={
          !isLoading ? (
            <>
              <View>
                <View style={tw`flex flex-row`}>
                  <List.Item
                    style={tw`flex-1`}
                    title={bidAveragePrice}
                    description="Average price (Bids)"
                  />

                  <List.Item
                    style={tw`flex-1`}
                    title={askAveragePrice}
                    description="Average price (Asks)"
                  />
                </View>

                <View style={tw`flex flex-row`}>
                  <List.Item
                    style={tw`flex-1 pl-0`}
                    title={bidTotalTradeSize}
                    description="Total trade size (Bids)"
                  />

                  <List.Item
                    style={tw`flex-1`}
                    title={askTotalTradeSize}
                    description="Total trade size (Asks)"
                  />
                </View>
              </View>
            </>
          ) : null
        }
      />
    </>
  );
}
