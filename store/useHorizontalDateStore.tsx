import { computeCalendar } from "@/utils/worklets/getCalendarWorklet";
import { FlashList } from "@shopify/flash-list";
import { getDate, getMonth, getYear } from "date-fns";
import { RefObject, createRef } from "react";
import { create } from "zustand";

export const daysOfWeek = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
] as const;

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export type CalendarDay = [
  year: number,
  month: number,
  date: number,
  day: string,
  isHighlighted: boolean,
  isToday: boolean,
];

export const useHorizontalCalendarStore = create<{
  month: number;
  year: number;
  highlight: [number, number, number];
  today: [number, number, number];
  // isScrolling: boolean;
  initialScroll: number;
  calendarDays?: CalendarDay[];
  init: () => void;
  ref: RefObject<FlashList<CalendarDay[]>>;
}>((set, get) => {
  const ref = createRef<FlashList<CalendarDay[]>>();
  const today = new Date();
  const date = getDate(today);
  // const day = daysOfWeek[getDay(today)];
  const year = getYear(today);
  const month = getMonth(today);
  const initialScroll = date;

  return {
    // isScrolling: true,
    ref,
    year,
    month,
    highlight: [year, month, date],
    today: [year, month, date],
    initialScroll,
    calendarDays: undefined,

    init: () => {
      const { year, month } = get();
      computeCalendar(year, month, year, month, date, year, month, date).then(
        (data) => {
          set({
            calendarDays: JSON.parse(data),
          });
        }
      );
    },
  };
});
