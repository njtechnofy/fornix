import { TaskList } from "@/components/CustomerWidgets";
import { CustomSuspense } from "@/components/loading/CustomSuspense";
import { Loading } from "@/components/loading/Loading";
import { useCustomers } from "@/hooks/useCustomers";
import { YStack } from "tamagui";

export default function TaskIndex() {
  const { customers } = useCustomers({ or: true });

  if (!customers) {
    return (
      <YStack flex={1}>
        <Loading />
      </YStack>
    );
  }

  return (
    <YStack flex={1}>
      <CustomSuspense
        data={customers}
        name="All Tasks"
        component={(cs) => <TaskList customers={cs} />}
      />
    </YStack>
  );
}
