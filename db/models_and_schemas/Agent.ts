import { Model, tableSchema } from "@nozbe/watermelondb";
import { date, field, readonly } from "@nozbe/watermelondb/decorators";
import { COLLECTIONS, nameWithDateSchemaColumns } from "../db_utils";
// import { TaskModel } from "./Task";

export class AgentModel extends Model {
  static table = COLLECTIONS.AGENTS;

  @field("name") name!: string;
  @field("mobile") mobile!: string;
  @field("email") email!: string;

  @readonly
  @date("created_at")
  createdAt!: number;

  @readonly
  @date("updated_at")
  updatedAt!: number;

  // @children(COLLECTIONS.TASKS) tasks?: Query<TaskModel>;
}

export const agentSchema = tableSchema({
  name: COLLECTIONS.AGENTS,
  columns: [
    ...nameWithDateSchemaColumns,
    { name: "mobile", type: "string" },
    { name: "email", type: "string" },
  ],
});
