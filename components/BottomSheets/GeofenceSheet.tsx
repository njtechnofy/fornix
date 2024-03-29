import { useGeofence } from "@/hooks/useGeofence";

import { toggleSheet } from "@/store";
import { Button, H3, Text, YStack } from "tamagui";
import { CustomSuspense } from "../loading/CustomSuspense";

export function GeofenceSheet() {
  const customersInSite = useGeofence();

  return (
    <CustomSuspense
      name="Customers near me"
      data={customersInSite}
      component={(customersInSite) => (
        <YStack flex={1} justifyContent="center" alignItems="center">
          {customersInSite.length < 1 ? (
            <YStack
              justifyContent="space-around"
              padding="$8"
              borderRadius={20}
              alignItems="center"
              backgroundColor="$gray3"
            >
              <H3>No customers nearby</H3>
              <Button
                height="$6"
                width="$6"
                backgroundColor="$green10"
                color="white"
                borderRadius={100}
                onPress={() => toggleSheet(null)}
                elevate
              >
                OK
              </Button>
            </YStack>
          ) : (
            <Text>Bulaga</Text>
          )}
        </YStack>
      )}
    />
  );
}
