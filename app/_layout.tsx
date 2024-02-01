import { Provider } from "@/components/Providers";
import { updateLocation } from "@/store";
import { NetInfoSubscription } from "@react-native-community/netinfo";
import "react-native-reanimated";

import { Asset } from "expo-asset";
import { useFonts } from "expo-font";
import {
  Accuracy,
  LocationAccuracy,
  LocationSubscription,
  requestBackgroundPermissionsAsync,
  requestForegroundPermissionsAsync,
  startLocationUpdatesAsync,
  watchPositionAsync,
} from "expo-location";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { Alert, Image } from "react-native";

const LOCATION_TASK_NAME = "background-location-task";
const FETCH_INTERVAL = 20000;

/**
 * used to set backgroundStateUpdate state from task
 * for use in bg task
 */

// TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }: any) => {
//   if (error) {
//     console.log(error);
//     return;
//   }
//   if (data) {
//     try {
//       const now = Date.now();
//       const currentTime = new Date(now).toISOString();

//       console.log(currentTime, data.locations[0].timestamp);
//       return currentTime
//         ? BackgroundFetch.BackgroundFetchResult.NewData
//         : BackgroundFetch.BackgroundFetchResult.NoData;
//     } catch (err) {
//       console.log(err);
//       return BackgroundFetch.BackgroundFetchResult.Failed;
//     }
//   }
// });

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(app)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

let locationSubscriber: LocationSubscription;
let unsubscribeNetInfo: NetInfoSubscription = () => {};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  useEffect(() => {
    async function init() {
      try {
        cacheImages([
          require("../assets/images/fornix.png"),
          require("../assets/images/fornix-white.png"),
        ]);

        await getPermissionsOrExit();

        const locationWatcher = await watchPositionAsync(
          {
            accuracy: LocationAccuracy.High,
            distanceInterval: 0.1,
            timeInterval: 10000,
          },
          (loc) => {
            //pass to global store

            updateLocation(loc);
          }
        );
        // addEventListener((state) => {
        //   updateNetworkInfo(state);
        // }),
        // );

        //assign to global reference
        locationSubscriber = locationWatcher;
        // unsubscribeNetInfo = networkWatcher;
      } catch (e) {
        console.error(e);
        //report error here
        //get current memory usage-> analytics ->100MB
        //std memory usage->50MB
        // setError(e as any);
      }
    }
    init();
    return () => {
      // unregisterBackgroundFetchAsync()
      //cleanup memory
      locationSubscriber?.remove();
      unsubscribeNetInfo();
    };
  }, []);
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <Provider>
      <Stack>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="(app)"
        />
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="login"
        />
      </Stack>
    </Provider>
  );
}

async function getPermissionsOrExit() {
  // const wew = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
  // console.log("isRegistered", wew);
  const { granted } = await requestForegroundPermissionsAsync();
  if (granted) {
    const { granted: backgroundGrant } =
      await requestBackgroundPermissionsAsync();

    if (!backgroundGrant) {
      Alert.alert("enable background permission to sync on background");
    } else {
      if (false) {
        await startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Accuracy.BestForNavigation,
          timeInterval: FETCH_INTERVAL,
        });
      }
    }

    // console.log("should start");
    // const tasks = await TaskManager.getRegisteredTasksAsync();
    // console.log(tasks);
    // const geofence = await startLocationUpdatesAsync(BACKGROUND_FETCH_TASK, {
    //   accuracy: LocationAccuracy.Highest,
    //   timeInterval: 0,
    //   distanceInterval: 0,
    //   showsBackgroundLocationIndicator: true,
    //   foregroundService: {
    //     notificationTitle: "Using your location",
    //     notificationBody:
    //       "To turn off, go back to the app and switch something off.",
    //   },
    // });
    // console.log(geofence);
  } else {
    Alert.alert("sad");
  }
}

function cacheImages(images: any[]) {
  return images.map((image) => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}
