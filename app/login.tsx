import { Button, Image, Paragraph, YStack } from "tamagui";

import { SafeStack } from "@/components/CustomStacks";
import { login, useUserStore } from "@/store";
import { useIsFocused } from "@react-navigation/native";
import { Redirect, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";

export default function Login() {
  const userId = useUserStore((state) => state.userId);
  const isFocused = useIsFocused();
  const theme = useColorScheme();

  if (userId) {
    return <Redirect href="/(app)/(tabs)/dashboard" />;
  }

  return (
    <SafeStack justifyContent="space-around">
      <YStack
        justifyContent="center"
        padding="$4"
        maxWidth={600}
        alignItems="center"
      >
        {theme === "dark" ? (
          <Image
            height="50%"
            width="100%"
            resizeMode="contain"
            source={require("../assets/images/fornix-white.png")}
          />
        ) : (
          <Image
            height="50%"
            width="90%"
            resizeMode="contain"
            source={require("../assets/images/fornix.png")}
          />
        )}
      </YStack>

      <YStack space="$2.5" paddingHorizontal="$4">
        <Button
          elevate
          borderWidth="$0.5"
          backgroundColor="$green9"
          color="white"
          height="$6"
          onPress={() => {
            login({
              userId: "12w31",
              userName: "Agent 1",
            });
            router.replace("/(app)/(tabs)");
          }}
        >
          LOGIN
        </Button>
        <Paragraph opacity={0.6} textAlign="center">
          Powered by Toolkt &copy;
        </Paragraph>
      </YStack>
      {isFocused && <StatusBar style="light" />}
    </SafeStack>
  );
}
