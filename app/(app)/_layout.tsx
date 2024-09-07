import { Text } from 'react-native';
import { Redirect, Stack, useLocalSearchParams } from 'expo-router';

import { useSession } from '@/entities/session';

export default function AppLayout() {
  const { session, isLoading } = useSession();
  const params = useLocalSearchParams();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Stack>
      <Stack.Screen name="index" initialParams={{ symbol: params.symbol }} />
    </Stack>
  );
}
