import { CustomerModel } from "@/db/models_and_schemas/Customer";
import { useCustomers } from "@/hooks/useCustomers";
import { useMapStore, useSearchStore, useSheetStore } from "@/store";
import { likeSearch } from "@/utils/tools";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { useCallback, useDeferredValue } from "react";
import { ListItem } from "tamagui";
import { CustomSuspense } from "./loading/CustomSuspense";
import { Loading } from "./loading/Loading";

export const useShowAllCustomers = () => {
  const mapRef = useMapStore((state) => state.ref);

  return (customers: CustomerModel[]) => {
    mapRef.current?.fitToCoordinates(
      customers.map((c) => ({
        latitude: c!.latitude,
        longitude: c!.longitude,
      })),
      {
        animated: true,
        edgePadding: {
          left: 20,
          right: 20,
          bottom: 20,
          top: 20,
        },
      }
    );
  };
};
export function CustomerList({
  cs,
}: // onSubmit
{
  cs: CustomerModel[];
}) {
  const type = useSheetStore((state) => state.type);
  const query = useSearchStore((state) => state.query);

  const router = useRouter();
  const deferredQuery = useDeferredValue(query);
  const showAllCustomers = useShowAllCustomers();

  const handlePress = useCallback(
    (item: CustomerModel) => {
      if (type === "map") {
        showAllCustomers([item]);
      } else {
        router.push(`/_customers/${item.id}`);
      }
    },
    [type]
  );

  const renderItem = ({ item }: { item: CustomerModel }) => (
    <ListItem
      padding="$4"
      marginVertical="$2"
      borderRadius={20}
      hoverTheme
      pressTheme
      title={item.name}
      onPress={() => handlePress(item)}
    />
  );

  return (
    <FlashList
      contentContainerStyle={{
        padding: 5,
      }}
      data={cs.filter((c) => likeSearch(deferredQuery, c.name))}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      estimatedItemSize={90}
      //@ts-ignore
      renderScrollComponent={BottomSheetScrollView}
    />
  );
}

export function CustomerSearch({ ignoreFilter }: { ignoreFilter?: boolean }) {
  const { customers } = useCustomers({ ignoreFilter: ignoreFilter ?? true });

  if (!customers) {
    return <Loading message="Loading customers" />;
  }

  return (
    <CustomSuspense
      data={customers}
      name="customers"
      component={(cs) => {
        return <CustomerList cs={cs} />;
      }}
    />
  );
}
