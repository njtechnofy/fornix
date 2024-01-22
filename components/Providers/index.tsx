import { getDatabase } from "@/db";
import tamaguiConfig from "@/tamagui.config";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { DatabaseProvider } from "@nozbe/watermelondb/DatabaseProvider";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

import { Suspense, createContext } from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TamaguiProvider, TamaguiProviderProps, Text, Theme } from "tamagui";

interface AuthContextType {
  userId: string;
}

const AuthContext = createContext<AuthContextType | null>(null);
const AuthProvider = AuthContext.Provider;

export function Provider({
  children,
  ...rest
}: Omit<TamaguiProviderProps, "config">) {
  const scheme = useColorScheme();
  const database = getDatabase();
  return (
    <TamaguiProvider
      config={tamaguiConfig}
      disableInjectCSS
      defaultTheme={scheme === "dark" ? "dark" : "light"}
      {...rest}
    >
      <Suspense fallback={<Text>Loading...</Text>}>
        <Theme name={scheme}>
          <ThemeProvider value={scheme === "light" ? DefaultTheme : DarkTheme}>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <SafeAreaProvider>
                <DatabaseProvider database={database}>
                  <BottomSheetModalProvider>
                    {children}
                  </BottomSheetModalProvider>
                </DatabaseProvider>
              </SafeAreaProvider>
            </GestureHandlerRootView>
          </ThemeProvider>
        </Theme>
      </Suspense>
    </TamaguiProvider>
  );
}
