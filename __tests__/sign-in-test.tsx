import { render, userEvent, waitFor } from '@testing-library/react-native';
import expoRouter from 'expo-router';

import SignInRoute from '@/app/sign-in';
import invariant from 'tiny-invariant';
import { TestingProvider } from '@/shared/testing';
import { Alert } from 'react-native';

invariant(
  process.env.EXPO_PUBLIC_SERVER_PIN,
  'EXPO_PUBLIC_SERVER_PIN is not set'
);

const correctPin = process.env.EXPO_PUBLIC_SERVER_PIN;

jest.useFakeTimers();

const SignInRouteWithProvider = () => (
  <TestingProvider>
    <SignInRoute />
  </TestingProvider>
);

describe('Given I am at Sign In route', () => {
  it('Then I should see correct UI', () => {
    jest.spyOn(expoRouter, 'useLocalSearchParams').mockReturnValue({});
    const { getByText, getByLabelText } = render(<SignInRouteWithProvider />);

    getByLabelText('Symbol');
    getByLabelText('Pin');
    getByText('Sign In');
  });

  it('When I press Sign In, Then I should see validation errors', async () => {
    jest.spyOn(expoRouter, 'useLocalSearchParams').mockReturnValue({});
    const { getByText, findByText } = render(<SignInRouteWithProvider />);
    const user = userEvent.setup();

    await user.press(getByText('Sign In'));

    await findByText('Symbol is required');
    await findByText('Pin is required');
  });

  it('When I update form with correct input, And I press Sign In, Then I should be authenticated', async () => {
    jest
      .spyOn(expoRouter, 'useLocalSearchParams')
      .mockReturnValue({ symbol: 'BTC-USDT' });
    jest.spyOn(expoRouter.router, 'replace');
    const { getByText, getByLabelText } = render(<SignInRouteWithProvider />);
    const user = userEvent.setup();

    await user.type(getByLabelText('Pin'), correctPin);
    await user.press(getByText('Sign In'));

    await waitFor(() =>
      expect(expoRouter.router.replace).toHaveBeenCalledWith({
        pathname: '/',
        params: { symbol: 'BTC-USDT' }
      })
    );
  });

  it('When I update form with incorrect pin, And I press Sign In, Then I should see error message', async () => {
    jest.spyOn(Alert, 'alert');
    jest
      .spyOn(expoRouter, 'useLocalSearchParams')
      .mockReturnValue({ symbol: 'BTC-USDT' });
    jest.spyOn(expoRouter.router, 'replace');
    const { getByText, getByLabelText } = render(<SignInRouteWithProvider />);
    const user = userEvent.setup();

    await user.type(getByLabelText('Pin'), 'INCORRECT_PIN');
    await user.press(getByText('Sign In'));

    await waitFor(() =>
      expect(Alert.alert).toHaveBeenCalledWith('Invalid pin')
    );
    expect(expoRouter.router.replace).toHaveBeenCalledTimes(0);
  });
});
