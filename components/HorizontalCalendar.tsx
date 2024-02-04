import {
  CalendarDay,
  months,
  useHorizontalCalendarStore,
} from "@/store/useHorizontalDateStore";
import { computeCalendar } from "@/utils/worklets/getCalendarWorklet";
import { FlashList } from "@shopify/flash-list";
import { ChevronLeft, ChevronRight } from "@tamagui/lucide-icons";
import { useState } from "react";
import { Button, H3, SizableText, XStack, YStack } from "tamagui";
const DATE_SIZE = 64;

// const DateWidget = ({ item }: { item: CalendarDay }) => {
//   //TODO
//   // const lastItemId = useRef<number>(props.id)
//   // const [active, setActive] = useState<boolean>(isActive);
//   // const tasks = useTasks({
//   //   date: new Date(...(item.slice(0, -1) as [number, number, number])),
//   // });
//   const thisWidget = new Date(...(item.slice(0, -2) as DateTuple));
//   const thisDay =
//     startOfDay(thisWidget).getTime() === startOfDay(today).getTime();
//   const isHighlighted = isEqual(
//     thisWidget,
//     new Date(...(highlight.slice(0, -2) as DateTuple))
//   );
//   return (

//   );
// };

const DayWidget = ({ item }: { item: CalendarDay }) => {
  const [isActive, setActive] = useState(item[4]);
  return (
    <YStack
      onPress={() => {
        setActive(true);
        useHorizontalCalendarStore.setState({
          highlight: [item[0], item[1], item[2]],
        });
        computeCalendar(
          item[0],
          item[1],
          item[0],
          item[1],
          item[2],
          ...useHorizontalCalendarStore.getState().today
        ).then((calendarDays: any) => {
          useHorizontalCalendarStore.setState({
            calendarDays: JSON.parse(calendarDays),
          });
        });
      }}
      width="100%"
      padding="$2"
      justifyContent="center"
      alignItems="center"
      marginHorizontal="$1"
    >
      <SizableText color="$gray9" size="$1">
        {item[3]}
      </SizableText>
      <XStack
        paddingVertical="$2"
        width="100%"
        justifyContent="center"
        alignItems="center"
        borderRadius={10}
        {...(isActive && {
          borderWidth: "$1",
          borderColor: "$green10",
        })}
        position="relative"
      >
        <H3 fontWeight="$16" color={item[5] ? "$green10" : "$gray12"}>
          {item[2]}
        </H3>
        {/* {item[4] > 0 ? (
        <View
          justifyContent="center"
          alignItems="center"
          height="$1.5"
          width="$1.5"
          backgroundColor={
            thisDay
              ? "$purple10"
              : startOfDay(thisWidget).getTime() < startOfDay(today).getTime()
                ? "$red10"
                : "$blue10"
          }
          borderRadius={100}
          position="absolute"
          top="$-0.75"
          right="$-0.75"
        >
          <SizableText size="$1" color="white">
            {item[4]}
          </SizableText>
        </View>
      ) : null} */}
      </XStack>
    </YStack>
  );
};

const RenderDay = ({ item }: { item: CalendarDay }) => {
  return (
    <YStack width={DATE_SIZE}>
      <DayWidget item={item} />
    </YStack>
  );
};

const handleCalendarChange = (isPrev: boolean) => {
  const { year, month, today, highlight, ref } =
    useHorizontalCalendarStore.getState();

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
  if (isPrev) {
    ref.current?.scrollToEnd({
      animated: true,
    });
  } else {
    ref.current?.scrollToIndex({
      index: 0,
      animated: true,
    });
  }

  computeCalendar(newYear, newMonth, ...highlight, ...today).then(
    (calendarDays: any) => {
      useHorizontalCalendarStore.setState({
        calendarDays: JSON.parse(calendarDays),
      });
    }
  );
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

  // const date = useMemo(() => new Date(year, month,), [year, month]);
  // const data = calendarDays;

  return (
    <XStack elevation="$0.25" width="100%">
      <YStack width="100%">
        <YStack width="100%">
          <XStack alignItems="center" paddingHorizontal="$2" width="100%">
            <Button
              variant="outlined"
              onPress={() => {
                handleCalendarChange(true);
              }}
            >
              <ChevronLeft />
            </Button>
            <XStack
              gap="$2"
              flex={1}
              justifyContent="center"
              alignItems="center"
            >
              <H3 color="$gray12" fontWeight="$16">
                {months[month]}
              </H3>
              <H3 color="$gray12" fontWeight="$1">
                {year}
              </H3>
            </XStack>
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
                  index: initialScroll - 1,
                });
              }, 100);
            }}
            estimatedItemSize={DATE_SIZE}
            horizontal
            data={calendarDays}
            keyExtractor={(i) => `${i}`}
            renderItem={RenderDay}
          />
        </YStack>
      </YStack>
    </XStack>
  );
}

// function getCalendar(date: Date) {
//   const numberOfDays = getDaysInMonth(date);
//   const year = getYear(date);
//   const month = getMonth(date);

//   const days: CalendarDay[] = [];
//   for (let i = 1; i <= numberOfDays; i++) {
//     days.push([year, month, i, daysOfWeek[getDay(new Date(year, month, i))]]);
//   }

//   return days;
// }
