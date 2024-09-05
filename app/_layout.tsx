import { Slot } from 'expo-router';
import { SessionProvider } from '@/entities/session';
import tw, { useDeviceContext } from 'twrnc';

export default function Root() {
  useDeviceContext(tw);

  return (
    <SessionProvider>
      <Slot />
    </SessionProvider>
  );
}
