import { Loading } from "@/components/loading/Loading";
import { COLLECTIONS } from "@/db/db_utils";
import { ProductOrderModel } from "@/db/models_and_schemas/ProductOrder";
import { moneyFormatter } from "@/utils/tools";
import { Q } from "@nozbe/watermelondb";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import { FlashList } from "@shopify/flash-list";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { Paragraph, SizableText, Text, XStack, YStack } from "tamagui";

export default function ProductData() {
  const database = useDatabase();
  const { id } = useLocalSearchParams<{ id: string }>();
  if (!id) throw new Error("no id provided");
  const [data, setData] = useState<ProductOrderModel[]>();

  const query = database
    .get<ProductOrderModel>(COLLECTIONS.PRODUCT_ORDERS)
    .query(Q.where("order_id", id));
  useFocusEffect(
    useCallback(() => {
      const subscription = query.observe().subscribe(setData);
      return () => {
        subscription.unsubscribe();
      };
    }, [])
  );

  const renderItem = ({
    item,
    index,
  }: {
    item: ProductOrderModel;
    index: number;
  }) => (
    <XStack
      height={60}
      alignItems="center"
      backgroundColor={index % 2 === 0 ? "$gray2" : "$gray4"}
    >
      <XStack
        justifyContent="center"
        alignItems="center"
        height="100%"
        backgroundColor="rgba(0,0,0,0.3)"
        width="10%"
      >
        <Text numberOfLines={1}>{index + 1}</Text>
      </XStack>
      <XStack
        justifyContent="center"
        alignItems="center"
        height="100%"
        width="45%"
      >
        <Text numberOfLines={1}>{item.productName}</Text>
      </XStack>

      <XStack
        justifyContent="center"
        alignItems="center"
        height="100%"
        width="15%"
        backgroundColor="rgba(0,0,0,0.3)"
      >
        <Paragraph>{item.qty} </Paragraph>
      </XStack>
      <XStack
        justifyContent="center"
        alignItems="center"
        height="100%"
        width="30%"
      >
        <Paragraph>{moneyFormatter.format(item.price)}</Paragraph>
      </XStack>
    </XStack>
  );
  if (!data) {
    return <Loading />;
  }
  return (
    <YStack flex={1}>
      <XStack backgroundColor="$green9" paddingVertical="$2">
        <SizableText
          color="white"
          size="$3"
          width="10%"
          textAlign="center"
          numberOfLines={1}
        >
          #
        </SizableText>
        <SizableText
          color="white"
          size="$3"
          width="45%"
          textAlign="center"
          numberOfLines={1}
        >
          PRODUCT
        </SizableText>

        <SizableText
          color="white"
          size="$3"
          textAlign="center"
          width="15%"
          numberOfLines={1}
        >
          QTY
        </SizableText>

        <SizableText
          size="$3"
          color="white"
          textAlign="center"
          width="30%"
          numberOfLines={1}
        >
          PRICE
        </SizableText>
      </XStack>
      <YStack flex={1}>
        <FlashList
          automaticallyAdjustKeyboardInsets
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          estimatedItemSize={60}
        />
      </YStack>
    </YStack>
  );
}
