import { Model, Relation, tableSchema } from "@nozbe/watermelondb";
import { Associations } from "@nozbe/watermelondb/Model";
import {
  date,
  immutableRelation,
  readonly,
} from "@nozbe/watermelondb/decorators";
import { COLLECTIONS, dateSchemaColumns } from "../db_utils";
import { CustomerModel } from "./Customer";
import { PrincipalModel } from "./Principal";

export class CustomerPrincipalModel extends Model {
  static table = COLLECTIONS.CUSTOMER_PRINCIPALS;
  static associations: Associations = {
    [COLLECTIONS.CUSTOMERS]: {
      type: "belongs_to",
      key: "customer_id",
    },
    [COLLECTIONS.PRINCIPAL]: {
      type: "belongs_to",
      key: "principal_id",
    },
  };

  @immutableRelation(COLLECTIONS.PRINCIPAL, "principal_id")
  principal!: Relation<PrincipalModel>;
  @immutableRelation(COLLECTIONS.ORDERS, "customer_id")
  customer!: Relation<CustomerModel>;

  @readonly
  @date("created_at")
  createdAt!: number;

  @readonly
  @date("updated_at")
  updatedAt!: number;
}

export const customerPrincipalSchema = tableSchema({
  name: COLLECTIONS.CUSTOMER_PRINCIPALS,
  columns: [
    { name: "principal_id", type: "string", isIndexed: true },
    { name: "customer_id", type: "string", isIndexed: true },
    ...dateSchemaColumns,
  ],
});
