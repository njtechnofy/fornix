import { Model, Query, Relation, tableSchema } from "@nozbe/watermelondb";
import { Associations } from "@nozbe/watermelondb/Model";
import {
  children,
  date,
  field,
  immutableRelation,
  readonly,
} from "@nozbe/watermelondb/decorators";
import { COLLECTIONS, nameWithDateSchemaColumns } from "../db_utils";
import { CustomerModel } from "./Customer";
import { GreaterAreaModel } from "./GreaterArea";

export class AreaModel extends Model {
  static table = COLLECTIONS.AREAS;

  static associations: Associations = {
    [COLLECTIONS.GREATER_AREAS]: {
      type: "belongs_to",
      key: "greater_area_id",
    },
    [COLLECTIONS.CUSTOMERS]: {
      type: "has_many",
      foreignKey: "area_id",
    },
  };

  @field("name") name!: string;

  @immutableRelation(COLLECTIONS.GREATER_AREAS, "greater_area_id")
  greaterArea!: Relation<GreaterAreaModel>;

  @children(COLLECTIONS.CUSTOMERS) customers!: Query<CustomerModel>;

  @readonly
  @date("created_at")
  createdAt!: number;

  @readonly
  @date("updated_at")
  updatedAt!: number;
}

export const areaSchema = tableSchema({
  name: COLLECTIONS.AREAS,
  columns: [
    ...nameWithDateSchemaColumns,
    {
      name: "greater_area_id",
      type: "string",
      isIndexed: true,
    },
  ],
});
