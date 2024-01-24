import { getDaysOfPreviousMonths } from "@/constants/date-helper";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import BottomSheet from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet";
import {
  NetInfoState,
  NetInfoStateType,
} from "@react-native-community/netinfo";
import { type LocationObject } from "expo-location";
import { createRef } from "react";
import MapView from "react-native-maps";
import { MMKV } from "react-native-mmkv";
import { create } from "zustand";
import { StateStorage, createJSONStorage, persist } from "zustand/middleware";

const USER_STORAGE = "user_storage";
const userStorage = new MMKV({ id: USER_STORAGE, encryptionKey: "wowUser!" });

export type ExtendedCustomer = {
  id: string;
  name: string;
  unpaid: boolean;
  allDelivered: boolean;
  radius: number;
  latitude: number;
  longitude: number;
  mobileNumber: string;
  allDeliveredCustomers: number;
  unpaidCustomers: number;
  totalCustomer: number;
};

const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return userStorage.set(name, value);
  },
  getItem: (name) => {
    const value = userStorage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    return userStorage.delete(name);
  },
};

export const useUserStore = create<{ userId?: string; userName?: string }>()(
  persist(
    (set, get) => ({
      userId: undefined,
      userName: undefined,
    }),
    {
      name: USER_STORAGE,
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);

export type FilterType = "all" | "unpaid" | "allDelivered";

export const useFilterStore = create<{ activeFilter: FilterType[] }>(() => ({
  activeFilter: ["all"],
}));

export const updateFilter = (newFilter: FilterType) =>
  useFilterStore.setState((prev) => {
    if (prev.activeFilter.includes(newFilter)) {
      return {
        activeFilter: prev.activeFilter.filter((f) => f !== newFilter),
      };
    } else {
      return {
        activeFilter: [...prev.activeFilter, newFilter],
      };
    }
  });

export const useLocationStore = create<LocationObject>(() => ({
  timestamp: 0,
  coords: {
    latitude: 13.40905,
    longitude: 123.3731,
    accuracy: 0,
    altitude: 0,
    altitudeAccuracy: 0,
    speed: 0,
    heading: 0,
  },
  mocked: false,
}));

export const useNetworkStore = create<NetInfoState>(() => ({
  isConnected: false,
  isInternetReachable: false,
  type: NetInfoStateType.none,
  details: null,
}));

type ZoomType = {
  latitude: number;
  longitude: number;
  latitudeDelta?: number;
  longitudeDelta?: number;
};

export const useSheetStore = create<{
  type: null | "area" | "customer" | "geofence" | "map";
  ref: React.RefObject<BottomSheet>;
  bottomRef: React.RefObject<BottomSheetModal>;
}>(() => ({
  type: null,
  ref: createRef<BottomSheet>(),
  bottomRef: createRef<BottomSheetModal>(),
}));

export const closeSheet = () => {
  useSheetStore.setState({
    type: null,
  });
  useSheetStore.getState().ref?.current?.close();
  useSheetStore.getState().bottomRef?.current?.close();
};
export const useMapStore = create<{
  ref: React.RefObject<MapView>;
}>(() => ({
  ref: createRef<MapView>(),
}));

export const useSearchStore = create<{ query: string }>(() => ({
  query: "",
}));

export const updateSearchQuery = (query: string) =>
  useSearchStore.setState({
    query,
  });
export const uselessStore = create<{ ctr: number }>(() => ({
  ctr: 0,
}));

export const toggleTaskSheet = (taskSheet: boolean) => {
  if (taskSheet) {
    useSheetStore.setState({
      type: "customer",
    });
    useSheetStore.getState().ref.current?.snapToIndex(0);
  } else {
    closeSheet();
  }
};
export const toggleMapSheet = (taskSheet: boolean) => {
  if (taskSheet) {
    useSheetStore.setState({
      type: "map",
    });
    useSheetStore.getState().bottomRef.current?.present();
  } else {
    closeSheet();
  }
};

export const toggleSearchSheet = (searchSheet: boolean) => {
  if (searchSheet) {
    useSheetStore.setState({
      type: "customer",
    });
    useSheetStore.getState().ref.current?.snapToIndex(0);
  } else {
    closeSheet();
  }
};

export const useInitialCalendarStore = create<{
  calendar: ReturnType<typeof getDaysOfPreviousMonths> | undefined;
}>(() => ({
  calendar: undefined,
}));

export const toggleGeofenceSheet = (geofence: boolean) => {
  if (geofence) {
    useSheetStore.setState({
      type: "geofence",
    });
    useSheetStore.getState().ref.current?.snapToIndex(0);
  } else {
    closeSheet();
  }
};

export const updateNetworkInfo = (networkState: NetInfoState) =>
  useNetworkStore.setState(networkState);
export const updateLocation = (location: LocationObject) =>
  useLocationStore.setState(location);

export const login = ({
  userId,
  userName,
}: {
  userId: string;
  userName: string;
}) => useUserStore.setState({ userId, userName });
export const logout = () =>
  useUserStore.setState({ userId: undefined, userName: undefined });
