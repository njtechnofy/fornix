import { Model, Relation, tableSchema } from "@nozbe/watermelondb";
import { Associations } from "@nozbe/watermelondb/Model";
import { date, field, immutableRelation } from "@nozbe/watermelondb/decorators";
import { COLLECTIONS, dateSchemaColumns } from "../db_utils";
import { OrderModel } from "./Order";

export class InvoiceModel extends Model {
  static table = COLLECTIONS.INVOICES;

  static associations: Associations = {
    [COLLECTIONS.ORDERS]: {
      type: "belongs_to",
      key: "order_id",
    },
  };

  @immutableRelation(COLLECTIONS.INVOICES, "order_id")
  order!: Relation<OrderModel>;

  @field("paid_amount") paidAmount!: number;
  @field("customer_name") customerName!: string;

  // @readonly reinstate this on prod
  @date("created_at")
  createdAt!: number;

  // @readonly reinstate this on prod
  @date("updated_at")
  updatedAt!: number;
}

export const invoiceSchema = tableSchema({
  name: COLLECTIONS.INVOICES,
  columns: [
    {
      name: "order_id",
      type: "string",
      isIndexed: true,
    },
    { name: "customer_name", type: "string" },
    { name: "paid_amount", type: "number" },
    ...dateSchemaColumns,
  ],
});
