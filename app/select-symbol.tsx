import tw from 'twrnc';
import { ActivityIndicator, List, Searchbar, Text } from 'react-native-paper';
import { View, FlatList } from 'react-native';
import { CurrencySymbol, useSymbols } from '@/shared/api';
import { Link } from 'expo-router';
import { RefreshControl } from 'react-native-gesture-handler';
import { memo, useState } from 'react';

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
  const { data: symbols, isLoading, refetch } = useSymbols();
  const [search, setSearch] = useState('');
  const data = symbols?.filter((item) =>
    item.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <FlatList
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={
        !isLoading ? (
          <View>
            <Searchbar
              autoCapitalize="characters"
              autoCorrect={false}
              style={tw`m-4`}
              placeholder="Search"
              onChangeText={setSearch}
              value={search}
            />
          </View>
        ) : null
      }
      refreshControl={
        <RefreshControl refreshing={!!data && isLoading} onRefresh={refetch} />
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
  );
}
