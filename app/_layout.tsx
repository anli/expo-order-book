import { ErrorBoundaryProps, Stack } from 'expo-router';
import { SessionProvider } from '@/entities/session';
import tw, { useDeviceContext } from 'twrnc';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DeviceProvider } from '@/shared/lib';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';

const queryClient = new QueryClient();

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  useDeviceContext(tw);

  return (
    <View style={tw`flex-1 justify-center items-center p-4 bg-red-100`}>
      <Text style={tw`text-xl font-bold mb-4 text-red-700`}>
        Oops! Something went wrong.
      </Text>
      <Text style={tw`text-base mb-6 text-center text-red-600`}>
        {error.message}
      </Text>
      <Button
        mode="contained"
        onPress={retry}
        style={tw`text-lg font-semibold text-blue-600 underline`}>
        Try Again
      </Button>
    </View>
  );
}

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
              <Stack.Screen name="sign-in" initialParams={{}} />
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
