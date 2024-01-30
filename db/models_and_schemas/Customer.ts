import { Model, Q, Query, Relation, tableSchema } from "@nozbe/watermelondb";
import { Associations } from "@nozbe/watermelondb/Model";
import {
  children,
  date,
  field,
  immutableRelation,
  lazy,
  readonly,
} from "@nozbe/watermelondb/decorators";
import { COLLECTIONS, nameWithDateSchemaColumns } from "../db_utils";
import { AreaModel } from "./Area";
import { OrderModel } from "./Order";
import { TaskModel } from "./Tasks";

export class CustomerModel extends Model {
  static table = COLLECTIONS.CUSTOMERS;

  static associations: Associations = {
    [COLLECTIONS.ORDERS]: {
      type: "has_many",
      foreignKey: "customer_id",
    },
    [COLLECTIONS.AREAS]: {
      type: "belongs_to",
      key: "area_id",
    },
    [COLLECTIONS.CUSTOMER_PRINCIPALS]: {
      type: "has_many",
      foreignKey: "customer_id",
    },
    [COLLECTIONS.TASKS]: {
      type: "has_many",
      foreignKey: "customer_id",
    },
  };

  @immutableRelation(COLLECTIONS.AREAS, "area_id") area!: Relation<AreaModel>;

  @children(COLLECTIONS.TASKS) tasks?: Query<TaskModel>;
  @children(COLLECTIONS.ORDERS) orders?: Query<OrderModel>;

  @lazy
  principals = this.collections
    .get(COLLECTIONS.PRINCIPALS)
    .query(Q.on(COLLECTIONS.CUSTOMER_PRINCIPALS, "customer_id", this.id));

  @field("name") name!: string;

  @field("all_paid") allPaid!: boolean;

  @field("all_delivered") allDelivered!: boolean;

  @field("latitude") latitude?: number;

  @field("longitude") longitude?: number;

  @field("radius") radius!: number;

  @field("mobile_number") mobileNumber!: string;

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

export const customerSchema = tableSchema({
  name: COLLECTIONS.CUSTOMERS,
  columns: [
    { name: "area_id", type: "string", isIndexed: true },
    { name: "latitude", type: "number", isOptional: true },
    { name: "longitude", type: "number", isOptional: true },
    { name: "radius", type: "number" },
    { name: "mobile_number", type: "string" },
    { name: "all_paid", type: "boolean" },
    { name: "all_delivered", type: "boolean" },
    ...nameWithDateSchemaColumns,
  ],
});
