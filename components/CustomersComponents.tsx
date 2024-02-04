import { CustomerModel } from "@/db/models_and_schemas/Customer";
import { useCustomers } from "@/hooks/useCustomers";
import { useMapStore, useSearchStore } from "@/store";
import { likeSearch } from "@/utils/tools";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import { useDeferredValue } from "react";
import { ListItem } from "tamagui";
import { CustomSuspense } from "./loading/CustomSuspense";

export const useShowAllCustomers = () => {
  const mapRef = useMapStore((state) => state.ref);

  return (customers: CustomerModel[]) => {
    const geoTaggedCustomers = customers.reduce(
      (acc, curr) => {
        if (curr.latitude && curr.longitude) {
          acc.push({
            latitude: curr.latitude,
            longitude: curr.longitude,
          });
        }
        return acc;
      },
      [] as { latitude: number; longitude: number }[]
    );
    mapRef.current?.fitToCoordinates(geoTaggedCustomers, {
      animated: true,
      edgePadding: {
        left: 20,
        right: 20,
        bottom: 20,
        top: 20,
      },
    });
  };
};

export function CustomerList({
  cs,
}: // onSubmit
{
  cs: CustomerModel[];
}) {
  const query = useSearchStore((state) => state.query);
  const clickHandler = useSearchStore((state) => state.clickHandler);
  const deferredQuery = useDeferredValue(query);

  const renderItem = ({ item }: { item: CustomerModel }) => (
    <ListItem
      padding="$4"
      marginVertical="$2"
      borderRadius={20}
      hoverTheme
      pressTheme
      title={item.name}
      onPress={() => {
        if (clickHandler) {
          clickHandler(item);
        }
      }}
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
