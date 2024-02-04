import { COLLECTIONS } from "@/db/db_utils";
import { AreaModel } from "@/db/models_and_schemas/Area";
import { toggleSheet } from "@/store";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { create } from "zustand";

export type AreaType = {
  id: string;
  name: string;
  isSelected: boolean;
};
const defaultArea: AreaType = {
  id: "all",
  name: "All Areas",
  isSelected: true,
};
export const useAreaStore = create<{ area: AreaType; areas: AreaType[] }>(
  () => ({
    area: defaultArea,
    areas: [defaultArea],
  })
);

export const updateAreas = (areas: AreaType[]) =>
  useAreaStore.setState({
    areas: [defaultArea, ...areas],
  });

export const selectArea = (area: { id: string; name: string }) => {
  toggleSheet("area");

  useAreaStore.setState((state) => ({
    area: {
      id: area.id,
      name: area.name,
      isSelected: true,
    },
    areas: state.areas.map((a) => ({ ...a, isSelected: a.id === area.id })),
  }));
};

export function syncArea() {
  const database = useDatabase();

  let customersQuery = database.collections
    .get<AreaModel>(COLLECTIONS.AREAS)
    .query();

  useFocusEffect(
    useCallback(() => {
      const subscription = customersQuery.observe().subscribe((data) => {
        updateAreas(
          data.map((a) => ({
            id: a.id,
            name: a.name,
            isSelected: false,
          }))
        );
      });

      return () => {
        subscription.unsubscribe();
      };
    }, [database])
  );
}
