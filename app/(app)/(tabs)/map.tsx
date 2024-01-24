import { SearchSheet } from "@/components/BottomSheets/SearchSheet";
import { useShowAllCustomers } from "@/components/CustomersComponents";
import { CustomSuspense } from "@/components/loading/CustomSuspense";
import { CustomerModel } from "@/db/models_and_schemas/Customer";
import { moveCustomer } from "@/db/seed";
import { useCustomers } from "@/hooks/useCustomers";
import {
  toggleMapSheet,
  updateSearchQuery,
  useMapStore,
  useSheetStore,
} from "@/store";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Plus, Search, Store } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { FunctionComponent, memo, useCallback, useMemo, useState } from "react";
import { Dimensions } from "react-native";
import { supercluster, useClusterer } from "react-native-clusterer";
import MapView, {
  Circle,
  Marker,
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";
import Animated, {
  useAnimatedProps,
  useSharedValue,
} from "react-native-reanimated";
import { Button, Paragraph, Text, XStack, YStack, useTheme } from "tamagui";

// const MAP_DIMENSIONS =  { width: Dimensions.get('wind').height, height: MAP_HEIGHT }

type IPoint =
  | supercluster.PointFeature<GeoJSON.GeoJsonProperties>
  | supercluster.ClusterFeatureClusterer<GeoJSON.GeoJsonProperties>;

interface PointProps {
  item: IPoint;
  onPress: (
    item: IPoint,
    drag?: {
      latitude: number;
      longitude: number;
    }
  ) => void;
}

export const Point: FunctionComponent<PointProps> = memo(
  ({ item, onPress }) => {
    if (item.properties?.cluster) {
      return (
        <Marker
          coordinate={{
            latitude: item.geometry.coordinates[1],
            longitude: item.geometry.coordinates[0],
          }}
          tracksViewChanges={false}
          tracksInfoWindowChanges={false}
          onPress={() => onPress(item)}
        >
          <XStack
            justifyContent="center"
            alignItems="center"
            backgroundColor="$blue10"
            borderRadius={100}
            width="$4"
            height="$4"
          >
            <Text color="white">{item.properties.point_count}</Text>
          </XStack>
        </Marker>
      );
    }

    return (
      <>
        <Marker
          anchor={{ x: 0.5, y: 0.7 }}
          centerOffset={{ x: 0.5, y: 0.7 }}
          onPress={() => onPress(item)}
          draggable={true}
          onDragEnd={({
            nativeEvent: {
              coordinate: { longitude, latitude },
            },
          }) => {
            moveCustomer({
              latitude,
              longitude,
              id: item!.properties!.id,
            });
            onPress(item, {
              latitude,
              longitude,
            });
          }}
          coordinate={{
            latitude: item.geometry.coordinates[1],
            longitude: item.geometry.coordinates[0],
          }}
          tracksViewChanges={false}
          tracksInfoWindowChanges={false}
        >
          <XStack
            maxWidth="$10"
            space="$2"
            backgroundColor="black"
            borderRadius={20}
            padding="$1"
            paddingHorizontal="$3"
          >
            <Paragraph numberOfLines={1} color="white">
              {item.properties?.name}
            </Paragraph>
          </XStack>
        </Marker>
        <Circle
          radius={item.properties?.radius ?? 11 - 11}
          center={{
            latitude: item.geometry.coordinates[1],
            longitude: item.geometry.coordinates[0],
          }}
          strokeWidth={1}
          strokeColor={"#1a66ff"}
          fillColor={"rgba(230,238,255,0.5)"}
        />
      </>
    );
  },
  (prevProps, nextProps) =>
    prevProps.item.properties?.cluster_id ===
      nextProps.item.properties?.cluster_id &&
    prevProps.item.properties?.id === nextProps.item.properties?.id &&
    prevProps.item.properties?.point_count ===
      nextProps.item.properties?.point_count &&
    prevProps.item.properties?.onItemPress ===
      nextProps.item.properties?.onItemPress &&
    prevProps.item.properties?.getClusterExpansionRegion ===
      nextProps.item.properties?.getClusterExpansionRegion &&
    prevProps.item.geometry.coordinates[0] ===
      nextProps.item.geometry.coordinates[0] &&
    prevProps.item.geometry.coordinates[1] ===
      nextProps.item.geometry.coordinates[1]
);

export default function Map() {
  const { customers } = useCustomers({ hasGeo: true });

  return (
    <CustomSuspense
      data={customers}
      name="customers"
      component={(cs) => <CustomerMapComponent customers={cs} />}
    />
  );
}

const AnimatedMap = Animated.createAnimatedComponent(MapView);

function CustomerMapComponent({ customers }: { customers: CustomerModel[] }) {
  const { height, width } = Dimensions.get("screen");
  const position = useSharedValue(height);
  const animatedProps = useAnimatedProps(() => {
    return {
      height: position.value,
      style: {
        top: 80,
      },
    };
  });

  const theme = useTheme();
  const snapPoints = useMemo(() => ["40%"], []);

  const bottomRef = useSheetStore((state) => state.bottomRef);
  const mapRef = useMapStore((state) => state.ref);
  const isSearching = useSheetStore((state) => state.type === "map");
  const router = useRouter();

  const showAllCustomers = useShowAllCustomers();

  const [region, setRegion] = useState<Region>({
    latitude: 13.40905,
    longitude: 123.3731,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const parsedData = useMemo(
    () =>
      customers.map(
        ({ latitude, longitude, id, name, allPaid, allDelivered, radius }) => ({
          type: "Feature" as const,
          geometry: {
            type: "Point" as const,
            coordinates: [longitude as number, latitude as number],
          },
          properties: {
            id,
            name,
            allPaid,
            allDelivered,
            radius: radius as number,
          },
        })
      ),
    [customers]
  );

  const [points] = useClusterer(
    parsedData,
    {
      height,
      width,
    },
    region
  );

  const _handlePointPress = useCallback(
    (
      point:
        | supercluster.PointFeature<GeoJSON.GeoJsonProperties>
        | supercluster.ClusterFeatureClusterer<GeoJSON.GeoJsonProperties>,
      drag?: {
        latitude: number;
        longitude: number;
      }
    ) => {
      if (
        point.properties?.cluster_id &&
        point.properties?.getClusterExpansionRegion
      ) {
        const toRegion = point.properties?.getClusterExpansionRegion();
        toRegion.latitudeDelta += toRegion.latitudeDelta * 0.4;
        toRegion.longitudeDelta += toRegion.longitudeDelta * 0.4;

        mapRef.current?.animateToRegion(toRegion, 500);
      } else if (drag) {
        mapRef.current?.animateToRegion(
          {
            latitude: drag.latitude,
            longitude: drag.longitude,
            latitudeDelta: 0.0001,
            longitudeDelta: 0.0001,
          },
          500
        );
      } else if (point.properties?.id) {
        router.push(`/dashboard`);
      }
    },
    [mapRef]
  );

  console.log(region, "map");

  return useMemo(
    () => (
      <>
        <YStack height="100%">
          <AnimatedMap
            //@ts-ignore this works btw
            animatedProps={animatedProps}
            onRegionChangeComplete={setRegion}
            ref={mapRef}
            maxZoomLevel={18}
            provider={PROVIDER_GOOGLE}
            style={{
              top: 200,
              height: height - 200,
              width,
            }}
            initialRegion={region}
            showsUserLocation={true}
            showsMyLocationButton={true}
            followsUserLocation={true}
            customMapStyle={customMapStyle}
            onMapReady={() => {
              setTimeout(() => {
                showAllCustomers(customers);
              }, 400);
            }}
          >
            {points.map((item) => (
              <Point
                onPress={_handlePointPress}
                key={
                  //@ts-ignore
                  item.properties?.cluster_id ?? `point-${item.properties!.id}`
                }
                item={item}
              />
            ))}
          </AnimatedMap>

          {isSearching ? null : (
            <YStack space="$4" position="absolute" bottom="$18" right="$4">
              <Button
                elevation="$0.5"
                elevate
                backgroundColor="$blue12"
                height="$4"
                width="$4"
                padding="$1"
                borderRadius={100}
                onPress={() => {
                  if (isSearching) {
                    updateSearchQuery("");
                  }
                  toggleMapSheet(true);
                }}
              >
                <Search color="white" />
              </Button>
              <Button
                elevate
                elevation="$0.5"
                backgroundColor="$blue10"
                height="$4"
                width="$4"
                padding="$1"
                borderRadius={100}
                onPress={() => {
                  updateSearchQuery("");
                  showAllCustomers(customers);
                }}
              >
                <Store color="white" />
              </Button>
              <Button
                elevation="$0.5"
                elevate
                backgroundColor="$blue10"
                height="$4"
                width="$4"
                padding="$1"
                borderRadius={100}
                onPress={async () => {
                  // await addCustomer();
                  showAllCustomers(customers);
                }}
              >
                <Plus color="white" />
              </Button>
            </YStack>
          )}
        </YStack>

        <BottomSheetModal
          animatedPosition={position}
          enablePanDownToClose={true}
          ref={bottomRef}
          snapPoints={snapPoints}
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
            height: height * 0.4,
          }}
        >
          <YStack position="relative" flex={1}>
            <SearchSheet choice="CUSTOMER" />
          </YStack>
        </BottomSheetModal>
      </>
    ),
    [points, isSearching]
  );
}

const customMapStyle = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#f5f5f5",
      },
    ],
  },
  {
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#f5f5f5",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#bdbdbd",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [
      {
        color: "#eeeeee",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#ACC8AC",
      },
    ],
  },
  {
    featureType: "landscape.natural.landcover",
    elementType: "geometry",
    stylers: [
      {
        color: "#ACC8AC",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#ffffff",
      },
    ],
  },
  {
    featureType: "road.arterial",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#dadada",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
  {
    featureType: "transit.line",
    elementType: "geometry",
    stylers: [
      {
        color: "#e5e5e5",
      },
    ],
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [
      {
        color: "#eeeeee",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#2596be",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
];

{
  /* <Fragment
key={
  w?.cluter_id ??
  c.id + `${c.unpaid}_${c.allDelivered}_${activeFilter}`
}
>
{w?.cluster ? (
  <View
    style={{
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "#8eb3ed",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text
      style={{
        color: "#fff",
        fontSize: 16,
      }}
    >
      {w?.point_count}
    </Text>
  </View>
) : (
  <>
    <Marker
      anchor={{ x: 0.5, y: 0.7 }}
      centerOffset={{ x: 0.5, y: 0.7 }}
      onPress={() => {
        router.push(`/protected/customer/${c.id}`);
      }}
      draggable={true}
      onDragEnd={({
        nativeEvent: {
          coordinate: { longitude, latitude },
        },
      }) => {
        moveCustomer({
          latitude,
          longitude,
          id: c.id,
        });
      }}
      coordinate={{
        latitude: geometry.coordinates[1],
        longitude: geometry.coordinates[0],
      }}
      tracksViewChanges={false}
      tracksInfoWindowChanges={false}
    >
      <XStack
        maxWidth="$10"
        space="$2"
        backgroundColor={
          c.unpaid
            ? "$orange8"
            : c.allDelivered
            ? "$green9"
            : "$yellow8"
        }
        borderRadius={20}
        padding="$1"
        paddingHorizontal="$3"
      >
        <Paragraph numberOfLines={1} color="white">
          {c.name}
        </Paragraph>
      </XStack>
    </Marker>
    <Circle
      radius={c.radius - 11}
      center={{
        latitude: geometry.coordinates[1],
        longitude: geometry.coordinates[0],
      }}
      strokeWidth={1}
      strokeColor={"#1a66ff"}
      fillColor={"rgba(230,238,255,0.5)"}
    />
  </>
)}
</Fragment> */
}
