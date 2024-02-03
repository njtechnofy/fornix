//@ts-ignore image type
import { MaterialTopTabs } from "@/components/MaterialTopTabs";
import { Loading } from "@/components/loading/Loading";
import { useOrder } from "@/hooks/useOrders";
import { moneyFormatter } from "@/utils/tools";
import { ArrowLeft } from "@tamagui/lucide-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ComponentProps, ReactNode } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, H3, H5, Paragraph, View, XStack, YStack } from "tamagui";

const Status = ({
  viewProps,
  isVisible,
  children,
}: {
  viewProps?: ComponentProps<typeof View>;
  isVisible: boolean;
  children: ReactNode;
}) => {
  if (!isVisible) {
    return null;
  }
  return <View {...viewProps}>{children}</View>;
};

export default function OrderProducts() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { order, iCount, pCount } = useOrder(id);

  const router = useRouter();
  const safeInsets = useSafeAreaInsets();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/dashboard");
    }
  };
  console.log("we are here", id);
  if (!order) {
    return <Loading />;
  }

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
        <YStack flex={1}>
          <Paragraph color="$gray11">ID: {order.id}</Paragraph>
          <H5 marginVertical="$2">{order.customerName}</H5>
          <Status isVisible={true}>
            <H3> {moneyFormatter.format(order.total ?? 0)}</H3>
          </Status>
          <Status isVisible={order.paid || (!order.paid && iCount > 0)}>
            <H5 color="$gray9">
              {order.paid
                ? "PAID"
                : !order.paid && iCount > 0
                ? "PARTIAL PAID"
                : "UNPAID"}
            </H5>
          </Status>
        </YStack>
      </XStack>
      <YStack flex={1}>
        <MaterialTopTabs
          style={{
            borderBottomWidth: 1,
          }}
        >
          <MaterialTopTabs.Screen
            initialParams={{ id: order.id }}
            name="index"
            options={{
              tabBarStyle: { backgroundColor: "transparent" },
              lazy: true,
              title: `Invoices (${iCount})`,
            }}
          />
          <MaterialTopTabs.Screen
            initialParams={{ id: order.id }}
            name="order_products"
            options={{
              tabBarStyle: { backgroundColor: "transparent" },
              lazy: true,
              title: `Products (${pCount})`,
            }}
          />
        </MaterialTopTabs>
      </YStack>
    </YStack>
  );
}
