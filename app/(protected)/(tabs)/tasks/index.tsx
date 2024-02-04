import { Plus } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { Button } from "tamagui";

export default function IndexTask() {
  const router = useRouter();
  return (
    <Button
      borderRadius={100}
      height="$5"
      width="$5"
      position="absolute"
      bottom="$12"
      right="$2"
      elevate
      backgroundColor="$blue10"
      onPress={() => {
        router.push("/tasks/new/");
      }}
    >
      <Plus color="white" />
    </Button>
  );
}
