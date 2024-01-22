import { MaterialTopTabs } from "@/components/MaterialTopTabs";

import { createContext } from "react";
import { SharedValue } from "react-native-reanimated";
import { XStack, YStack } from "tamagui";

export const AnimatedContext = createContext<SharedValue<number> | null>(null);

export default function Tasks() {
  return (
    <YStack fullscreen paddingTop="$12">
      <MaterialTopTabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: "rgba(0,0,0,0)",
          },
          tabBarIndicatorStyle: {
            backgroundColor: "#205733",
          },
          tabBarItemStyle: {
            flexDirection: "row-reverse",
          },
        }}
      >
        <MaterialTopTabs.Screen
          name="index"
          options={{
            title: "All",

            tabBarIcon: () => (
              <XStack space="$1" marginVertical="auto" alignSelf="flex-start">
                <XStack
                  marginVertical="auto"
                  alignSelf="flex-start"
                  padding="$2"
                  borderRadius={20}
                  backgroundColor="$orange8"
                />
                <XStack
                  marginVertical="auto"
                  alignSelf="flex-start"
                  padding="$2"
                  borderRadius={20}
                  backgroundColor="$blue8"
                />
              </XStack>
            ),
          }}
        />
        <MaterialTopTabs.Screen
          name="unpaid"
          options={{
            title: "Unpaid",
            lazy: true,
            tabBarIcon: () => (
              <XStack
                marginVertical="auto"
                alignSelf="flex-start"
                padding="$2"
                borderRadius={20}
                backgroundColor="$orange8"
              />
            ),
          }}
        />
        <MaterialTopTabs.Screen
          name="prospect"
          options={{
            title: "Prospect",
            lazy: true,
            tabBarIcon: () => (
              <XStack
                marginVertical="auto"
                alignSelf="flex-start"
                padding="$2"
                borderRadius={20}
                backgroundColor="$blue8"
              />
            ),
          }}
        />
      </MaterialTopTabs>
    </YStack>
  );
}
