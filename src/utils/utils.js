import { Linking } from "react-native";
import Toast from "react-native-toast-message";

export const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

export const handleLinkOpen = (link) => {
  try {
    Linking.openURL(link);
  } catch {
    Toast.show({
      type: "error",
      text1: "Error opening link!",
      text2: "",
      text1Style: tw`text-[14px] text-red-600]`,
    });
  }
};
