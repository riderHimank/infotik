import { ActivityIndicator, FlatList, Image, Modal, Text, ToastAndroid, TouchableOpacity, View } from "react-native";
import tw from "../customtwrnc";
import { ScrollView } from "react-native-gesture-handler";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../firebaseConfig";
import { Avatar } from "react-native-paper";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import uuid from "uuid-random";
import { addDoc, collection } from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
const ShareModal = ({ isVisible, onClose, chats, itemm }) => {
    const currentUser = FIREBASE_AUTH.currentUser;
    const renderItem = ({ item }) => (
        userPic = currentUser ? item.user2Pic : item.user1Pic,
        <>
            <View style={tw`w-full h-[1px] bg-gray-500`}></View>
            <View style={tw`flex-row items-center p-2 justify-between`}>
                <View style={tw`flex-row items-center border  justify-between`}>
                    {userPic ? <Image source={{ uri: userPic }} style={tw`w-10 h-10 rounded-full mr-2`} /> : <Avatar.Icon style={tw`mr-2`} size={40} icon={"account"} />}
                    <Text style={tw`text-white`}>{item.user1 === currentUser.uid ? item.user2username : item.user1username}</Text>
                </View>
                <TouchableOpacity style={tw` px-2 rounded-md border-2 border-white flex flex-row items-center gap-1`} onPress={() => {
                    handleShare(item);
                    onClose();
                }}>
                    <Text style={tw`text-white`}>Send</Text>
                </TouchableOpacity>
            </View>
            <View style={tw`w-full h-[1px] bg-gray-500`}></View>
        </>
    );


    const handleShare = async (item) => {
        try {
            console.log("Item in funcn", item);
            const msg = {
                _id: uuid(),
                text: " ",
                createdAt: new Date().toISOString(),
                senderId: FIREBASE_AUTH.currentUser.uid,
                receiverId:
                    FIREBASE_AUTH.currentUser.uid === item.user1
                        ? item.user2
                        : item.user1,
                user: {
                    _id: FIREBASE_AUTH.currentUser.uid,
                },
                video: itemm.media[0],
                post: JSON.parse(JSON.stringify(itemm)),
            };
            const c = collection(
                FIREBASE_DB,
                `chats/${item.chatId}/messages`
            );
            await addDoc(c, msg);
            ToastAndroid.show('Post shared!.', ToastAndroid.SHORT);
            console.log("done");
        } catch (r) {
            console.log(r);
        }
    };

    return (
        <Modal visible={isVisible} onRequestClose={onClose} transparent>
            <SafeAreaView style={tw`flex-1 justify-end items-center`}>
                <View style={tw`w-full h-full max-h-[71%] bg-black `}>
                    <View style={tw`flex flex-row justify-end items-center p-2 pb-4 `}>
                        <TouchableOpacity onPress={onClose} style={{ flexDirection: 'row', justifyContent: 'flex-end', marginRight: 10 }}>
                            <Feather
                                name="x"
                                color="#fff"
                                size={25}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={chats}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.chatId}
                        style={tw`w-full h-[30%] bg-black`}
                    />
                </View>
            </SafeAreaView>
        </Modal>
    );
};
export default ShareModal;