import {
  useContext,
  createContext,
  type PropsWithChildren,
  useState,
  useMemo
} from 'react';
import { LoginResponse, useLogin } from '@/shared/api';
import { router } from 'expo-router';
import { Alert } from 'react-native';

const AuthContext = createContext<{
  signIn: (pin: string) => Promise<void>;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => Promise.resolve(),
  signOut: () => null,
  session: null,
  isLoading: false
});

export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<string | null>(null);
  const { mutate: login, isPending: isLoginLoading } = useLogin({
    onSuccess: (data: LoginResponse) => {
      setSession(data.accessToken);
      router.replace('/');
    },
    onError: (error: Error) => {
      Alert.alert(error.message);
    }
  });
  const isLoading = isLoginLoading;

  const value = useMemo(
    () => ({
      signIn: async (pin: string) => {
        login(pin);
      },
      signOut: () => {
        setSession(null);
      },
      session,
      isLoading
    }),
    [session, isLoading, login]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
