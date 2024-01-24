import { Model, Relation, tableSchema } from "@nozbe/watermelondb";
import { Associations } from "@nozbe/watermelondb/Model";
import {
  date,
  field,
  immutableRelation,
  readonly,
} from "@nozbe/watermelondb/decorators";
import { COLLECTIONS, nameWithDateSchemaColumns } from "../db_utils";

import { CustomerModel } from "./Customer";

export class TaskModel extends Model {
  static table = COLLECTIONS.TASKS;

  static associations: Associations = {
    [COLLECTIONS.CUSTOMERS]: {
      type: "belongs_to",
      key: "customer_id",
    },
    // [COLLECTIONS.AREAS]: {
    //   type: "belongs_to",
    //   key: "area_id",
    // },
    // [COLLECTIONS.CUSTOMER_PRINCIPALS]: {
    //   type: "has_many",
    //   foreignKey: "customer_id",
    // },
  };

  @immutableRelation(COLLECTIONS.CUSTOMERS, "customer_id")
  customer!: Relation<CustomerModel>;

  @field("task_name") name!: string;

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

export const taskSchema = tableSchema({
  name: COLLECTIONS.TASKS,
  columns: [
    { name: "task_name", type: "string" },
    { name: "customer_id", type: "string", isIndexed: true },
    ...nameWithDateSchemaColumns,
  ],
});
