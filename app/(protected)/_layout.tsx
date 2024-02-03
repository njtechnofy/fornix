import { syncArea } from "@/hooks/useArea";
import { useUserStore } from "@/store";
import { useHorizontalCalendarStore } from "@/store/useHorizontalDateStore";
import { Redirect, Stack } from "expo-router";

export default function ProtectedApp() {
  const user = useUserStore((state) => state.userId);
  if (!user) {
    return <Redirect href="/auth/login" />;
  }
  return <Protected />;
}

function Protected() {
  const initCalendar = useHorizontalCalendarStore((state) => state.init);
  syncArea();
  initCalendar();
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
          headerTitleAlign: "center",
          title: "Settings",
        }}
      />
    </Stack>
  );
}
