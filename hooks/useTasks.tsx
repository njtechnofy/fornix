import { COLLECTIONS } from "@/db/db_utils";
import { TaskModel } from "@/db/models_and_schemas/Tasks";
import { useHorizontalCalendarStore } from "@/store/useHorizontalDateStore";
import { Q } from "@nozbe/watermelondb";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import { endOfDay, startOfDay } from "date-fns";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Subscription } from "rxjs";

interface TaskOptions {
  type?: "expected" | "resolved";
  forCalendar?: boolean;
}

export const useTasks = ({ forCalendar, type = "expected" }: TaskOptions) => {
  const [tasks, setTasks] = useState<TaskModel[]>();
  const calendarDays = useHorizontalCalendarStore(
    (state) => state.calendarDays
  );

  const highlight = useHorizontalCalendarStore((state) => state.highlight);

  const database = useDatabase();
  let query = database.get<TaskModel>(COLLECTIONS.TASKS).query();

  if (typeof forCalendar !== "undefined" && calendarDays) {
    const date1 = new Date(
      ...((forCalendar ? calendarDays[0] : highlight).slice(0, -2) as [
        number,
        number,
        number,
      ])
    );
    const date2 = forCalendar
      ? new Date(
          ...(calendarDays[calendarDays.length - 1].slice(0, -2) as [
            number,
            number,
            number,
          ])
        )
      : date1;
    query = query.extend(
      Q.and(
        Q.where(`${type}_at`, Q.gte(startOfDay(date1).getTime())),
        Q.where(`${type}_at`, Q.lte(endOfDay(date2).getTime()))
      )
    );
  }
  query = query.extend(Q.where("is_deleted", false));
  const dependency =
    typeof forCalendar === "undefined"
      ? 0
      : forCalendar && calendarDays
        ? calendarDays[0][1]
        : highlight;

  query = query.extend(Q.sortBy(`${type}_at`, "asc"));
  useFocusEffect(
    useCallback(() => {
      let subscription: Subscription;

      if (!forCalendar) {
        subscription = query
          .observeWithColumns(["is_deleted"])
          .subscribe(setTasks);
      } else {
        query.observeWithColumns(["is_deleted"]).subscribe((data) => {
          //@ts-ignore
          setTasks(data.map((d) => d._raw));
        });
      }

      return () => {
        subscription?.unsubscribe();
      };
    }, [dependency])
  );
  return tasks;
};
