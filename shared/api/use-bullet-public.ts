import { useQuery } from '@tanstack/react-query';
import invariant from 'tiny-invariant';

invariant(
  process.env.EXPO_PUBLIC_SERVER_HOST_URL,
  'EXPO_PUBLIC_SERVER_HOST_URL is not set'
);
const url = `${process.env.EXPO_PUBLIC_SERVER_HOST_URL}/v1/bullet-public`;

export type BulletPublicResponse = {
  instanceServers: [
    {
      encrypt: boolean;
      endpoint: string;
      pingInterval: number;
      pingTimeout: number;
      protocol: 'websocket';
    }
  ];
  token: string;
};

const getBulletPublic = async (): Promise<BulletPublicResponse> => {
  const response = await fetch(url, {
    method: 'POST'
  });
  const { data } = await response.json();
  return data;
};

export const useBulletPublic = () => {
  return useQuery({
    queryKey: ['bullet-public'],
    queryFn: getBulletPublic
  });
};
