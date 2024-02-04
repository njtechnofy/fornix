import { useHorizontalCalendarStore } from "@/store/useHorizontalDateStore";
import { YStack } from "tamagui";

export default function NewTask() {
  const highlight = useHorizontalCalendarStore((state) => state.year);

  return <YStack flex={1}></YStack>;
}
