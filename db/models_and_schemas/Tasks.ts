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

export type TaskName = "collect" | "geotag" | "visit";

export class TaskModel extends Model {
  static table = COLLECTIONS.TASKS;
  static associations: Associations = {
    [COLLECTIONS.CUSTOMERS]: {
      type: "belongs_to",
      key: "customer_id",
    },
  };

  @immutableRelation(COLLECTIONS.CUSTOMERS, "customer_id")
  customer!: Relation<CustomerModel>;

  @field("task_name") taskName!: TaskName;
  @field("customer_name") customerName!: string;
  @field("approved") approved!: boolean;

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
    { name: "customer_id", type: "string" },
    { name: "approved", type: "boolean" },
    { name: "customer_name", type: "string" },
    { name: "task_name", type: "string" },
    { name: "expected_at", type: "number" },
    { name: "resolved_at", type: "number", isOptional: true },
    ...dateSchemaColumns,
  ],
});
