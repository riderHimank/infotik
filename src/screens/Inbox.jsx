import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS } from '../constants'
import tw from '../customtwrnc'
import { addDoc, and, collection, doc, documentId, getDoc, getDocs, onSnapshot, or, query, setDoc, where } from 'firebase/firestore'
import { FIREBASE_AUTH, FIREBASE_DB } from '../../firebaseConfig'
import { Touchable } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import { getUserById } from '../redux/actions/user'

const Inbox = () => {

    const [currentUser, setCurrentUser] = useState(null);
    const [chats, setChats] = useState([]);
    const navigation = useNavigation();

    const fetchCurrent = async () => {
        try {
            const cur = await getUserById(FIREBASE_AUTH.currentUser.uid);
            setCurrentUser(cur);
        } catch (e) {
            console.log(e);
        }

    }

    const fetchChats = async () => {
        try {
            const q = query(collection(FIREBASE_DB, 'chats'), or(where("user1", "==", FIREBASE_AUTH.currentUser.uid), where("user2", "==", FIREBASE_AUTH.currentUser.uid)));
            let data = [];
            // onSnapshot(collection(FIREBASE_DB, 'chats'), Snap => {
            // })
            const d = await (getDocs(q));
            d.forEach((doc) => {
                data.push(doc.data());
            })
            setChats(data);
        } catch (e) {
            console.log(e);
        }
    }

    const [searchId, setSearchId] = useState("");
    const [search, setSearch] = useState(false);
    const [isSearching, setSearching] = useState(false);
    const [searchUser, setSearchUser] = useState(null);
    const [re, setRe] = useState(false);

    const bot = search ? 60 : 10;
    const tb = searchUser ? "Chat" : "Search";
    useEffect(() => {
        fetchCurrent();
        fetchChats();
    }, [re])

    // console.log(FIREBASE_AUTH.currentUser.uid);

    const handleSearch = async () => {
        setSearching(true);
        if (tb === "Search") {
            try {
                const user = await getUserById(searchId);
                if (user) {
                    setSearchUser(user);
                }
                setSearching(false);
            } catch (e) {
                setSearching(false);
                console.log(e);
            }
        } else {
            const col = collection(FIREBASE_DB, 'chats');
            try {
                const q = query(collection(FIREBASE_DB, 'chats'), or(
                    and(where("user1", "==", currentUser.uid), where("user2", "==", searchId)),
                    and(where("user2", "==", currentUser.uid), where("user1", "==", searchId))));
                const res = await getDocs(q);
                if (!(res.docs.length > 0)) {
                    const newChat = await addDoc(col, {
                        user1: currentUser.uid,
                        user1Pic: currentUser.photoURL,
                        user1username: currentUser.username,
                        user2: searchId,
                        user2Pic: searchUser.photoURL,
                        user2username: searchUser.username,
                    });
                    // console.log(newChat.id);
                    setSearching(false);
                    setSearchId("");
                    await setDoc(doc(col, newChat.id), {
                        chatId: newChat.id,
                    }, {
                        merge: true,
                    })
                    navigation.navigate('chat', { chatId: newChat.id })
                    setRe(!re);
                }
                else {
                    setSearching(false);
                    setSearchId("");
                    setRe(!re);
                    navigation.navigate('chat', { chatId: res.docs[0].id })
                }
            } catch (e) {
                setSearching(false);
                setSearchId("");
                console.log(e);
            }
        }
    }
    return (
        <>
            <ScrollView style={tw`flex-1 bg-[${COLORS.primary}] py-4`}>
                {chats?.map((chat, index) => (
                    <TouchableOpacity key={index} onPress={() => {
                        navigation.navigate('chat', { chatId: chat.chatId })
                    }}>
                        <Text style={tw`text-[#fff]`}>{chat.chatId}</Text>
                    </TouchableOpacity>

                ))}
            </ScrollView>
            <TouchableOpacity onPress={() => setSearch(!search)} style={{ position: "absolute", right: 10, bottom: bot, flex: 1, width: 50, height: 50, borderRadius: 50, backgroundColor: "#58b5f1", alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: "white", fontSize: 40 }}>+</Text>
            </TouchableOpacity>
            {search && <View style={tw`absolute w-full bottom-0 h-12 bg-black/90 flex-row items-center justify-between px-2 border-t border-gray-500`}>
                <TextInput
                    placeholder='Add Search Id...'
                    style={tw`h-10  px-4 flex-1 text-white`}
                    placeholderTextColor={"grey"}
                    value={searchId}
                    onChangeText={(txt) => setSearchId(txt)}
                />
                <TouchableOpacity onPress={handleSearch} style={tw`bg-[#58b5f1] px-4 py-1 rounded-full ml-2`}>
                    {isSearching ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={tw`text-white`}>{tb}</Text>
                    )}
                </TouchableOpacity>
            </View>}
        </>
    )
}

export default Inbox

const styles = StyleSheet.create({})