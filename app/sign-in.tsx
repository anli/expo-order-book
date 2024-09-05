import { useSession } from '@/entities/session';
import { router } from 'expo-router';
import { View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

export default function SignIn() {
  const { signIn } = useSession();

  const handleSignIn = () => {
    signIn();
    router.replace('/');
  };

  return (
    <SafeAreaView style={tw`flex-1`}>
      <View style={tw`flex-1`}>
        <View style={tw`gap-4`}>
          <View pointerEvents="none">
            <TextInput
              style={tw`mx-4`}
              mode="outlined"
              label="Symbol"
              right={<TextInput.Icon icon="menu-down" />}
            />
          </View>

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
