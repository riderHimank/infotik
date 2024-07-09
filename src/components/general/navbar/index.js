import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { COLORS } from "../../../constants";
import tw from "../../../customtwrnc";
import { logout } from "../../../redux/actions/user";
import { handleLinkOpen } from "../../../utils/utils";
import styles from "./styles";
const window = Dimensions.get("window");

export default function NavBarGeneral(
  {
    title = "NavBarGeneral",
    leftButton = { display: true },
    rightButton = { display: false },
  },
  setOpen
) {
  const { open } = useSelector((store) => store.user);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigation.reset({
      index: 0,
      routes: [{ name: "login" }],
    });
  };

  const handleOpen = () => {
    dispatch({ type: "setOpen", open: true });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => (leftButton.display ? navigation.goBack() : null)}
      >
        {leftButton.display && (
          <Feather name="arrow-left" size={26} color={"white"} />
        )}
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          rightButton.action ? rightButton.action() : handleOpen()
        }
      >
        {rightButton.display && (
          <Feather
            name={rightButton.name}
            size={26}
            color={rightButton.color ?? COLORS.secondary}
          />
        )}
      </TouchableOpacity>

      <View
        style={tw`w-[120px] p-2 bg-white absolute top-10 z-10 right-0 justify-center items-center rounded-md flex flex-col gap-2 ${
          open ? "" : "hidden"
        }`}
      >
        <TouchableOpacity
          onPress={() => handleLinkOpen("https://www.infotik.co/privacy")}
        >
          <Text style={tw` text-lg`}>Privacy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleLinkOpen("https://www.infotik.co/guidelines")}
        >
          <Text style={tw`text-lg`}>Guidelines</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout}>
          <Text
            style={tw` text-lg bg-red-500 px-4 border rounded-full hover:text-black`}
          >
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
