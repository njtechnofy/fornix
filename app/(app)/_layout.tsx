import { syncArea } from "@/hooks/useArea";
import { useUserStore } from "@/store";
import { useHorizontalCalendarStore } from "@/store/useHorizontalDateStore";
import { computeCalendar } from "@/utils/worklets/getCalendarWorklet";
import { Redirect, Stack } from "expo-router";
import { useEffect } from "react";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};
export default function App() {
  const userId = useUserStore((state) => state.userId);
  if (!userId) {
    return <Redirect href="/login" />;
  }

  return <ProtectedApp />;
}

function ProtectedApp() {
  const year = useHorizontalCalendarStore((state) => state.year);
  const month = useHorizontalCalendarStore((state) => state.month);
  syncArea();
  useEffect(() => {
    console.log("setting calendar");
    computeCalendar(year, month).then((days) =>
      useHorizontalCalendarStore.setState({
        calendarDays: JSON.parse(days),
      })
    );
  }, []);
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="settings"
        options={{
          headerShown: true,
          presentation: "modal",
          title: "Settings",
          headerTitleAlign: "center",
        }}
      />
    </Stack>
  );
}
