import { Model, Relation, tableSchema } from "@nozbe/watermelondb";
import { Associations } from "@nozbe/watermelondb/Model";
import {
  date,
  field,
  immutableRelation,
  readonly,
} from "@nozbe/watermelondb/decorators";
import { COLLECTIONS, dateSchemaColumns } from "../db_utils";
import { CustomerModel } from "./Customer";

export class TaskModel extends Model {
  static table = COLLECTIONS.TASKS;
  static associations: Associations = {
    customers: {
      type: "belongs_to",
      key: "customer_id",
    },
  };

  @immutableRelation(COLLECTIONS.CUSTOMERS, "customer_id")
  customer!: Relation<CustomerModel>;

  @field("task_name") taskName!: string;

  @date("expected_at") expectedAt!: number;

  @date("resolved_at") resolvedAt?: number;

  //   @readonly TODO:return this after demo
  @date("created_at")
  createdAt!: number;

  @readonly
  @date("updated_at")
  updatedAt!: number;
}

export const taskSchema = tableSchema({
  name: COLLECTIONS.TASKS,
  columns: [
    { name: "task_name", type: "string" },
    { name: "expected_at", type: "number" },
    { name: "resolved_at", type: "number", isOptional: true },

    ...dateSchemaColumns,
  ],
});