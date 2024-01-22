import { Spinner, Text, YStack } from "tamagui";

export function Loading({
  message,
  isAbsolute,
}: {
  message?: string;
  isAbsolute?: boolean;
}) {
  message ??= "Loading...";

  return (
    <YStack
      {...(isAbsolute
        ? {
            position: "absolute",
            top: 0,
            left: 0,
          }
        : {})}
      fullscreen
      justifyContent="center"
      flex={1}
    >
      <Spinner />
      <Text textAlign="center" marginTop="$6">
        {message}
      </Text>
    </YStack>
  );
}
