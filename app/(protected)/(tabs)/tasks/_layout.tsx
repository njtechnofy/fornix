import { HorizontalCalendar } from "@/components/HorizontalCalendar";
import { SwipeableRow } from "@/components/SwipeableRow";
import { CustomSuspense } from "@/components/loading/CustomSuspense";
import { TaskModel } from "@/db/models_and_schemas/Tasks";
import { useTasks } from "@/hooks/useTasks";
import { FlashList } from "@shopify/flash-list";
import { Trash2 } from "@tamagui/lucide-icons";
import { Slot, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { H6, Paragraph, YStack } from "tamagui";

const TASK_HEIGHT = 100;

const RenderTask = ({ item }: { item: TaskModel }) => {
  return (
    <SwipeableRow
      rightActions={[
        {
          text: <Trash2 color="white" />,
          color: "$red10",
          onPress: () => {
            item.softDelete();
          },
        },
      ]}
    >
      <YStack
        backgroundColor="$backgroundStrong"
        padding="$4"
        borderRadius={8}
        marginVertical="$2"
        justifyContent="center"
        height={TASK_HEIGHT}
      >
        <H6>{item.taskName}</H6>
        <Paragraph>{item.customerName}</Paragraph>
        <Paragraph>{new Date(item.expectedAt).toLocaleTimeString()}</Paragraph>
        {item.isDeleted ? <Paragraph>DELETED</Paragraph> : null}
      </YStack>
    </SwipeableRow>
  );
};

export default function Tasks() {
  const tasks = useTasks({ forCalendar: false });
  const insets = useSafeAreaInsets();
  const router = useRouter();
  return (
    <>
      <CustomSuspense
        name="Tasks"
        data={tasks}
        component={(tasks) => (
          <YStack position="relative" fullscreen paddingTop={insets.top + 50}>
            <HorizontalCalendar />
            <YStack flex={1}>
              <FlashList
                contentContainerStyle={{
                  paddingHorizontal: 5,
                  paddingBottom: 80,
                }}
                renderItem={RenderTask}
                estimatedItemSize={TASK_HEIGHT}
                data={tasks}
                keyExtractor={(item) => item.id}
              />
            </YStack>
          </YStack>
        )}
      />
      <Slot />
    </>
  );
}
