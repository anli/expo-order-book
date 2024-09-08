import { Stack } from 'expo-router';
import { SessionProvider } from '@/entities/session';
import tw, { useDeviceContext } from 'twrnc';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DeviceProvider } from '@/shared/lib';

const queryClient = new QueryClient();

export default function Root() {
  useDeviceContext(tw);

  return (
    <GestureHandlerRootView style={tw`flex-1`}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <DeviceProvider>
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
          </DeviceProvider>
        </SessionProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
