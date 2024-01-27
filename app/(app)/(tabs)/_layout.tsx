import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { Redirect, Tabs, useRouter } from "expo-router";

import { AreaSheet } from "@/components/BottomSheets/AreaSheet";
import { GeofenceSheet } from "@/components/BottomSheets/GeofenceSheet";
import { SearchSheet } from "@/components/BottomSheets/SearchSheet";
import { Loading } from "@/components/loading/Loading";
import { toggleAreaSheet, useAreaStore } from "@/hooks/useArea";
import { useGeofence } from "@/hooks/useGeofence";
import {
  toggleGeofenceSheet,
  toggleSearchSheet,
  useSheetStore,
  useUserStore,
} from "@/store";
import {
  CalendarSearch,
  ChevronDown,
  LayoutDashboard,
  ListChecks,
  Map,
  MapPin,
  Search,
  Settings,
} from "@tamagui/lucide-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useDeferredValue, useMemo } from "react";
import { Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, SizableText, XStack, YStack, useTheme } from "tamagui";

export const CustomHeader = (props: any) => {
  const insets = useSafeAreaInsets();
  const selectedArea = useAreaStore((state) => state.area);
  const router = useRouter();

  const isMap = props.routeName === "map";
  const color = isMap ? "white" : "$gray12";

  return (
    <LinearGradient
      colors={
        isMap
          ? ["rgba(0,0,0,0.8)", "transparent"]
          : ["transparent", "transparent"]
      }
    >
      <XStack
        space="$2"
        paddingTop={insets.top ?? 40}
        paddingHorizontal="$2"
        paddingBottom={isMap ? "$8" : "$2"}
        backgroundColor="transparent"
        {...props}
      >
        <Pressable
          onPress={() => {
            toggleAreaSheet(true);
          }}
        >
          <XStack
            flex={1}
            maxWidth="$12"
            justifyContent="center"
            alignItems="center"
            padding="$2"
            backgroundColor="#272F27"
            borderRadius={10}
          >
            <SizableText size="$2" color="white" numberOfLines={1}>
              {selectedArea ? selectedArea.name : "All Areas"}
            </SizableText>
            <ChevronDown color="white" size="$1" />
          </XStack>
        </Pressable>
        <XStack flex={1} alignItems="center" justifyContent="flex-end">
          <Button
            variant="outlined"
            onPress={() => {
              toggleSearchSheet(true);
            }}
            flex="unset"
            width="$3"
          >
            <Search color={color} />
          </Button>
          <Button
            variant="outlined"
            onPress={() => {
              router.push("/settings/");
            }}
            flex="unset"
            width="$3"
          >
            <Settings color={color} />
          </Button>
        </XStack>
      </XStack>
    </LinearGradient>
  );
};
export default function TabLayout() {
  const customersInSite = useGeofence();
  const isOnSite = customersInSite ? customersInSite.length > 0 : false;

  const userId = useUserStore((state) => state.userId);

  if (!userId) {
    return <Redirect href="/login" />;
  }

  return (
    <>
      <Tabs
        initialRouteName="dashboard"
        screenOptions={(props) => ({
          tabBarStyle: [styles.tabStyle],
          tabBarActiveTintColor: "white",
          headerTransparent: true,
          header: ({ route }) => <CustomHeader routeName={route.name} />,
        })}
      >
        <Tabs.Screen
          name="index"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="dashboard"
          options={{
            title: "Dashboard",

            tabBarIcon: ({ color, size }) => (
              <LayoutDashboard size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="map"
          options={{
            title: "Map",
            tabBarIcon: ({ color, size }) => <Map size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="geofence"
          options={{
            tabBarLabel: "",
            tabBarIcon: ({ size }) => (
              <Button
                position="relative"
                top={-20}
                height={60}
                width={60}
                backgroundColor={isOnSite ? "$green9" : "$gray2"}
                borderRadius={100}
                elevation="$0.25"
                onPress={() => {
                  toggleGeofenceSheet(true);
                }}
              >
                <MapPin color={isOnSite ? "white" : "$gray12"} size={size} />
              </Button>
            ),
          }}
          listeners={() => ({
            tabPress: (e) => {
              e.preventDefault();
            },
          })}
        />
        <Tabs.Screen
          name="tasks"
          options={{
            title: "Tasks",

            tabBarIcon: ({ color, size }) => (
              <ListChecks size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="history"
          options={{
            title: "History",
            tabBarIcon: ({ color, size }) => (
              <CalendarSearch size={size} color={color} />
            ),
          }}
        />
      </Tabs>

      <BottomSheetContainer />
    </>
  );
}

const BottomSheetContainer = () => {
  const type = useSheetStore((state) => state.type);
  const snapPoints = useMemo(
    () => (type === "customer" ? ["40%", "80%"] : ["40%"]),
    [type]
  );
  const ref = useSheetStore((state) => state.ref);

  const isOpen = type !== "map" && !!type;
  const deferredOpen = useDeferredValue(isOpen);

  const theme = useTheme();
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  return (
    <BottomSheet
      enablePanDownToClose={true}
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      style={{
        shadowColor: theme.color.val,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        backgroundColor: theme.background.val,
      }}
      handleIndicatorStyle={{
        backgroundColor: theme.color.val,
      }}
      handleStyle={{
        backgroundColor: theme.background.val,
      }}
      backgroundStyle={{
        backgroundColor: theme.background.val,
      }}
    >
      <YStack flex={1}>{deferredOpen ? <InsideSheet /> : <Loading />}</YStack>
    </BottomSheet>
  );
};

function InsideSheet() {
  const sheetType = useSheetStore((state) => state.type);

  if (sheetType === "area") {
    return <AreaSheet />;
  }
  if (sheetType === "geofence") {
    return <GeofenceSheet />;
  }

  return <SearchSheet choice="CUSTOMER" isMultiple={true} />;
}

const styles = StyleSheet.create({
  tabStyle: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    borderRadius: 20,
    height: 70,
    paddingBottom: 10,
    paddingTop: 10,
    elevation: 1,
    backgroundColor: "#272F27",
  },
});
