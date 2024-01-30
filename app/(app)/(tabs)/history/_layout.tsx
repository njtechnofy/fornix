import { HorizontalCalendar } from "@/components/HorizontalCalendar";
import { MaterialTopTabs } from "@/components/MaterialTopTabs";
import { useHorizontalCalendarStore } from "@/store/useHorizontalDateStore";
import { YStack } from "tamagui";

export default function History() {
  const highlight = useHorizontalCalendarStore((state) => state.highlight);

  return (
    <YStack fullscreen paddingTop="$13">
      <HorizontalCalendar />
      <MaterialTopTabs
        sceneContainerStyle={{
          flex: 1,
        }}
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
      />
    </YStack>
  );
}
