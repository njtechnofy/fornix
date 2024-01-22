import { CustomerModel } from "@/db/models_and_schemas/Customer";
import { FlashList } from "@shopify/flash-list";
import { Link } from "expo-router";
import { Text, XStack, YStack } from "tamagui";
const renderItem = ({ item }: { item: CustomerModel }) => (
  <Link asChild href={`/_customers/${item.id}`}>
    <XStack
      padding="$4"
      backgroundColor="$gray1"
      marginVertical="$2"
      space="$2"
      alignItems="center"
      borderRadius="$4"
      elevation="$0.5"
      height="$8"
    >
      <XStack maxWidth="85%" flex={1}>
        <Text numberOfLines={1}>{item.name}</Text>
      </XStack>
      <YStack width="15%" space="$2" alignItems="flex-end">
        {!item.allPaid ? (
          <XStack padding="$2" backgroundColor="$orange8" borderRadius={20} />
        ) : null}
        {item.allDelivered && item.allPaid ? (
          <XStack padding="$2" borderRadius={20} backgroundColor="$blue8" />
        ) : null}
      </YStack>
    </XStack>
  </Link>
);
export const TaskList = ({ customers }: { customers: CustomerModel[] }) => {
  return (
    <YStack flex={1}>
      <FlashList
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={{
          padding: 5,
        }}
        data={customers}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        estimatedItemSize={100}
      />
    </YStack>
  );
};
