//@ts-ignore image type
import imageSrc from "@/assets/images/store.png";
import { Loading } from "@/components/loading/Loading";
import { PrincipalModel } from "@/db/models_and_schemas/Principal";
import { ProductOrderModel } from "@/db/models_and_schemas/ProductOrder";
import { useProduct } from "@/hooks/useProducts";
import { FlashList } from "@shopify/flash-list";
import { ArrowLeft } from "@tamagui/lucide-icons";
import {
  Link,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { useCallback, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Avatar,
  Button,
  H4,
  H5,
  H6,
  Paragraph,
  Separator,
  Text,
  XStack,
  YStack,
} from "tamagui";

export default function Product() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { product } = useProduct(id);
  const [principal, setPrincipals] = useState<PrincipalModel>();
  const [orders, setOrders] = useState<ProductOrderModel[]>([]);
  const router = useRouter();
  const safeInsets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      if (product) {
        const sub1 = product.principal
          .observe()
          .subscribe((p) => setPrincipals(p));

        const sub2 = product.orders
          .observe()
          // .pipe(
          //   map((orders) =>
          //     orders.sort((a, b) => {
          //       let _a = (a as OrderModel).paid ? 1 : 0;
          //       let _b = (b as OrderModel).paid ? 1 : 0;
          //       return _a - _b;
          //     })
          //   )
          // )
          .subscribe(setOrders);
        return () => {
          sub1.unsubscribe();
          sub2.unsubscribe();
        };
      }
    }, [product])
  );

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/(app)/(tabs)/dashboard");
    }
  };

  if (!product || !principal) {
    return <Loading />;
  }

  const renderItem = ({ item }: { item: ProductOrderModel }) => {
    return (
      <Link asChild href={`/(app)/_orders/${item.order.id}`}>
        <XStack
          padding="$4"
          borderRadius={20}
          marginVertical="$2"
          backgroundColor="$gray3"
          justifyContent="space-between"
          alignItems="center"
        >
          <YStack>
            <Text>{item.customerName}</Text>

            <Text>{new Date(item.createdAt).toLocaleDateString()}</Text>
          </YStack>
          <H4>{item.qty}</H4>
        </XStack>
      </Link>
    );
  };

  return (
    <YStack paddingTop={safeInsets.top} fullscreen>
      <XStack justifyContent="flex-start">
        <Button onPress={handleBack} size="$3" variant="outlined">
          <ArrowLeft />
        </Button>
      </XStack>

      <XStack
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal="$4"
      >
        <XStack alignItems="center" width="71%">
          <YStack padding="$4">
            <H6>{product.name}</H6>
            <Paragraph color="$gray8">{principal.name}</Paragraph>
          </YStack>
        </XStack>
        <Avatar borderRadius={20} size="$10">
          <Avatar.Image src={imageSrc} />
          <Avatar.Fallback bc="$gray3" />
        </Avatar>
      </XStack>

      <H5 marginLeft="$2">ORDERS</H5>
      <Separator marginVertical="$2" marginHorizontal="$2" />
      <YStack flex={1}>
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
