import { Loading } from "@/components/loading/Loading";
import { useBestCustomer, useCustomers } from "@/hooks/useCustomers";
import { useRouter } from "expo-router";
import { SizableText, Text } from "tamagui";

import { H1, H6, XStack, YStack } from "tamagui";

export default function Dashboard() {
  const { count: totalCustomers } = useCustomers({
    countOnly: true,
  });
  const { count: allDeliveredCustomers } = useCustomers({
    allDelivered: true,
    unpaid: false,
    countOnly: true,
  });
  const { count: unpaidCustomers } = useCustomers({
    unpaid: true,
    countOnly: true,
  });
  const best1 = useBestCustomer("paid", unpaidCustomers);
  const best2 = useBestCustomer("orders", unpaidCustomers);

  if (
    typeof totalCustomers === "undefined" ||
    typeof allDeliveredCustomers === "undefined" ||
    typeof unpaidCustomers === "undefined"
  ) {
    return <Loading />;
  }

  return (
    <YStack
      flex={1}
      backgroundColor="$gray1"
      space="$4"
      paddingTop="$13"
      paddingHorizontal="$2"
      paddingBottom="$12"
    >
      <XStack space="$2">
        <Stat name="Customers" filter="" count={totalCustomers} />
        <Stat filter="unpaid" name="Unpaid" count={unpaidCustomers} />
        <Stat
          filter="prospect"
          name="Prospects"
          count={allDeliveredCustomers}
        />
      </XStack>
      <YStack flex={1}>
        <H6>Best Customer</H6>
        <Text>{best1 ? JSON.stringify(best1) : "loading"}</Text>
        <H6>Best 2</H6>
        <Text>{best2 ? JSON.stringify(best2) : "loading"}</Text>
      </YStack>
    </YStack>
  );
}

function Stat({
  name,
  count,
  backgroundColor = "$gray3",
  darkness = 10,
  filter,
}: {
  name: string;
  count: number;
  backgroundColor?: string;
  filter: "unpaid" | "prospect" | "";
  darkness?: number;
}) {
  const router = useRouter();
  return (
    <YStack
      borderWidth="$0.5"
      borderColor="$gray4"
      flex={1}
      padding="$4"
      borderRadius={20}
      justifyContent="center"
      alignItems="center"
      space="$2"
      elevation="$1"
      backgroundColor={backgroundColor}
      onPress={() => {
        if (filter !== "") {
          console.log("stat pressed");
          router.push(`/(app)/(tabs)/tasks/${filter}`);
        }
      }}
    >
      <H1
        fontWeight="$16"
        color={
          filter === "unpaid"
            ? "$orange8"
            : filter === "prospect"
            ? "$blue8"
            : `$gray${darkness + 2}`
        }
      >
        {count}
      </H1>
      <SizableText size="$1" color={`$gray${darkness}`}>
        {name.toUpperCase()}
      </SizableText>
    </YStack>
  );
}
