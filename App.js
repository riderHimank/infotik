import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Main from "./Main.jsx";
import tw from "twrnc";
import { Platform } from "react-native";
import { COLORS } from "./src/constants/index.js";
import { store } from "./src/redux/index.js";
import { Provider } from "react-redux";
import MessageProvider from "./src/providers/MessageProvider.jsx";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar as RNStatusBar } from "react-native"; // Importing StatusBar from react-native

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Montserrat: require("./assets/fonts/Montserrat-Regular.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }
  const dynamicTopMargin =
    Platform.OS === "android" ? RNStatusBar.currentHeight : 0;

  return (
    <>
      <Provider store={store}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <MessageProvider>
            <SafeAreaProvider style={tw`mt-${dynamicTopMargin}px`}>
              <StatusBar style="light" backgroundColor={COLORS.primary} />
              <Main />
            </SafeAreaProvider>
          </MessageProvider>
        </GestureHandlerRootView>
      </Provider>
    </>
  );
}
