import { Model, Query, tableSchema } from "@nozbe/watermelondb";
import { Associations } from "@nozbe/watermelondb/Model";
import {
  children,
  date,
  field,
  readonly,
} from "@nozbe/watermelondb/decorators";
import { COLLECTIONS, nameWithDateSchemaColumns } from "../db_utils";
import { AreaModel } from "./Area";

export class GreaterAreaModel extends Model {
  static table = COLLECTIONS.GREATER_AREAS;

  static associations: Associations = {
    [COLLECTIONS.AREAS]: {
      type: "has_many",
      foreignKey: "greater_area_id",
    },
  };

  @field("name") name!: string;
  @children(COLLECTIONS.AREAS) areas!: Query<AreaModel>[];

  @readonly
  @date("created_at")
  createdAt!: number;

  @readonly
  @date("updated_at")
  updatedAt!: number;
}

export const greaterAreaSchema = tableSchema({
  name: COLLECTIONS.GREATER_AREAS,
  columns: [...nameWithDateSchemaColumns],
});
