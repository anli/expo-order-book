import { Stack, useLocalSearchParams } from 'expo-router';
import tw from 'twrnc';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LiveOrderBookList } from '@/entities/order-book';

export default function RealTimeOrderBook() {
  const params = useLocalSearchParams<{ symbol: string }>();
  const { bottom } = useSafeAreaInsets();

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'Real Time'
        }}
      />
      <LiveOrderBookList
        symbol={params.symbol}
        contentContainerStyle={tw`pb-[${bottom}px]`}
      />
    </>
  );
}
