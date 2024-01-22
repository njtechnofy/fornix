import { OrderModel } from "@/db/models_and_schemas/Order";
import { useOrders } from "@/hooks/useOrders";
import { useSearchStore } from "@/store";
import { likeSearch } from "@/utils/tools";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { useCallback, useDeferredValue } from "react";
import { ListItem, YStack } from "tamagui";
import { CustomSuspense } from "./loading/CustomSuspense";
import { Loading } from "./loading/Loading";

export function OrdersList({
  orders,
}: // onSubmit
{
  orders: OrderModel[];
}) {
  const query = useSearchStore((state) => state.query);

  const router = useRouter();
  const deferredQuery = useDeferredValue(query);

  const handlePress = useCallback((item: OrderModel) => {
    router.push(`/_orders/${item.id}/`);
  }, []);

  const renderItem = ({ item }: { item: OrderModel }) => (
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
        data={orders.filter((order) => likeSearch(deferredQuery, order.id))}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        estimatedItemSize={90}
        //@ts-ignore
        renderScrollComponent={BottomSheetScrollView}
      />
    </YStack>
  );
}

export function OrderSearch() {
  const { orders } = useOrders({ limit: 20 });

  if (!orders) {
    return <Loading message="Loading customers" />;
  }

  return (
    <CustomSuspense
      data={orders}
      name="products"
      component={(os) => {
        return <OrdersList orders={os} />;
      }}
    />
  );
}
