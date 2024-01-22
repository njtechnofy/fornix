//@ts-ignore image type
import imgSrc from "@/assets/images/store.png";
import { Loading } from "@/components/loading/Loading";
import { ProductModel } from "@/db/models_and_schemas/Product";
import { useProducts } from "@/hooks/useProducts";
import { moneyFormatter } from "@/utils/tools";
import { FlashList } from "@shopify/flash-list";
import { Link } from "expo-router";
import { Avatar, Text, XStack, YStack } from "tamagui";

export default function Products() {
  const { products } = useProducts({});

  const renderItem = ({ item }: { item: ProductModel }) => (
    <Link asChild href={`/(app)/_products/${item.id}`}>
      <XStack
        height={90}
        borderRadius={20}
        paddingHorizontal="$2"
        marginVertical="$2"
        backgroundColor="$gray3"
        justifyContent="space-between"
        alignItems="center"
      >
        <YStack>
          <Text>{item.name}</Text>
          <Text>{moneyFormatter.format(item.price)}</Text>
        </YStack>
        <Avatar borderRadius={20} size="$10">
          <Avatar.Image src={imgSrc} />
          <Avatar.Fallback bc="$gray3" />
        </Avatar>
      </XStack>
    </Link>
  );
  if (!products) {
    return <Loading />;
  }

  return (
    <YStack fullscreen>
      <YStack flex={1}>
        <FlashList
          automaticallyAdjustKeyboardInsets
          contentContainerStyle={{
            padding: 5,
          }}
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          estimatedItemSize={100}
        />
      </YStack>
    </YStack>
  );
}
