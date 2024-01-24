import { Loading } from "@/components/loading/Loading";
import { COLLECTIONS } from "@/db/db_utils";
import { CustomerModel } from "@/db/models_and_schemas/Customer";
import { OrderModel } from "@/db/models_and_schemas/Order";
import { useDatabase } from "@nozbe/watermelondb/react";
//@ts-ignore
import imageSrc from "@/assets/images/stock.jpg";
import { Phone } from "@tamagui/lucide-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { Linking } from "react-native";
import { iif, of, switchMap } from "rxjs";
import { Button, H6, Image, Paragraph, XStack, YStack } from "tamagui";

export default function Customer() {
  const database = useDatabase();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [orders, setOrders] = useState<OrderModel[]>([]);
  const [customer, setCustomer] = useState<CustomerModel>();
  const navigation = useNavigation();

  useEffect(() => {
    if (customer && navigation) {
      navigation.setOptions({
        headerTitle: () => <H6 numberOfLines={1}>{customer.name}</H6>,
      });
    }
  }, [customer, navigation]);
  useEffect(() => {
    if (!database || !id) {
      return;
    }

    const customer$ = database
      .get<CustomerModel>(COLLECTIONS.CUSTOMERS)
      .findAndObserve(id);
    const orders$ = customer$.pipe(
      switchMap((c) => {
        return iif(() => !!c.orders, c.orders!.observe(), of([]));
      })
    );
    const ordersSubscription = orders$.subscribe((o) => {
      setOrders(o);
    });
    const customerSubscription = customer$.subscribe((c) => {
      setCustomer(c);
    });

    return () => {
      customerSubscription.unsubscribe();
      ordersSubscription.unsubscribe();
    };
  }, [database, id]);

  if (!customer) {
    return <Loading />;
  }
  return (
    <YStack flex={1}>
      <XStack width="100%" height="30%">
        <Image source={imageSrc} height="20" width="100%" />
      </XStack>
      <YStack
        position="absolute"
        marginTop={-20}
        elevation={2}
        backgroundColor="$gray3"
        borderTopEndRadius={20}
        borderTopLeftRadius={20}
        height="75%"
        width="100%"
        bottom={0}
        left={0}
        paddingHorizontal="$2"
        paddingTop="$1"
      >
        <YStack
          flex={1}
          width="100%"
          paddingTop="$2"
          paddingHorizontal="$1"
          borderRadius={10}
        >
          <XStack
            width="100%"
            padding="$4"
            borderRadius={10}
            justifyContent="space-between"
            alignItems="center"
            backgroundColor="$gray1"
          >
            <XStack backgroundColor="$gray1">
              <Paragraph marginRight="$1" color="$gray10" fontSize="$2">
                Mobile Number:
              </Paragraph>
              <Paragraph> {customer.mobileNumber}</Paragraph>
            </XStack>
            <Button
              borderRadius={100}
              height="$5"
              width="$5"
              backgroundColor="$gray1"
              borderWidth="$1"
              borderColor="$green9"
              onPress={() => Linking.openURL(`tel:${customer.mobileNumber}`)}
            >
              <Phone color="$green9" />
            </Button>
          </XStack>
        </YStack>
        {/* <Text>{JSON.stringify(principals, null, 2)}</Text> */}

        <XStack space="$1" padding="$1">
          <Button backgroundColor="$green9" color="white" flex={1}>
            New Order
          </Button>
          <Button backgroundColor="$blue8" color="white" flex={1}>
            Receive Payment
          </Button>
        </XStack>
      </YStack>
    </YStack>
  );
}
