import { useMutation } from '@tanstack/react-query';
import invariant from 'tiny-invariant';

invariant(
  process.env.EXPO_PUBLIC_SERVER_PIN,
  'EXPO_PUBLIC_SERVER_PIN is not set'
);

export type LoginResponse = {
  accessToken: string;
};

const login = async (pin: string): Promise<LoginResponse> => {
  return new Promise((resolve, reject) => {
    if (pin === process.env.EXPO_PUBLIC_SERVER_PIN) {
      return resolve({ accessToken: 'ACCESS_TOKEN' });
    }

    reject(new Error('Invalid pin'));
  });
};

export const useLogin = (rest: Omit<typeof useMutation, 'mutationFn'>) => {
  return useMutation({
    mutationFn: login,
    ...rest
  });
};
