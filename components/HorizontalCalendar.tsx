import { getCalendarWorklet } from "@/utils/worklets/getCalendarWorklet";
import { FlashList } from "@shopify/flash-list";
import { ChevronLeft, ChevronRight } from "@tamagui/lucide-icons";
import {
  getDate,
  getDay,
  getDaysInMonth,
  getMonth,
  getYear,
  isEqual,
} from "date-fns";
import { RefObject, createRef } from "react";
import { Worklets } from "react-native-worklets-core";
import { Button, H3, SizableText, XStack, YStack } from "tamagui";
import { create } from "zustand";
const DATE_SIZE = 64;

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

const months = [
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

type CalendarDay = [year: number, month: number, date: number, day: string];

export const useHorizontalCalendarStore = create<{
  month: number;
  year: number;
  // isScrolling: boolean;
  initialScroll: number;
  highlight: CalendarDay;
  calendarDays: CalendarDay[];
  ref: RefObject<FlashList<CalendarDay[]>>;
}>(() => {
  const ref = createRef<FlashList<CalendarDay[]>>();
  const today = new Date();
  const date = getDate(today);
  const day = daysOfWeek[getDay(today)];
  const year = getYear(today);
  const month = getMonth(today);
  const calendarDays = getCalendar(today);
  const initialScroll = date;

  return {
    // isScrolling: true,
    ref,
    year,
    month,
    highlight: [year, month, date, day],
    initialScroll,
    calendarDays,
  };
});

type DateTuple = [number, number, number];

const DateWidget = ({ item }: { item: CalendarDay }) => {
  const highlight = useHorizontalCalendarStore((state) => state.highlight);

  const isHighlighted = isEqual(
    new Date(...(item.slice(0, -1) as DateTuple)),
    new Date(...(highlight.slice(0, -1) as DateTuple))
  );
  return (
    <XStack
      paddingVertical="$2"
      paddingHorizontal="$3"
      justifyContent="center"
      alignItems="center"
      borderRadius={10}
      {...(isHighlighted && {
        backgroundColor: "$green10",
      })}
    >
      <H3 fontWeight="$16" color={isHighlighted ? "white" : "$gray12"}>
        {item[2]}
      </H3>
    </XStack>
  );
};

const renderDay = ({ item }: { item: CalendarDay }) => {
  return (
    <YStack
      onPress={() => {
        useHorizontalCalendarStore.setState({
          highlight: item,
        });
      }}
      paddingVertical="$2"
      width={DATE_SIZE}
      space="$1"
      justifyContent="center"
      alignItems="center"
      marginHorizontal="$1"
    >
      <SizableText color="$gray9" size="$1">
        {item[3]}
      </SizableText>
      <DateWidget item={item} />
    </YStack>
  );
};
const computeCalendar = Worklets.createRunInContextFn(getCalendarWorklet);
const handleCalendarChange = (isPrev: boolean) => {
  const { year, month } = useHorizontalCalendarStore.getState();
  const isEdgeMonth = isPrev ? 0 : 11;
  const operator = isPrev ? -1 : 1;
  const newMonthWhenEdge = isPrev ? 11 : 0;
  const compareMonth = isEdgeMonth === month;

  const newYear = compareMonth ? year + operator : year;
  const newMonth = compareMonth ? newMonthWhenEdge : month + operator;

  useHorizontalCalendarStore.setState({
    year: newYear,
    month: newMonth,
  });

  computeCalendar(newYear, newMonth).then((calendarDays) => {
    useHorizontalCalendarStore.setState({
      calendarDays: JSON.parse(calendarDays),
    });
  });
};

export function HorizontalCalendar() {
  const month = useHorizontalCalendarStore((state) => state.month);
  const year = useHorizontalCalendarStore((state) => state.year);
  const calendarDays = useHorizontalCalendarStore(
    (state) => state.calendarDays
  );
  const ref = useHorizontalCalendarStore((state) => state.ref);
  const initialScroll = useHorizontalCalendarStore(
    (state) => state.initialScroll
  );

  return (
    <XStack elevation="$0.25">
      <YStack>
        <YStack width="100%">
          <XStack
            justifyContent="space-between"
            alignItems="center"
            space="$2"
            paddingHorizontal="$2"
          >
            <Button
              variant="outlined"
              onPress={() => {
                handleCalendarChange(true);
              }}
            >
              <ChevronLeft />
            </Button>
            <H3 color="$gray12" fontWeight="$1">
              {months[month]} {year}
            </H3>
            <Button
              variant="outlined"
              onPress={() => {
                handleCalendarChange(false);
              }}
            >
              <ChevronRight />
            </Button>
          </XStack>

          <FlashList
            //@ts-ignore
            // key={new Date(year, month, 1).toString()}
            ref={ref}
            onLoad={() => {
              setTimeout(() => {
                ref.current?.scrollToIndex({
                  animated: true,
                  index: initialScroll - 4,
                });
              }, 100);
            }}
            estimatedItemSize={DATE_SIZE}
            horizontal
            data={calendarDays}
            keyExtractor={(i) => `${i}`}
            renderItem={renderDay}
          />
        </YStack>
      </YStack>
    </XStack>
  );
}

function getCalendar(date: Date) {
  const numberOfDays = getDaysInMonth(date);
  const year = getYear(date);
  const month = getMonth(date);

  const days: CalendarDay[] = [];
  for (let i = 1; i <= numberOfDays; i++) {
    days.push([year, month, i, daysOfWeek[getDay(new Date(year, month, i))]]);
  }

  return days;
}
