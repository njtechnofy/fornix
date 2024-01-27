import { COLLECTIONS } from "@/db/db_utils";
import { InvoiceModel } from "@/db/models_and_schemas/Invoice";
import { OrderModel } from "@/db/models_and_schemas/Order";
import { Q } from "@nozbe/watermelondb";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import { endOfDay, startOfDay } from "date-fns";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Subscription } from "rxjs";

type filters = {
  offset?: number;
  limit?: number;
  date?: Date;
  orderId?: string;
};

export const useInvoices = ({ orderId, offset, limit, date }: filters) => {
  const [invoices, setInvoices] = useState<InvoiceModel[]>();
  const [totalCount, setCount] = useState<number>();
  const database = useDatabase();
  let query = database.get<InvoiceModel>(COLLECTIONS.INVOICES).query();
  const baseQuery = query;

  if (typeof date !== "undefined") {
    query = query.extend(
      Q.and(
        Q.where("created_at", Q.gte(startOfDay(date).getTime())),
        Q.where("created_at", Q.lte(endOfDay(date).getTime()))
      )
    );
  }

  if (typeof orderId !== "undefined") {
    query = query.extend(Q.where("order_id", orderId));
  }
  if (typeof offset !== "undefined") {
    query = query.extend(Q.skip(offset));
  }

  if (typeof limit !== "undefined") {
    query = query.extend(Q.take(limit));
  }
  query = query.extend(Q.sortBy("created_at", "desc"));

  useFocusEffect(
    useCallback(() => {
      const sub1 = query.observe().subscribe(setInvoices);
      const sub2 = baseQuery.observeCount().subscribe(setCount);

      return () => {
        sub1.unsubscribe();
        sub2.unsubscribe();
      };
    }, [database, date, orderId, offset, limit])
  );
  return {
    invoices,
    totalCount,
  };
};

export function useInvoice(id?: string) {
  if (!id) {
    throw new Error("no id specified");
  }
  const [invoice, setInvoice] = useState<InvoiceModel>();
  const [order, setOrder] = useState<OrderModel>();
  const database = useDatabase();

  const invoiceQuery = database.get<InvoiceModel>(COLLECTIONS.INVOICES);
  const orderQuery = database.get<OrderModel>(COLLECTIONS.ORDERS);

  useFocusEffect(
    useCallback(() => {
      const subscription = invoiceQuery
        .findAndObserve(id)
        .subscribe(setInvoice);

      return () => {
        subscription.unsubscribe();
      };
    }, [database, id])
  );
  useFocusEffect(
    useCallback(() => {
      let subscription: Subscription;
      if (order) {
        subscription = orderQuery.findAndObserve(id).subscribe(setOrder);
      }

      return () => {
        subscription?.unsubscribe();
      };
    }, [invoice])
  );

  return {
    invoice,
    order,
  };
}
