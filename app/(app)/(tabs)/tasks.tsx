import { HorizontalCalendar } from "@/components/HorizontalCalendar";
import { Plus } from "@tamagui/lucide-icons";
import { Button, YStack } from "tamagui";

export default function Tasks() {
  return (
    <YStack position="relative" fullscreen paddingTop="$13">
      <HorizontalCalendar />
      <YStack backgroundColor="$gray3" flex={1}>
        {/* <FlashList /> */}
      </YStack>
      <Button
        borderRadius={100}
        height="$5"
        width="$5"
        position="absolute"
        bottom="$12"
        right="$2"
        elevate
      >
        <Plus />
      </Button>
    </YStack>
  );
}
