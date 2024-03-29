import BottomSheet from "@gorhom/bottom-sheet";
import { useTheme } from "@tamagui/core";
import { X } from "@tamagui/lucide-icons";
import { Stack, useRouter } from "expo-router";
import { useCallback, useMemo, useRef } from "react";
import { Button } from "tamagui";

export default function Layout() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const theme = useTheme();
  const router = useRouter();

  const snapPoints = useMemo(() => ["75%"], []); // "25%", "50%", "75%"

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose={true}
      onClose={() => router.push(`/tasks/`)} // TODO: Workaround
      style={{
        shadowColor: theme.color.val,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        backgroundColor: theme.background.val,
      }}
      handleIndicatorStyle={{
        backgroundColor: theme.color.val,
      }}
      handleStyle={{
        backgroundColor: theme.background.val,
      }}
      backgroundStyle={{ backgroundColor: theme.background.val }}
    >
      <Stack
        screenOptions={{
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerRight: () => (
            <Button
              icon={<X size="$1.5" />}
              onPress={() => {
                bottomSheetRef.current?.close();
              }}
              unstyled
              color="$gray10"
            />
          ),
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "New Task",
          }}
        />
      </Stack>
    </BottomSheet>
  );
}
