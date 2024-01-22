//@ts-ignore image type
import { useHorizontalCalendarStore } from "@/components/HorizontalCalendar";
import { Loading } from "@/components/loading/Loading";
import { OrderModel } from "@/db/models_and_schemas/Order";
import { useOrders } from "@/hooks/useOrders";
import { FlashList } from "@shopify/flash-list";
import { Link } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, XStack, YStack } from "tamagui";

// const horizontalDays = ({
//   item,
// }: {
//   item: ReturnType<typeof getDaysOfPreviousMonths>[number];
// }) => (
//   <YStack position="relative">
//     <Paragraph>{item.month}</Paragraph>
//     <XStack space="$1">
//       {item.days.map((day) => {
//         return (
//           <YStack
//             padding="$2"
//             borderRadius={20}
//             backgroundColor="$backgroundStrong"
//             key={`${item.month}-${day.day}-${day.num}`}
//             justifyContent="center"
//             alignItems="center"
//             space="$1"
//           >
//             <H6 color="$gray12" fontWeight="$16">
//               {day.num}
//             </H6>
//             <SizableText size="$1" color="$gray8">
//               {day.day}
//             </SizableText>
//           </YStack>
//         );
//       })}
//     </XStack>
//   </YStack>
// );
const renderItem = ({ item }: { item: OrderModel }) => (
  <Link asChild href={`/(app)/_orders/${item.id}`}>
    <XStack
      padding="$4"
      borderRadius={20}
      marginVertical="$2"
      backgroundColor="$backgroundStrong"
      justifyContent="space-between"
    >
      <YStack>
        <Text>{item.customerName}</Text>
        <Text>{new Date(item.createdAt).getTime()}</Text>
        {/* <Text>{item.paid}</Text>
        <Text>{item.createdAt}</Text> */}
        <Text>{item.paid ? "PAID" : "UNPAID"}</Text>
      </YStack>
    </XStack>
  </Link>
);

export default function Orders() {
  const { year, month, day } = useHorizontalCalendarStore(
    (state) => state.highlight
  );

  const { orders } = useOrders({
    date: true,
  });
  const insets = useSafeAreaInsets();

  if (!orders) {
    return <Loading />;
  }
  return (
    <YStack position="relative" flex={1} paddingBottom="$12">
      <YStack position="absolute" top="$0" left="$0" height="100%" width="100%">
        <FlashList
          automaticallyAdjustKeyboardInsets
          contentContainerStyle={{
            padding: 5,
          }}
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          estimatedItemSize={120}
        />
      </YStack>
    </YStack>
  );
}
