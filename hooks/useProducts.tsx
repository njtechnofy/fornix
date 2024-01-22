import { COLLECTIONS } from "@/db/db_utils";
import { PrincipalModel } from "@/db/models_and_schemas/Principal";
import { ProductModel } from "@/db/models_and_schemas/Product";
import { Q } from "@nozbe/watermelondb";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

export function useProducts({
  principalID,
}: {
  principalID?: PrincipalModel["id"];
}) {
  const database = useDatabase();
  const [products, setProducts] = useState<ProductModel[] | undefined>();

  let productsQuery = database.collections
    .get<ProductModel>(COLLECTIONS.PRODUCTS)
    .query();

  if (principalID) {
    productsQuery = productsQuery.extend(
      Q.on(COLLECTIONS.PRINCIPAL, "principal_id", principalID),
      Q.sortBy("updated_at", "desc")
    );
  }

  useFocusEffect(
    useCallback(() => {
      const subscription = productsQuery.observe().subscribe((data) => {
        setProducts(data);
      });
      return () => {
        subscription.unsubscribe();
      };
    }, [database, principalID])
  );

  return { products };
}

export function useProduct(id?: string) {
  const [product, setProduct] = useState<ProductModel>();
  const database = useDatabase();

  const productQuery = database
    .get<ProductModel>(COLLECTIONS.PRODUCTS)
    .findAndObserve(id ?? "");

  useFocusEffect(
    useCallback(() => {
      if (!database || !id) {
        return;
      }
      const subscription = productQuery.subscribe((p) => {
        setProduct(p);
      });

      return () => {
        subscription.unsubscribe();
      };
    }, [database, id])
  );

  return {
    product,
  };
}
