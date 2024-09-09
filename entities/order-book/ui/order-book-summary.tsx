import { formatCrypto, formatCurrency } from '@/shared/lib';
import { View } from 'react-native';
import { List } from 'react-native-paper';
import tw from 'twrnc';

type OrderBookSummaryProps = {
  bidAveragePrice: string;
  askAveragePrice: string;
  bidTotalTradeSize: string;
  askTotalTradeSize: string;
};

export const OrderBookSummary = ({
  bidAveragePrice,
  askAveragePrice,
  bidTotalTradeSize,
  askTotalTradeSize
}: OrderBookSummaryProps) => {
  return (
    <View>
      <View style={tw`flex flex-row`}>
        <List.Item
          style={tw`flex-1`}
          title={formatCurrency(bidAveragePrice)}
          description="Average price (Bids)"
        />

        <List.Item
          style={tw`flex-1`}
          title={formatCurrency(askAveragePrice)}
          description="Average price (Asks)"
        />
      </View>

      <View style={tw`flex flex-row`}>
        <List.Item
          style={tw`flex-1 pl-0`}
          title={formatCrypto(bidTotalTradeSize)}
          description="Total trade size (Bids)"
        />

        <List.Item
          style={tw`flex-1`}
          title={formatCrypto(askTotalTradeSize)}
          description="Total trade size (Asks)"
        />
      </View>
    </View>
  );
};
