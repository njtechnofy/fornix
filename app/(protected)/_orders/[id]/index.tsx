import { Loading } from "@/components/loading/Loading";
import { InvoiceModel } from "@/db/models_and_schemas/Invoice";
import { useInvoices } from "@/hooks/useInvoices";
import { moneyFormatter } from "@/utils/tools";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams } from "expo-router";
import { Paragraph, XStack, YStack } from "tamagui";

export default function InvoiceData() {
  const database = useDatabase();
  const { id } = useLocalSearchParams<{ id: string }>();
  if (!id) {
    throw new Error(`Order with the ID: ${id} does not exist`);
  }
  const { invoices } = useInvoices({
    orderId: id,
  });

  const renderItem = ({ item }: { item: InvoiceModel }) => (
    <XStack
      padding="$4"
      borderRadius={20}
      marginVertical="$2"
      backgroundColor="$gray3"
      justifyContent="space-between"
    >
      <YStack width="100%">
        <Paragraph marginBottom="$1" color="$gray10">
          {item.id}
        </Paragraph>
        <Paragraph>
          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
        </Paragraph>
        <Paragraph alignSelf="flex-end">
          {moneyFormatter.format(item.paidAmount ?? 0)}
        </Paragraph>
      </YStack>
    </XStack>
  );
  if (!invoices) {
    return <Loading />;
  }
  return (
    <YStack flex={1}>
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
  );
}
