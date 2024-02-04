import { MaterialTopTabs } from "@/components/MaterialTopTabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function History() {
  const insets = useSafeAreaInsets();
  return (
    <MaterialTopTabs
      style={{
        paddingTop: insets.top + 50,
      }}
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
  );
}
