const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export function getCalendarWorklet(_year: number, _month: number) {
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

  function constructFrom(date: any, value: any) {
    if (date instanceof Date) {
      //@ts-ignore
      return new date.constructor(value);
    } else {
      return new Date(value);
    }
  }

  function getDay(date: any) {
    const _date = toDate(date);
    const day = _date.getDay();
    return day;
  }

  function getMonth(date: any) {
    const _date = toDate(date);
    const month = _date.getMonth();
    return month;
  }

  function getYear(date: any) {
    return toDate(date).getFullYear();
  }

  function getDaysInMonth(date: any) {
    const _date = toDate(date);
    const year = _date.getFullYear();
    const monthIndex = _date.getMonth();
    const lastDayOfMonth = constructFrom(date, 0);
    lastDayOfMonth.setFullYear(year, monthIndex + 1, 0);
    lastDayOfMonth.setHours(0, 0, 0, 0);
    return lastDayOfMonth.getDate();
  }

  const date = new Date(_year, _month);
  const numberOfDays = getDaysInMonth(date);
  const year = getYear(date);
  const month = getMonth(date);

  const days = [];
  for (let i = 1; i <= numberOfDays; i++) {
    days.push([year, month, i, daysOfWeek[getDay(new Date(year, month, i))]]);
  }

  return JSON.stringify(days);
}
