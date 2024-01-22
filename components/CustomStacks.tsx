import { ComponentProps } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { YStack, styled } from "tamagui";

export const MyStack = styled(YStack, {
  name: "MyStack",
  backgroundColor: "$gray1",
  flex: 1,
});

type StackProps = ComponentProps<typeof MyStack>;

export function SafeStack({ children, ...props }: StackProps) {
  const insets = useSafeAreaInsets();
  return (
    <MyStack {...props} fullscreen paddingTop={insets.top}>
      {children}
    </MyStack>
  );
}
