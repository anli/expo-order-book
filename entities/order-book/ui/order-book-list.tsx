import { ActivityIndicator, List, Text } from 'react-native-paper';
import { SectionList, SectionListProps, View } from 'react-native';
import tw from 'twrnc';
import { OrderBook } from '@/shared/api';
import { memo } from 'react';
import { formatCrypto, formatCurrency } from '@/shared/lib';

type Item = [string, string];

const RowItem = ({
  price,
  size,
  type
}: {
  price: string;
  size: string;
  type: 'Bids' | 'Asks';
}) => {
  return (
    <List.Item
      title={formatCurrency(price)}
      right={() => (
        <Text
          style={tw.style(
            'text-justify',
            type === 'Bids' ? 'text-green-600' : 'text-red-600'
          )}>
          {formatCrypto(size)}
        </Text>
      )}
    />
  );
};

const MemoRowItem = memo(RowItem);

export type OrderBookListProps = Omit<
  SectionListProps<Item>,
  'renderItem' | 'sections' | 'hitSlop'
> & {
  isLoading: boolean;
  data?: OrderBook;
};

export const OrderBookList = ({
  data,
  isLoading,
  ...rest
}: OrderBookListProps) => {
  const sections = data
    ? [
        {
          title: 'Bids',
          data: data?.bids
        },
        {
          title: 'Asks',
          data: data?.asks
        }
      ]
    : [];
  return (
    <SectionList
      keyExtractor={([price]) => price}
      sections={sections}
      renderSectionHeader={({ section: { title, data } }) => (
        <List.Subheader
          style={tw`bg-white`}>{`${title} (${data.length})`}</List.Subheader>
      )}
      ListEmptyComponent={
        <View style={tw`m-4`}>{isLoading && <ActivityIndicator />}</View>
      }
      style={tw`bg-white`}
      renderItem={({ item: [price, size], section: { title } }) => (
        <MemoRowItem price={price} size={size} type={title} />
      )}
      {...rest}
    />
  );
};
