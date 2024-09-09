import { ActivityIndicator, Text } from 'react-native-paper';
import { FlatListProps, View } from 'react-native';
import tw from 'twrnc';
import { FlatList } from 'react-native-gesture-handler';
import {
  compareNumericString,
  formatCrypto,
  groupByWholeNumber
} from '@/shared/lib';
import { OrderBook } from '@/shared/api';
import { memo } from 'react';

type Item = { ask: [string, string]; bid: [string, string] };

const RowItem = ({
  bidPrice,
  bidSize,
  askPrice,
  askSize
}: {
  bidPrice: string;
  bidSize: string;
  askPrice: string;
  askSize: string;
}) => {
  return (
    <View style={tw`flex flex-row gap-2 mx-4 my-1`}>
      <View style={tw`flex-1 flex-row justify-between`}>
        <Text>{formatCrypto(bidSize)}</Text>
        <Text style={tw`text-green-600 text-justify`}>{bidPrice}</Text>
      </View>
      <View style={tw`flex-1 flex-row justify-between`}>
        <Text style={tw`text-red-600 text-justify`}>{askPrice}</Text>
        <Text>{formatCrypto(askSize)}</Text>
      </View>
    </View>
  );
};

const MemoRowItem = memo(RowItem);

export type OrderBookWholeNumberListProps = Omit<
  FlatListProps<Item>,
  'renderItem' | 'data' | 'hitSlop'
> & {
  isLoading: boolean;
  data?: OrderBook;
};

export const OrderBookWholeNumberList = ({
  data,
  isLoading,
  ...rest
}: OrderBookWholeNumberListProps) => {
  const { bids = [], asks = [] } = data ?? {};
  const wholeNumberBids = groupByWholeNumber(
    bids.sort(([priceA], [priceB]) => compareNumericString(priceA, priceB))
  );
  const wholeNumberAsks = groupByWholeNumber(
    asks.sort(([priceA], [priceB]) => compareNumericString(priceA, priceB))
  );
  const maxRowLength = Math.max(wholeNumberBids.length, wholeNumberAsks.length);
  const rows = Array.from({ length: maxRowLength }, (_, index) => {
    const bid = wholeNumberBids[index];
    const ask = wholeNumberAsks[index];
    return { ask, bid };
  });

  return (
    <FlatList
      data={rows}
      ListEmptyComponent={
        <View style={tw`m-4`}>
          {isLoading ? <ActivityIndicator /> : <Text>0 results</Text>}
        </View>
      }
      style={tw`bg-white`}
      renderItem={({ item: { ask, bid } }) => (
        <MemoRowItem
          bidPrice={bid?.[0]}
          bidSize={bid?.[1]}
          askPrice={ask?.[0]}
          askSize={ask?.[1]}
        />
      )}
      {...rest}
    />
  );
};
