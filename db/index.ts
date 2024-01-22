import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";
import { setGenerator } from "@nozbe/watermelondb/utils/common/randomId";
import { randomUUID } from "expo-crypto";

import { SQLiteAdapterOptions } from "@nozbe/watermelondb/adapters/sqlite/type";
import { modelClasses, schema } from "./models_and_schemas";

setGenerator(randomUUID);

let database: Database | undefined;

const adapterConfig: SQLiteAdapterOptions = {
  dbName: "sfaDB",
  schema,
  // migrations,
  jsi: true,
};

export const adapter = new SQLiteAdapter(adapterConfig);

export function getDatabase() {
  if (!database) {
    database = new Database({
      adapter,
      modelClasses,
    });
  }

  return database;
}
