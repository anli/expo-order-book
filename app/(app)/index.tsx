import { Pressable } from 'react-native';

import { useSession } from '@/entities/session';
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { Button } from 'react-native-paper';
import tw from 'twrnc';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StaticOrderBookList } from '@/entities/order-book';

export default function OrderBook() {
  const { signOut } = useSession();
  const params = useLocalSearchParams<{ symbol: string }>();
  const { bottom } = useSafeAreaInsets();

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'Order Book',
          headerLeft: () => (
            <Link
              href={`/real-time-order-book?${new URLSearchParams({ symbol: params.symbol }).toString()}`}
              asChild>
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
      <StaticOrderBookList
        symbol={params.symbol}
        contentContainerStyle={tw`pb-[${bottom}px]`}
      />
    </>
  );
}
