import { useSession } from '@/entities/session';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect, useState } from 'react';

type FormValues = {
  symbol: string;
  pin: string;
};

const schema = yup
  .object({
    symbol: yup.string().required('Symbol is required'),
    pin: yup.string().required('Pin is required')
  })
  .required();

export default function SignIn() {
  const { signIn, isLoading } = useSession();
  const params = useLocalSearchParams<{ symbol: string }>();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<FormValues>({
    resolver: yupResolver(schema)
  });
  const [showPin, setShowPin] = useState(false);

  useEffect(() => {
    setValue('symbol', params.symbol);
  }, [params.symbol, setValue]);

  const handleSignIn = ({ pin }: FormValues) => {
    signIn(pin);
  };

  const handlePresentSelectSymbol = () => {
    router.push('/select-symbol');
  };

  return (
    <SafeAreaView style={tw`flex-1`}>
      <View style={tw`flex-1 justify-center`}>
        <View style={tw`gap-4`}>
          <Pressable
            onPress={handlePresentSelectSymbol}
            pointerEvents="box-only">
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={tw`mx-4`}
                  mode="outlined"
                  label="Symbol"
                  right={<TextInput.Icon icon="menu-down" />}
                  placeholder="i.e. BTC-USDT"
                  editable={false}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                />
              )}
              name="symbol"
            />
            {errors.symbol && (
              <Text style={tw`mx-4 mt-1 text-red-600`} variant="bodySmall">
                {errors.symbol.message}
              </Text>
            )}
          </Pressable>

          <View>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  keyboardType="visible-password"
                  textContentType="password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={tw`mx-4`}
                  mode="outlined"
                  label="Pin"
                  secureTextEntry={!showPin}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  right={
                    !!value && (
                      <TextInput.Icon
                        icon={showPin ? 'eye-off' : 'eye'}
                        onPress={() => setShowPin((_value) => !_value)}
                      />
                    )
                  }
                />
              )}
              name="pin"
            />
            {errors.pin && (
              <Text style={tw`mx-4 mt-1 text-red-600`} variant="bodySmall">
                {errors.pin.message}
              </Text>
            )}
          </View>
        </View>
      </View>
      <Button
        disabled={isLoading}
        loading={isLoading}
        style={tw`m-4`}
        mode="contained"
        onPress={handleSubmit(handleSignIn)}>
        {!isLoading ? 'Sign In' : 'Signing In...'}
      </Button>
    </SafeAreaView>
  );
}
