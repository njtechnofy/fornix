import { AreaType, selectArea, useAreaStore } from "@/hooks/useArea";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import { Check } from "@tamagui/lucide-icons";
import { H6, View, XStack, YStack } from "tamagui";
import { CustomSuspense } from "../loading/CustomSuspense";

const ITEM_SIZE = 80;

export function AreaSheet() {
  const areas = useAreaStore((state) => state.areas);

  const renderItem = ({ item }: { item: AreaType }) => {
    if (item.isSelected) {
      return (
        <XStack
          onPress={() => {
            selectArea(item);
          }}
          height={ITEM_SIZE}
          paddingHorizontal="$4"
          backgroundColor="$green9"
          marginVertical="$2"
          borderRadius={20}
          borderWidth="$1"
          alignItems="center"
          justifyContent="space-between"
        >
          <H6 color="white">{item.name}</H6>

          <View
            height="$4"
            width="$4"
            borderRadius={100}
            justifyContent="center"
            alignItems="center"
            borderColor="white"
            borderWidth="$1"
          >
            <Check color="white" size="$3" />
          </View>
        </XStack>
      );
    }
    return (
      <XStack
        onPress={() => {
          selectArea(item);
        }}
        height={ITEM_SIZE}
        backgroundColor="$backgroundStrong"
        paddingHorizontal="$4"
        marginVertical="$2"
        borderRadius={20}
        borderWidth="$1"
        alignItems="center"
        justifyContent="space-between"
      >
        <H6 color="$gray12">{item.name}</H6>

        <View
          height="$4"
          width="$4"
          borderRadius={100}
          justifyContent="center"
          alignItems="center"
          borderColor="$backgroundFocus"
          borderWidth="$1"
        ></View>
      </XStack>
    );
  };

  return (
    <YStack flex={1}>
      <CustomSuspense
        data={areas}
        component={(a) => (
          <FlashList
            automaticallyAdjustKeyboardInsets
            contentContainerStyle={{
              padding: 5,
            }}
            data={a}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            estimatedItemSize={ITEM_SIZE}
            //@ts-ignore
            renderScrollComponent={BottomSheetScrollView}
          />
        )}
      />
    </YStack>
  );
}
