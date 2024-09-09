import {
  useContext,
  createContext,
  type PropsWithChildren,
  useState,
  useMemo
} from 'react';
import { LoginResponse, useLogin } from '@/shared/api';

const AuthContext = createContext<{
  signIn: (pin: string) => Promise<LoginResponse | void>;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => Promise.resolve(),
  signOut: () => null,
  session: null,
  isLoading: false
});

export const useSession = () => {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
};

export const SessionProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<string | null>(null);
  const { mutateAsync: login, isPending: isLoginLoading } = useLogin({
    onSuccess: (data: LoginResponse) => {
      setSession(data.accessToken);
    }
  });
  const isLoading = isLoginLoading;

  const value = useMemo(
    () => ({
      signIn: (pin: string) => login(pin),
      signOut: () => {
        setSession(null);
      },
      session,
      isLoading
    }),
    [session, isLoading, login]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
