import { useGeofence } from "@/hooks/useGeofence";
import { closeSheet } from "@/store";
import { Button, H3, Text, YStack } from "tamagui";
import { Loading } from "../loading/Loading";

export function GeofenceSheet() {
  const customersInSite = useGeofence();

  if (!customersInSite) {
    return <Loading />;
  }
  return (
    <YStack flex={1} justifyContent="center" alignItems="center">
      {customersInSite.length < 1 ? (
        <YStack
          justifyContent="space-around"
          padding="$8"
          borderRadius={20}
          alignItems="center"
          backgroundColor="$gray3"
          space="$4"
        >
          <H3>No customers nearby</H3>
          <Button
            height="$6"
            width="$6"
            backgroundColor="$green10"
            color="white"
            borderRadius={100}
            onPress={() => closeSheet()}
            elevate
          >
            OK
          </Button>
        </YStack>
      ) : (
        <Text>Bulaga</Text>
      )}
    </YStack>
  );
}
