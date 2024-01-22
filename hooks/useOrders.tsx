import { useHorizontalCalendarStore } from "@/components/HorizontalCalendar";
import { COLLECTIONS } from "@/db/db_utils";
import { OrderModel } from "@/db/models_and_schemas/Order";
import { Q } from "@nozbe/watermelondb";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import { endOfDay, startOfDay } from "date-fns";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Subscription } from "rxjs";

type filters = {
  paid?: boolean;
  delivered?: boolean;
  offset?: number;
  limit?: number;
  date?: boolean;
  customerId?: string;
};

export const useOrders = ({
  paid,
  delivered,
  offset,
  limit,
  date,
  customerId,
}: filters) => {
  const [orders, setOrders] = useState<OrderModel[]>();
  const highlight = useHorizontalCalendarStore((state) => state.highlight);
  const [totalCount, setCount] = useState<number>();
  const database = useDatabase();
  let query = database.get<OrderModel>(COLLECTIONS.ORDERS).query();
  const baseQuery = query;

  if (typeof customerId !== "undefined") {
    query = query.extend(Q.where("customer_id", customerId));
  }

  if (typeof date !== "undefined") {
    const hDay = new Date(highlight.year, highlight.month, highlight.day);

    query = query.extend(
      Q.and(
        Q.where("created_at", Q.gte(startOfDay(hDay).getTime())),
        Q.where("created_at", Q.lte(endOfDay(hDay).getTime()))
      )
    );
  }
  if (typeof paid !== "undefined") {
    query = query.extend(Q.where("paid", paid));
  }

  if (typeof delivered !== "undefined") {
    query = query.extend(
      Q.where("delivered_at", delivered ? Q.notEq(null) : Q.eq(null))
    );
  }
  if (typeof offset !== "undefined") {
    query = query.extend(Q.skip(offset));
  }

  if (typeof limit !== "undefined") {
    query = query.extend(Q.take(limit));
  }
  query = query.extend(Q.sortBy("paid", "asc"));

  useFocusEffect(
    useCallback(() => {
      const sub1 = query.observe().subscribe((data) => {
        console.log("resubscribe orders");
        setOrders(data);
      });

      // .subscribe(setOrders);
      const sub2 = baseQuery.observeCount().subscribe(setCount);

      return () => {
        sub1.unsubscribe();
        sub2.unsubscribe();
      };
    }, [database, highlight])
  );
  return {
    orders,
    totalCount,
  };
};

export function useOrder(id?: string) {
  if (!id) {
    throw new Error("no id specified");
  }
  const [order, setOrder] = useState<OrderModel>();
  const database = useDatabase();
  const [pCount, setPCount] = useState(0);
  const [iCount, setICount] = useState(0);

  const productQuery = database
    .get<OrderModel>(COLLECTIONS.ORDERS)
    .query(Q.where("id", id));

  useFocusEffect(
    useCallback(() => {
      const subscription = productQuery.observe().subscribe((d) => {
        setOrder(d[0]);
      });

      return () => {
        subscription.unsubscribe();
      };
    }, [database, id])
  );

  useFocusEffect(
    useCallback(() => {
      let sub1: Subscription;
      let sub2: Subscription;
      if (order) {
        order.invoices.count.then(setICount);
        sub2 = order.products.observeCount().subscribe(setPCount);
      }

      return () => {
        sub1?.unsubscribe();
        sub2?.unsubscribe();
      };
    }, [order])
  );

  return {
    order,
    iCount,
    pCount,
  };
}
