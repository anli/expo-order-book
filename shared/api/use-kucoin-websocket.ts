import useWebSocket, { Options } from 'react-use-websocket';
import { useDevice } from '../lib';
import { useBulletPublic } from './use-bullet-public';

type UseKucoinWebSocketProps = {
  options: Options;
  enabled: boolean;
};

export const useKucoinWebSocket = <T>({
  options,
  enabled = true
}: UseKucoinWebSocketProps) => {
  const { data: bulletPublic } = useBulletPublic();
  const { data: device } = useDevice();

  return useWebSocket<T | null>(
    bulletPublic?.instanceServers[0].endpoint ?? '',
    {
      queryParams: {
        connectId: device?.deviceId ?? '',
        token: bulletPublic?.token ?? ''
      },
      heartbeat: {
        message: JSON.stringify({ type: 'ping', id: device?.deviceId }),
        returnMessage: JSON.stringify({ type: 'pong', id: device?.deviceId }),
        timeout: bulletPublic?.instanceServers[0].pingTimeout,
        interval: bulletPublic?.instanceServers[0].pingInterval
      },
      ...options
    },
    !!bulletPublic?.token && !!device?.deviceId && enabled
  );
};
