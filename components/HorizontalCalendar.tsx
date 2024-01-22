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
import { useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, Pressable } from "react-native";
import { Button, H3, SizableText, XStack, YStack } from "tamagui";
import { create } from "zustand";

export const useHorizontalCalendarStore = create<{
  month: number;
  year: number;
  isScrolling: boolean;
  highlight: {
    year: number;
    month: number;
    day: number;
  };
}>(() => {
  const today = new Date();
  const year = getYear(today);
  const month = getMonth(today);
  return {
    isScrolling: true,
    year,
    month,
    highlight: {
      year,
      month,
      day: getDate(today),
    },
  };
});

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

type DateType = {
  month: number;
  days: {
    year: number;
    month: number;
    name: (typeof daysOfWeek)[number];
    number: number;
  }[];
  year: number;
};
function getItem(date: Date) {
  const year = getYear(date);
  const month = getMonth(date);
  const day = getDay(date);
  return {
    key: `${year}-${month}-${day}`,
  };
}
function getCalendar(date: Date) {
  const numberOfDays = getDaysInMonth(date);
  const year = getYear(date);
  const month = getMonth(date);

  const days: DateType["days"] = [];
  for (let i = 1; i <= numberOfDays; i++) {
    days.push({
      name: daysOfWeek[getDay(new Date(year, month, i))],
      year,
      month,
      number: i,
    });
  }

  return days;
}

const _width = Dimensions.get("screen").width;

const DateWidget = ({ item }: { item: DateType["days"][number] }) => {
  const highlight = useHorizontalCalendarStore((state) => state.highlight);
  const isHighlighted = isEqual(
    new Date(item.year, item.month, item.number),
    new Date(highlight.year, highlight.month, highlight.day)
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
        {item.number}
      </H3>
    </XStack>
  );
};

export function HorizontalCalendar() {
  const today = new Date();
  const initialOffset = getDate(today);
  const month = useHorizontalCalendarStore((state) => state.month);
  const year = useHorizontalCalendarStore((state) => state.year);
  const ref = useRef<FlashList<DateType["days"]>>(null);
  const initialCalendar = useMemo(() => {
    return getCalendar(today);
  }, []);

  const [calendar, setCalendar] = useState(initialCalendar);

  useEffect(() => {
    if (year !== calendar[1].year || month !== calendar[1].month) {
      setCalendar(getCalendar(new Date(year, month, 15)));
    }
  }, [month, year]);

  // useEffect(() => {
  //   setCalendar((prev) => {
  //     // const newRes = prev
  //     prev.calendar[`${prev.highlighted}`].isHighlighted = false;
  //     prev.calendar[`${highlight.day}`].isHighlighted = true;
  //     prev.highlighted = `${highlight.day}`;
  //     return { ...prev };
  //   });
  // }, [highlight]);

  const renderDay = ({ item }: { item: DateType["days"][number] }) => {
    return (
      <Pressable
        onPress={() => {
          useHorizontalCalendarStore.setState({
            highlight: {
              year: item.year,
              month: item.month,
              day: item.number,
            },
          });
        }}
      >
        <YStack
          paddingVertical="$2"
          width={64}
          space="$1"
          justifyContent="center"
          alignItems="center"
          marginHorizontal="$1"
        >
          <SizableText color="$gray9" size="$1">
            {item.name}
          </SizableText>
          <DateWidget item={item} />
        </YStack>
      </Pressable>
    );
  };

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
                useHorizontalCalendarStore.setState({
                  year: month === 0 ? year - 1 : year,
                  month: month === 0 ? 11 : month - 1,
                });
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
                useHorizontalCalendarStore.setState({
                  year: month === 11 ? year + 1 : year,
                  month: month === 11 ? 0 : month + 1,
                });
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
                  index: initialOffset - 4,
                });
              }, 100);
            }}
            estimatedItemSize={70}
            horizontal
            data={calendar}
            keyExtractor={(i) => `${i.year}-${i.month}-${i.number}`}
            renderItem={renderDay}
          />
        </YStack>
      </YStack>
    </XStack>
  );
}
