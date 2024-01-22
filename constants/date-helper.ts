import { format, getDaysInMonth, getMonth, subMonths } from "date-fns";

// Function to get days of previous months
export const getDaysOfPreviousMonths = (
  currentDate: Date,
  numberOfMonths: number
) => {
  const daysOfPreviousMonths = [];

  for (let i = -1; i < numberOfMonths - 1; i++) {
    console.log(format(getMonth(currentDate), "MMMM"));
    const previousMonthDate = subMonths(currentDate, i);
    const daysInMonth = getDaysInMonth(previousMonthDate);

    // Create an array with the days of the month, including day numbers and names
    const daysArray = Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      const date = new Date(
        previousMonthDate.getFullYear(),
        previousMonthDate.getMonth(),
        day
      );
      return {
        num: day,
        day: format(date, "EEE"), // 'EEEE' format gives the full day name
      };
    });

    // Add the month and days to the result array
    daysOfPreviousMonths.push({
      month: format(previousMonthDate, "MMMM"), // 'MMMM' format gives the full month name
      days: daysArray,
    });
  }

  return daysOfPreviousMonths.reverse();
};
