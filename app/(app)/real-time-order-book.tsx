import { Stack } from 'expo-router';
import { Text } from 'react-native-paper';

export default function RealTimeOrderBook() {
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'Real Time'
        }}
      />
      <Text>Real Time Order Book</Text>
    </>
  );
}
