import { Model, Q, Relation, tableSchema } from "@nozbe/watermelondb";
import { Associations } from "@nozbe/watermelondb/Model";
import {
  date,
  field,
  immutableRelation,
  lazy,
  readonly,
} from "@nozbe/watermelondb/decorators";
import { COLLECTIONS, nameWithDateSchemaColumns } from "../db_utils";
import { PrincipalModel } from "./Principal";
import { ProductOrderModel } from "./ProductOrder";

export class ProductModel extends Model {
  static table = COLLECTIONS.PRODUCTS;
  static associations: Associations = {
    [COLLECTIONS.PRODUCT_ORDERS]: {
      type: "has_many",
      foreignKey: "product_id",
    },
    [COLLECTIONS.PRINCIPAL]: {
      type: "belongs_to",
      key: "principal_id",
    },
  };
  @immutableRelation(COLLECTIONS.PRINCIPAL, "principal_id")
  principal!: Relation<PrincipalModel>;
  @field("name") name!: string;
  @field("code") code!: string;
  @field("price") price!: number;

  @readonly
  @date("created_at")
  createdAt!: number;

  @readonly
  @date("updated_at")
  updatedAt!: number;

  @lazy
  orders = this.collections
    .get<ProductOrderModel>(COLLECTIONS.PRODUCT_ORDERS)
    .query(Q.where("product_id", this.id));
}

export const productSchema = tableSchema({
  name: COLLECTIONS.PRODUCTS,
  columns: [
    ...nameWithDateSchemaColumns,
    { name: "principal_id", type: "string", isIndexed: true },
    { name: "code", type: "string", isIndexed: true },
    { name: "price", type: "number" },
  ],
});
