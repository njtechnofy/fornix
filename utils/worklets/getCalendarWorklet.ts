const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
import { Worklets } from "react-native-worklets-core";
function getCalendarWorklet(year: number, month: number) {
  "worklet";

  function toDate(argument: any) {
    const argStr = Object.prototype.toString.call(argument);

    // Clone the date
    if (
      argument instanceof Date ||
      (typeof argument === "object" && argStr === "[object Date]")
    ) {
      // Prevent the date to lose the milliseconds when passed to new Date() in IE10
      return new argument.constructor(+argument);
    } else if (
      typeof argument === "number" ||
      argStr === "[object Number]" ||
      typeof argument === "string" ||
      argStr === "[object String]"
    ) {
      // TODO: Can we get rid of as?
      return new Date(argument);
    } else {
      // TODO: Can we get rid of as?
      return new Date(NaN);
    }
  }

  function getDay(date: any) {
    const _date = toDate(date);
    const day = _date.getDay();
    return day;
  }

  function isLeapYear(year: number): boolean {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  }

  const daysInMonth = {
    standard: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    leapyear: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
  };

  const numberOfDays =
    daysInMonth[isLeapYear(year) ? "leapyear" : "standard"][month];

  const days = [];
  const initialDay = getDay(new Date(year, month, 1));
  for (let i = 1; i <= numberOfDays; i++) {
    days.push([year, month, i, daysOfWeek[(i - 1 + initialDay) % 7]]);
  }

  return JSON.stringify(days);
}

export const computeCalendar =
  Worklets.createRunInContextFn(getCalendarWorklet);
