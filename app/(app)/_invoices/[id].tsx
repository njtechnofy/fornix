import { Loading } from "@/components/loading/Loading";
import { useInvoice } from "@/hooks/useInvoices";
import { ArrowLeft } from "@tamagui/lucide-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, H5, Paragraph, XStack, YStack } from "tamagui";

export default function InvoiceData() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { invoice, order } = useInvoice(id);
  const router = useRouter();
  const safeInsets = useSafeAreaInsets();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/dashboard");
    }
  };

  if (!invoice) {
    return <Loading />;
  }
  return (
    <YStack paddingTop={safeInsets.top} fullscreen>
      <XStack justifyContent="flex-start">
        <Button onPress={handleBack} size="$3" variant="outlined">
          <ArrowLeft />
        </Button>
      </XStack>

      <XStack
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal="$4"
      >
        <YStack flex={1}>
          <Paragraph color="$gray11">ID: {invoice.id}</Paragraph>
          <H5 marginVertical="$2">{order?.customerName}</H5>
        </YStack>
      </XStack>
    </YStack>
  );
}
