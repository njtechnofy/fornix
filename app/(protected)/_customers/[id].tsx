import { CustomSuspense } from "@/components/loading/CustomSuspense";
import { useCustomer } from "@/hooks/useCustomers";

import { Phone } from "@tamagui/lucide-icons";
import { useLocalSearchParams } from "expo-router";
import { Linking } from "react-native";
import { Button, Image, Paragraph, XStack, YStack } from "tamagui";

export default function Customer() {
  const { id } = useLocalSearchParams<{ id: string }>();
  if (!id) {
    throw new Error("");
  }
  const { customer, principals } = useCustomer(id);

  return (
    <CustomSuspense
      data={customer}
      component={(_customer) => (
        <YStack flex={1}>
          <XStack width="100%" height="30%">
            <Image
              source={require("../../../assets/images/stock.jpg")}
              height="20"
              width="100%"
            />
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
                  <Paragraph> {_customer.mobileNumber}</Paragraph>
                </XStack>
                <Button
                  borderRadius={100}
                  height="$5"
                  width="$5"
                  backgroundColor="$gray1"
                  borderWidth="$1"
                  borderColor="$green9"
                  onPress={() =>
                    Linking.openURL(`tel:${_customer.mobileNumber}`)
                  }
                >
                  <Phone color="$green9" />
                </Button>
              </XStack>
            </YStack>
            {/* <Text>{JSON.stringify(principals, null, 2)}</Text> */}

            <XStack padding="$1">
              <Button backgroundColor="$green9" color="white" flex={1}>
                New Order
              </Button>
              <Button backgroundColor="$blue8" color="white" flex={1}>
                Receive Payment
              </Button>
            </XStack>
          </YStack>
        </YStack>
      )}
    />
  );
}
