import { Model, Q, Query, tableSchema } from "@nozbe/watermelondb";
import { Associations } from "@nozbe/watermelondb/Model";
import {
  children,
  date,
  field,
  lazy,
  readonly,
} from "@nozbe/watermelondb/decorators";
import { COLLECTIONS, nameWithDateSchemaColumns } from "../db_utils";
import { ProductModel } from "./Product";

export class PrincipalModel extends Model {
  static table = COLLECTIONS.PRINCIPALS;

  static associations: Associations = {
    [COLLECTIONS.PRODUCTS]: {
      type: "has_many",
      foreignKey: "principal_id",
    },
    [COLLECTIONS.CUSTOMER_PRINCIPALS]: {
      type: "has_many",
      foreignKey: "principal_id",
    },
  };

  @children(COLLECTIONS.PRODUCTS) products!: Query<ProductModel>;

  @lazy
  customers = this.collections
    .get(COLLECTIONS.CUSTOMERS)
    .query(Q.on(COLLECTIONS.CUSTOMER_PRINCIPALS, "principal_id", this.id));

  @field("name") name!: string;
  @field("code") code!: string;

  @readonly
  @date("created_at")
  createdAt!: number;

  @readonly
  @date("updated_at")
  updatedAt!: number;
  // get status() {
  //     const now = Date.now()
  //     const completed = !!this.visitedAt
  //     const late = this.visitedAt ? this.visitedAt > this.expectedAt : now > this.expectedAt

  //     let status: "red" | "orange" | "yellow" | "green";

  //     if (late) {
  //         status = completed ? "orange" : "red"
  //     } else {
  //         status = completed ? "green" : "yellow"
  //     }
  //     return {
  //         status,
  //         completed,
  //         late,
  //         orders: this.orders

  //     }
  // }
}

export const principalSchema = tableSchema({
  name: COLLECTIONS.PRINCIPALS,
  columns: [
    ...nameWithDateSchemaColumns,
    {
      name: "code",
      type: "string",
      isIndexed: true,
    },
  ],
});
