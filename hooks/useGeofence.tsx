import { useLocationStore } from "@/store";
import { LocationObjectCoords } from "expo-location";
import { getDistance } from "geolib";
import { useMemo } from "react";
import { useCustomers } from "./useCustomers";

export interface UserCoords
  extends Pick<LocationObjectCoords, "latitude" | "longitude"> {}

export interface RegionCoords extends UserCoords {
  radius: number;
}

export interface Geofence {
  userCoords: LocationObjectCoords;
  regionCoords: RegionCoords;
}

export const isInRegion = ({ userCoords, regionCoords }: Geofence) => {
  let distance;
  if (userCoords.accuracy) {
    distance = getDistance(
      userCoords,
      { latitude: regionCoords.latitude, longitude: regionCoords.longitude },
      userCoords.accuracy
    );
  } else {
    distance = getDistance(userCoords, {
      latitude: regionCoords.latitude,
      longitude: regionCoords.longitude,
    });
  }

  return distance <= regionCoords.radius;
};

export const useGeofence = () => {
  const { customers } = useCustomers({});
  const userCoords = useLocationStore((state) => state.coords);

  const _customers = useMemo(
    () =>
      customers?.filter((customer) =>
        isInRegion({ userCoords, regionCoords: customer })
      ),
    [userCoords.latitude, userCoords.longitude, customers]
  );

  return _customers;
};
