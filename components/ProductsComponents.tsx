import { ProductModel } from "@/db/models_and_schemas/Product";
import { useProducts } from "@/hooks/useProducts";
import { useSearchStore } from "@/store";
import { likeSearch } from "@/utils/tools";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { useCallback, useDeferredValue } from "react";
import { ListItem, YStack } from "tamagui";
import { CustomSuspense } from "./loading/CustomSuspense";
import { Loading } from "./loading/Loading";

export function ProductList({
  products,
}: // onSubmit
{
  products: ProductModel[];
}) {
  const query = useSearchStore((state) => state.query);

  const router = useRouter();
  const deferredQuery = useDeferredValue(query);

  const handlePress = useCallback((item: ProductModel) => {
    router.push(`/_products/${item.id}`);
  }, []);

  const renderItem = ({ item }: { item: ProductModel }) => (
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
    <YStack flex={1}>
      <FlashList
        contentContainerStyle={{
          padding: 5,
        }}
        data={products.filter((product) =>
          likeSearch(deferredQuery, product.name)
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

export function ProductSearch() {
  const { products } = useProducts({});

  if (!products) {
    return <Loading message="Loading customers" />;
  }

  return (
    <CustomSuspense
      data={products}
      name="products"
      component={(ps) => {
        return <ProductList products={ps} />;
      }}
    />
  );
}
