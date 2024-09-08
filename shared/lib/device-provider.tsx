import * as Application from 'expo-application';
import { Platform } from 'react-native';
import {
  useContext,
  createContext,
  type PropsWithChildren,
  useState,
  useMemo,
  useEffect
} from 'react';

const Context = createContext<{
  data: { deviceId: string | null };
}>({
  data: { deviceId: null }
});

export const useDevice = () => {
  const value = useContext(Context);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useDevice must be wrapped in a <DeviceProvider />');
    }
  }

  return value;
};

export const DeviceProvider = ({ children }: PropsWithChildren) => {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const value = useMemo(() => ({ data: { deviceId } }), [deviceId]);

  useEffect(() => {
    const initialize = async () => {
      switch (Platform.OS) {
        case 'ios':
          return setDeviceId(await Application.getIosIdForVendorAsync());
        case 'android':
          return setDeviceId(Application.getAndroidId());
        default:
          return setDeviceId(null);
      }
    };

    initialize();
  }, []);

  return <Context.Provider value={value}>{children}</Context.Provider>;
};
