import { COLLECTIONS } from "@/db/db_utils";
import { CustomerModel } from "@/db/models_and_schemas/Customer";
import { Q } from "@nozbe/watermelondb";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useAreaStore } from "./useArea";

export type CustomerSelector = {
  unpaid?: boolean;
  allDelivered?: boolean;
  or?: boolean;
  countOnly?: boolean;
  ignoreFilter?: boolean;
  geoTagged?: boolean;
};

export function useCustomers({
  unpaid,
  allDelivered,
  or,
  countOnly,
  ignoreFilter = false,
  geoTagged = false,
}: CustomerSelector) {
  const database = useDatabase();
  const [customers, setCustomers] = useState<CustomerModel[] | undefined>();
  const [count, setCount] = useState<number>();

  const area = useAreaStore((state) => state.area);

  let customersQuery = database.collections
    .get<CustomerModel>(COLLECTIONS.CUSTOMERS)
    .query();

  if (geoTagged) {
    customersQuery = customersQuery.extend(
      Q.and(
        Q.where("latitude", Q.notEq(null)),
        Q.where("longitude", Q.notEq(null))
      )
    );
  }
  if (area.id !== "all" && !ignoreFilter) {
    customersQuery = customersQuery.extend(
      Q.where("area_id", area.id),
      Q.sortBy("updated_at", "desc")
    );
  }
  if (or) {
    customersQuery = customersQuery.extend(
      Q.or(Q.where("all_paid", false), Q.where("all_delivered", true)),
      Q.sortBy("updated_at", "desc")
    );
  } else {
    if (typeof unpaid !== "undefined") {
      customersQuery = customersQuery.extend(
        Q.where("all_paid", !unpaid),
        Q.sortBy("updated_at", "desc")
      );
    }

    if (typeof allDelivered !== "undefined") {
      customersQuery = customersQuery.extend(
        Q.where("all_delivered", allDelivered),
        Q.sortBy("name", "asc")
      );
    }
  }

  useFocusEffect(
    useCallback(() => {
      const subscription = countOnly
        ? customersQuery.observeCount().subscribe((data) => {
            setCount(data);
          })
        : customersQuery
            .observeWithColumns(["longitude", "latitude"])
            .subscribe((data) => {
              setCustomers(data);
            });
      return () => {
        subscription.unsubscribe();
      };
    }, [])
  );

  return { customers, count };
}

export const useBestCustomer = (type: "paid" | "orders", tracker?: any) => {
  const [bestCustomer, setBestCustomer] = useState<CustomerModel>();
  const database = useDatabase();
  let queryString =
    type === "orders"
      ? `
    SELECT
    c.id,
    c.name,
    COUNT(o.id) AS totalOrders
FROM
    customers c
LEFT JOIN
    orders o ON c.id = o.customer_id
    GROUP BY
c.id
HAVING
    COUNT(o.id) > 0
    AND MIN(c.all_paid) = 1
ORDER BY
    totalOrders DESC
LIMIT 1;`
      : `
    SELECT
c.id,
c.name,
SUM(o.total) AS totalOrderAmount
FROM
customers c
LEFT JOIN
orders o ON c.id = o.customer_id
GROUP BY
c.id
HAVING
COUNT(o.id) > 0
AND MIN(c.all_paid) = 1
ORDER BY
totalOrderAmount DESC
LIMIT 1;`;
  const query = database
    .get<CustomerModel>(COLLECTIONS.CUSTOMERS)
    .query(Q.unsafeSqlQuery(queryString));

  useEffect(() => {
    let cancel = false;
    if (!cancel) {
      try {
        query.unsafeFetchRaw().then((res) => {
          setBestCustomer(res ? res[0] : undefined);
        });
      } catch (e) {
        console.error(e);
      }
    }
    return () => {
      cancel = true;
    };
  }, [tracker]);

  return { ...bestCustomer, type };
};
