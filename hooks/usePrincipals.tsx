import { COLLECTIONS } from "@/db/db_utils";
import { PrincipalModel } from "@/db/models_and_schemas/Principal";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

export function usePrincipals() {
  const database = useDatabase();
  const [principals, setPrincipals] = useState<PrincipalModel[] | undefined>();

  let productsQuery = database.collections
    .get<PrincipalModel>(COLLECTIONS.PRINCIPAL)
    .query();

  useFocusEffect(
    useCallback(() => {
      const subscription = productsQuery.observe().subscribe((data) => {
        setPrincipals(data);
      });

      return () => {
        subscription.unsubscribe();
      };
    }, [database])
  );

  return { principals };
}
