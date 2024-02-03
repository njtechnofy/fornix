import { SafeStack } from "@/components/CustomStacks";
import { Pencil } from "@tamagui/lucide-icons";
import { Avatar, Button, H3, H4, XStack, YStack } from "tamagui";

export default function ProfileScreen() {
  return (
    <SafeStack padding="$4" space="$2" justifyContent="center">
      <XStack alignItems="center" justifyContent="center" space="$6">
        <Avatar circular size="$14" marginBottom="$2">
          <Avatar.Image
            accessibilityLabel="Cam"
            src="https://images.unsplash.com/photo-1588731222899-68315ddd5e8e?&w=150&h=150&dpr=2&q=80"
          />
          <Avatar.Fallback backgroundColor="$blue10" />
        </Avatar>
      </XStack>
      <ProfileField value="Nhiel Jeff Salvana" label="Name" />
      <ProfileField value="njsalvana@gmail.com" label="Email" />
      <ProfileField value="09568191325" label="Mobile Number" />
    </SafeStack>
  );
}

type ProfileFieldProps = {
  label: string;
  value: string | number;
};
function ProfileField({ label, value }: ProfileFieldProps) {
  return (
    <YStack
      padding="$4"
      flexDirection="column"
      borderRadius="$3"
      borderWidth="$0.5"
      borderColor="$gray9"
      position="relative"
    >
      <Button
        position="absolute"
        variant="outlined"
        right="$2"
        top="$1"
        icon={Pencil}
      />
      <H4 color="$gray10">{label}</H4>
      <H3>{value}</H3>
    </YStack>
  );
}
