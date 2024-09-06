import tw from 'twrnc';
import { ActivityIndicator, List, Text } from 'react-native-paper';
import { View } from 'react-native';
import { CurrencySymbol, useSymbols } from '@/shared/api';
import { Link } from 'expo-router';
import { FlatList, RefreshControl } from 'react-native-gesture-handler';
import { memo } from 'react';

const MemoItem = memo(function MemoItem({ item }: { item: CurrencySymbol }) {
  return (
    <Link
      href={{
        pathname: '/sign-in',
        params: { symbol: item.symbol }
      }}
      asChild>
      <List.Item
        title={item.symbol}
        right={(props) => <List.Icon {...props} icon="chevron-right" />}
      />
    </Link>
  );
});

export default function SelectSymbol() {
  const { data, isLoading, refetch } = useSymbols();

  return (
    <View style={tw`flex-1`}>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={!!data && isLoading}
            onRefresh={refetch}
          />
        }
        ListEmptyComponent={
          <View style={tw`m-4`}>
            {isLoading ? <ActivityIndicator /> : <Text>0 results</Text>}
          </View>
        }
        data={data}
        renderItem={({ item }) => <MemoItem item={item} />}
        keyExtractor={(item) => item.symbol}
      />
    </View>
  );
}
