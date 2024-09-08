import { formatCrypto, formatCurrency } from '@/shared/lib';
import BigNumber from 'bignumber.js';
import { View } from 'react-native';
import { List } from 'react-native-paper';
import tw from 'twrnc';

type OrderBookSummaryProps = {
  bids: [price: string, size: string][];
  asks: [price: string, size: string][];
};

export const OrderBookSummary = ({ bids, asks }: OrderBookSummaryProps) => {
  const bidAveragePrice = formatCurrency(
    bids
      .reduce((acc, bid) => acc.plus(BigNumber(bid[0])), BigNumber(0))
      .dividedBy(bids.length)
  );
  const askAveragePrice = formatCurrency(
    asks
      .reduce((acc, ask) => acc.plus(BigNumber(ask[0])), BigNumber(0))
      .dividedBy(asks.length)
  );
  const bidTotalTradeSize = formatCrypto(
    bids.reduce((acc, bid) => acc.plus(BigNumber(bid[1])), BigNumber(0))
  );
  const askTotalTradeSize = formatCrypto(
    asks.reduce((acc, ask) => acc.plus(BigNumber(ask[1])), BigNumber(0))
  );

  return (
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
  );
};
