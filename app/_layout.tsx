import { Stack } from 'expo-router';
import { SessionProvider } from '@/entities/session';
import tw, { useDeviceContext } from 'twrnc';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function Root() {
  useDeviceContext(tw);

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            headerBackTitle: 'Back'
          }}>
          <Stack.Screen name="sign-in" />
          <Stack.Screen
            name="select-symbol"
            options={{
              headerShown: true,
              title: 'Select Symbol',
              presentation: 'modal'
            }}
          />
        </Stack>
      </SessionProvider>
    </QueryClientProvider>
  );
}
