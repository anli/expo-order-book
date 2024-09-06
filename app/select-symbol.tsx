import tw from 'twrnc';
import { ActivityIndicator, List, Text } from 'react-native-paper';
import { View } from 'react-native';
import { useSymbols } from '@/entities/symbol';
import { Link } from 'expo-router';
import { FlatList, RefreshControl } from 'react-native-gesture-handler';

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
        renderItem={({ item }) => (
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
        )}
        keyExtractor={(item) => item.symbol}
      />
    </View>
  );
}
