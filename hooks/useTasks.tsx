import { COLLECTIONS } from "@/db/db_utils";
import { TaskModel } from "@/db/models_and_schemas/Tasks";
import { Q } from "@nozbe/watermelondb";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import { endOfDay, startOfDay } from "date-fns";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

interface TaskOptions {
  date?: Date;
  type?: "expected" | "resolved";
}

export const useTasks = ({ date, type = "expected" }: TaskOptions) => {
  const [tasks, setTasks] = useState<TaskModel[]>();
  const database = useDatabase();
  let query = database.get<TaskModel>(COLLECTIONS.TASKS).query();

  if (typeof date !== "undefined") {
    query = query.extend(
      Q.and(
        Q.where(`${type}_at`, Q.gte(startOfDay(date).getTime())),
        Q.where(`${type}_at`, Q.lte(endOfDay(date).getTime()))
      )
    );
  }
  query = query.extend(Q.sortBy(`${type}_at`));
  useFocusEffect(
    useCallback(() => {
      const subscription = query.observe().subscribe(setTasks);
      return () => {
        subscription.unsubscribe();
      };
    }, [])
  );
  return tasks;
};
