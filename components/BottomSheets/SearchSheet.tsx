import { closeSheet, updateSearchQuery, useSearchStore } from "@/store";
import { X } from "@tamagui/lucide-icons";
import { useState } from "react";
import { KeyboardAvoidingView } from "react-native";
import { Button, H5, Input, XStack, YStack } from "tamagui";
import { CustomerSearch } from "../CustomersComponents";
import { InvoiceSearch } from "../InvoiceComponents";
import { OrderSearch } from "../OrdersComponent";
import { ProductSearch } from "../ProductsComponents";

type Choice = "CUSTOMER" | "PRODUCT" | "ORDER" | "INVOICE";

export function SearchSheet({
  choice = "CUSTOMER",
  isMultiple,
}: {
  choice: Choice;
  isMultiple?: boolean;
}) {
  const query = useSearchStore((state) => state.query);
  const handleChange = (q: string) => {
    updateSearchQuery(q);
  };
  const [currentChoice, setChoice] = useState<Choice>(choice);

  const ChoiceButton = ({ choice }: { choice: Choice }) => {
    return (
      <Button
        size="$2"
        onPress={() => {
          setChoice(choice);
        }}
        backgroundColor={currentChoice === choice ? "$green10" : "$gray3"}
        color={currentChoice === choice ? "white" : "$gray12"}
      >
        {`${choice}S`}
      </Button>
    );
  };
  return (
    <YStack height="100%">
      <XStack
        space="$2"
        padding="$1"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
      >
        {isMultiple ? (
          <XStack space="$1">
            <ChoiceButton choice="CUSTOMER" />
            <ChoiceButton choice="PRODUCT" />
          </XStack>
        ) : (
          <H5>{choice} SEARCH</H5>
        )}
        <Button variant="outlined" onPress={() => closeSheet()}>
          <X size="$2" />
        </Button>
      </XStack>
      <KeyboardAvoidingView>
        <Input
          marginHorizontal="$4"
          height="$6"
          value={query}
          onChangeText={handleChange}
        />
      </KeyboardAvoidingView>
      <YStack flex={1}>
        {currentChoice === "CUSTOMER" ? (
          <CustomerSearch
            ignoreFilter={!(choice === "CUSTOMER" && !isMultiple)}
          />
        ) : currentChoice === "PRODUCT" ? (
          <ProductSearch />
        ) : currentChoice === "INVOICE" ? (
          <InvoiceSearch />
        ) : (
          <OrderSearch />
        )}
      </YStack>
    </YStack>
  );
}
