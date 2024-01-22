import { syncArea } from "@/hooks/useArea";
import { useUserStore } from "@/store";
import { Redirect, Stack } from "expo-router";

export default function App() {
  const userId = useUserStore((state) => state.userId);
  if (!userId) {
    return <Redirect href="/login" />;
  }

  return <ProtectedApp />;
}

function ProtectedApp() {
  syncArea();

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
