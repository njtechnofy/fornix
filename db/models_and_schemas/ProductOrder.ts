import { Model, Relation, tableSchema } from "@nozbe/watermelondb";
import { Associations } from "@nozbe/watermelondb/Model";
import {
  date,
  field,
  immutableRelation,
  readonly,
} from "@nozbe/watermelondb/decorators";
import { COLLECTIONS, dateSchemaColumns } from "../db_utils";
import { OrderModel } from "./Order";
import { ProductModel } from "./Product";

export class ProductOrderModel extends Model {
  static table = COLLECTIONS.PRODUCT_ORDERS;

  static associations: Associations = {
    orders: {
      type: "belongs_to",
      key: "order_id",
    },
    products: {
      type: "belongs_to",
      key: "product_id",
    },
  };

  @immutableRelation(COLLECTIONS.PRODUCTS, "product_id")
  product!: Relation<ProductModel>;
  @immutableRelation(COLLECTIONS.ORDERS, "order_id")
  order!: Relation<OrderModel>;
  @field("qty") qty!: number;
  @field("price") price!: number;
  @field("customer_name") customerName!: string;
  @field("product_name") productName!: string;

  @readonly
  @date("created_at")
  createdAt!: number;

  @readonly
  @date("updated_at")
  updatedAt!: number;
}

export const productOrderSchema = tableSchema({
  name: COLLECTIONS.PRODUCT_ORDERS,
  columns: [
    { name: "product_name", type: "string" },
    { name: "customer_name", type: "string" },
    { name: "product_id", type: "string", isIndexed: true },
    { name: "order_id", type: "string", isIndexed: true },
    { name: "qty", type: "number" },
    { name: "price", type: "number" },
    ...dateSchemaColumns,
  ],
});
