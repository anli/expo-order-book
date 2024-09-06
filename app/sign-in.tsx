import { useSession } from '@/entities/session';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

export default function SignIn() {
  const { signIn } = useSession();
  const params = useLocalSearchParams<{ symbol: string }>();

  const handleSignIn = () => {
    signIn();
    router.replace('/');
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
            <TextInput
              style={tw`mx-4`}
              mode="outlined"
              label="Symbol"
              right={<TextInput.Icon icon="menu-down" />}
              placeholder="Select a symbol"
              editable={false}
              value={params.symbol}
            />
          </Pressable>

          <View>
            <TextInput
              style={tw`mx-4`}
              mode="outlined"
              label="Pin"
              secureTextEntry={true}
            />
          </View>
        </View>
      </View>
      <Button style={tw`m-4`} mode="contained" onPress={handleSignIn}>
        Sign In
      </Button>
    </SafeAreaView>
  );
}
