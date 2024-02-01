import { HorizontalCalendar } from "@/components/HorizontalCalendar";
import { SwipeableRow } from "@/components/SwipeableRow";
import { CustomSuspense } from "@/components/loading/CustomSuspense";
import { TaskModel } from "@/db/models_and_schemas/Tasks";
import { useTasks } from "@/hooks/useTasks";
import { FlashList } from "@shopify/flash-list";
import { Plus, Trash2 } from "@tamagui/lucide-icons";
import { Button, H6, Paragraph, YStack } from "tamagui";

const TASK_HEIGHT = 100;

const RenderTask = ({ item }: { item: TaskModel }) => {
  return (
    <SwipeableRow
      rightActions={[
        {
          text: <Trash2 color="white" />,
          color: "$red10",
          onPress: () => {
            console.log("deleted");
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
      </YStack>
    </SwipeableRow>
  );
};

export default function Tasks() {
  const tasks = useTasks({ forCalendar: false });

  return (
    <YStack position="relative" fullscreen paddingTop="$13">
      <HorizontalCalendar />
      <YStack flex={1}>
        <CustomSuspense
          data={tasks}
          name="tasks"
          component={(_tasks) => {
            return (
              <FlashList
                contentContainerStyle={{
                  paddingHorizontal: 5,
                  paddingBottom: 80,
                }}
                renderItem={RenderTask}
                estimatedItemSize={TASK_HEIGHT}
                data={_tasks}
                keyExtractor={(item) => item.id}
              />
            );
          }}
        />
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
