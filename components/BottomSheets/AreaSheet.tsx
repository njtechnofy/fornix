import { AreaType, selectArea, useAreaStore } from "@/hooks/useArea";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Check } from "@tamagui/lucide-icons";
import { StyleSheet } from "react-native";
import { H6, View, XStack } from "tamagui";
import { CustomSuspense } from "../loading/CustomSuspense";

const ITEM_SIZE = 80;

const Selection = ({
  item,
  selected,
}: {
  item: AreaType;
  selected: AreaType;
}) => {
  if (item.id === selected.id) {
    return (
      <XStack
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

export function AreaSheet() {
  const areas = useAreaStore((state) => state.areas);
  const selected = useAreaStore((state) => state.area);

  return (
    <BottomSheetScrollView style={styles.bottomSheet}>
      <CustomSuspense
        data={areas}
        component={(areas) => (
          <>
            {areas.map((item) => (
              <Selection item={item} selected={selected} key={item.id} />
            ))}
          </>
        )}
      />

      {/* <CustomSuspense
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
      /> */}
    </BottomSheetScrollView>
  );
}

const styles = StyleSheet.create({
  bottomSheet: {
    padding: 5,
  },
});
