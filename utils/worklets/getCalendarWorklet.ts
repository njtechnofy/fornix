import { Worklets } from "react-native-worklets-core";

function getCalendarWorklet(year: number, month: number) {
  "worklet";
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
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

  function getDate(date: any) {
    const _date = toDate(date);
    const dayOfMonth = _date.getDate();
    return dayOfMonth;
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
    days.push([year, month, i, daysOfWeek[(i - 1 + initialDay) % 7], 0]);
  }

  return JSON.stringify(days);
}

function fillCalendarTaskWorklet(tasks: string, calendar: string) {
  "worklet";
  console.log("running filler");

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

  function getDate(date: any) {
    const _date = toDate(date);
    const dayOfMonth = _date.getDate();
    return dayOfMonth;
  }
  let groupedTask: any = {};
  //@ts-ignore
  // const groupedTask = JSON.parse(tasks).reduce((acc, task) => {
  //   console.log("frok worklet", task);
  //   const day = getDate(task.expectedAt);
  //   if (!acc[day]) {
  //     acc[day] = 0;
  //   }
  //   acc[day]++;
  // }, {});

  for (const task of JSON.parse(tasks)) {
    const day = getDate(task.expected_at);
    if (!groupedTask[day]) {
      groupedTask[day] = 1;
    } else {
      groupedTask[day]++;
    }
  }
  const days = JSON.parse(calendar).map(
    (day: [number, number, number, string, number]) => {
      const _day = day;
      _day[4] = groupedTask[day[2]];
      return _day;
    }
  );

  return JSON.stringify(days);
}

export const computeCalendar =
  Worklets.createRunInContextFn(getCalendarWorklet);

export const fillCalendar = Worklets.createRunInContextFn(
  fillCalendarTaskWorklet
);
