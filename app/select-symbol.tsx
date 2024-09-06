import tw from 'twrnc';
import { List } from 'react-native-paper';
import { FlatList, View } from 'react-native';
import { useSymbols } from '@/entities/symbol';
import { Link } from 'expo-router';

export default function SelectSymbol() {
  const { data } = useSymbols();

  return (
    <View style={tw`flex-1`}>
      <FlatList
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
