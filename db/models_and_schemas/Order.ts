import { Model, Q, Relation, tableSchema } from "@nozbe/watermelondb";
import { Associations } from "@nozbe/watermelondb/Model";
import {
  date,
  field,
  immutableRelation,
  lazy,
  readonly,
} from "@nozbe/watermelondb/decorators";
import { COLLECTIONS, dateSchemaColumns } from "../db_utils";
import { CustomerModel } from "./Customer";
import { ProductOrderModel } from "./ProductOrder";

export class OrderModel extends Model {
  static table = COLLECTIONS.ORDERS;

  static associations: Associations = {
    [COLLECTIONS.CUSTOMERS]: {
      type: "belongs_to",
      key: "customer_id",
    },
    [COLLECTIONS.INVOICES]: {
      type: "has_many",
      foreignKey: "order_id",
    },
    [COLLECTIONS.PRODUCT_ORDERS]: {
      type: "has_many",
      foreignKey: "order_id",
    },
  };
  @immutableRelation(COLLECTIONS.CUSTOMERS, "customer_id")
  customer!: Relation<CustomerModel>;

  @date("delivered_at") deliveredAt?: number;
  @field("total") total?: number;
  @field("paid") paid!: boolean;
  @field("customer_name") customerName!: string;

  @lazy
  invoices = this.collections
    .get(COLLECTIONS.INVOICES)
    .query(Q.where("order_id", this.id));

  @lazy
  products = this.collections
    .get<ProductOrderModel>(COLLECTIONS.PRODUCT_ORDERS)
    .query(Q.where("order_id", this.id));

  // @readonly reinstate this on prod
  @date("created_at")
  createdAt!: number;

  @readonly
  @date("updated_at")
  updatedAt!: number;
}

export const orderSchema = tableSchema({
  name: COLLECTIONS.ORDERS,
  columns: [
    { name: "delivered_at", type: "number", isOptional: true },
    { name: "total", type: "number", isOptional: true },
    { name: "customer_id", type: "string", isIndexed: true },
    { name: "customer_name", type: "string" },
    { name: "paid", type: "boolean" },
    ...dateSchemaColumns,
  ],
});
