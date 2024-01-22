import { InvoiceModel } from "@/db/models_and_schemas/Invoice";
import { useInvoices } from "@/hooks/useInvoices";
import { useSearchStore } from "@/store";
import { likeSearch } from "@/utils/tools";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { useCallback, useDeferredValue } from "react";
import { ListItem, YStack } from "tamagui";
import { CustomSuspense } from "./loading/CustomSuspense";
import { Loading } from "./loading/Loading";

export function InvoiceList({
  invoices,
}: // onSubmit
{
  invoices: InvoiceModel[];
}) {
  const query = useSearchStore((state) => state.query);

  const router = useRouter();
  const deferredQuery = useDeferredValue(query);

  const handlePress = useCallback((item: InvoiceModel) => {
    router.push(`/_orders/${item.id}/`);
  }, []);

  const renderItem = ({ item }: { item: InvoiceModel }) => (
    <ListItem
      padding="$4"
      marginVertical="$2"
      borderRadius={20}
      hoverTheme
      pressTheme
      title={item.id}
      onPress={() => handlePress(item)}
    />
  );

  return (
    <YStack flex={1}>
      <FlashList
        contentContainerStyle={{
          padding: 5,
        }}
        data={invoices.filter((invoice) =>
          likeSearch(deferredQuery, invoice.id)
        )}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        estimatedItemSize={90}
        //@ts-ignore
        renderScrollComponent={BottomSheetScrollView}
      />
    </YStack>
  );
}

export function InvoiceSearch() {
  const { invoices } = useInvoices({ limit: 20 });
  if (!invoices) {
    return <Loading message="Loading customers" />;
  }

  return (
    <CustomSuspense
      data={invoices}
      name="Invoices"
      component={(is) => {
        return <InvoiceList invoices={is} />;
      }}
    />
  );
}
