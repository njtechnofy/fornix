import { Loading } from "@/components/loading/Loading";
import { InvoiceModel } from "@/db/models_and_schemas/Invoice";
import { useInvoices } from "@/hooks/useInvoices";
import { moneyFormatter } from "@/utils/tools";
import { FlashList } from "@shopify/flash-list";
import { Link } from "expo-router";
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
const renderItem = ({ item }: { item: InvoiceModel }) => (
  <Link asChild href={`/_invoices/${item.id}`}>
    <XStack
      padding="$4"
      borderRadius={20}
      marginVertical="$2"
      backgroundColor="$backgroundStrong"
      justifyContent="space-between"
    >
      <YStack>
        <Text>{item.id}</Text>
        <Text>{item.customerName}</Text>
        <Text>{new Date(item.createdAt).toLocaleTimeString()}</Text>
        <Text>{moneyFormatter.format(item.paidAmount)}</Text>
        {/* <Text>{item.paid}</Text>
        <Text>{item.createdAt}</Text> */}
      </YStack>
    </XStack>
  </Link>
);

export default function Invoices() {
  const { invoices } = useInvoices({ date: true });

  if (!invoices) {
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
          data={invoices}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          estimatedItemSize={120}
        />
      </YStack>
    </YStack>
  );
}
