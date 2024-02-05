import { Loading } from "@/components/loading/Loading";
import { resetDB, seed } from "@/db/seed";
import { logout } from "@/store";
import { Trash } from "@tamagui/lucide-icons";
import { useState } from "react";
import { runOnJS } from "react-native-reanimated";
// import { spawnThread } from "react-native-multithreading";
import { Button, H3, YStack } from "tamagui";

export default function Settings() {
  const [isSeeding, setSeedState] = useState(false);
  if (isSeeding) {
    return <Loading isAbsolute message="Seeding Random Procedural Data" />;
  }
  return (
    <YStack backgroundColor="$gray1" flex={1} padding="$2">
      <YStack padding="$2">
        <H3>Database</H3>

        <Button
          onPress={() =>
            runOnJS(() => {
              setSeedState(true);
              setTimeout(() => {
                seed().then(() => setSeedState(false));
              }, 1000);
            })()
          }
          padding="$2"
          justifyContent="space-between"
        >
          {isSeeding ? "Seeding" : "Seed now!"}
        </Button>
        <Button
          padding="$2"
          justifyContent="space-between"
          iconAfter={Trash}
          onPress={async () => {
            await resetDB();
          }}
        >
          Reset Database (Restart App after)
        </Button>

        <Button onPress={() => logout()}>Logout</Button>
      </YStack>
    </YStack>
  );
}
