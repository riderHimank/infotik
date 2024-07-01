import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Alert, Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import tw from '../customtwrnc'
import { COLORS } from '../constants'
import { EvilIcons, Feather } from '@expo/vector-icons'
import { ScrollView } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/core'
import { getUserById, getUserByQuery } from '../redux/actions/user'
import { addDoc, and, collection, doc, getDocs, or, query, setDoc, where } from 'firebase/firestore'
import { FIREBASE_AUTH, FIREBASE_DB } from '../../firebaseConfig'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Avatar } from 'react-native-paper'

const ChatScreen = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [chats, setChats] = useState([]);
    const navigation = useNavigation();
    const [isSearching, setSearching] = useState(false);
    const [searchId, setSearchId] = useState("");
    const [searchUser, setSearchUser] = useState(null);

    useEffect(() => {
        const fetchCurrent = async () => {
            try {
                const cur = await getUserById(FIREBASE_AUTH.currentUser.uid);
                setCurrentUser(cur);
            } catch (e) {
                console.log(e);
            }
        };

        const fetchChats = async () => {
            try {
                const q = query(collection(FIREBASE_DB, 'chats'), or(where("user1", "==", FIREBASE_AUTH.currentUser.uid), where("user2", "==", FIREBASE_AUTH.currentUser.uid)));
                let data = [];
                const d = await getDocs(q);
                d.forEach((doc) => data.push(doc.data()));
                setChats(data);
            } catch (e) {
                console.log(e);
            }
        };

        fetchCurrent();
        fetchChats();
    }, [chats]);

    const [searchquery, setsearchquery] = useState("");
    const [users, setUsers] = useState([]);
    const ref = useRef();

    useEffect(() => {
        if (searchquery) {
            ref.current = setTimeout(async () => {
                setSearching(!isSearching);
                const res = await getUserByQuery(searchquery);
                setSearching(false);
                setUsers(res);
            }, 1000)
            return () => {
                clearTimeout(ref.current);
            }
        }
        else {
            setUsers([]);
        }
    }, [searchquery])


    const tb = searchUser ? "Chat" : "Search";


    const handleSearch = async (user) => {
        try {
            const col = collection(FIREBASE_DB, 'chats');
            try {
                // setSearching(true);
                const q = query(col, or(
                    and(where("user1", "==", currentUser.uid), where("user2", "==", user.uid)),
                    and(where("user2", "==", currentUser.uid), where("user1", "==", user.uid))));
                const res = await getDocs(q);
                if (!(res.docs.length > 0)) {
                    const newChat = await addDoc(col, {
                        user1: currentUser.uid,
                        user1Pic: currentUser.photoURL || "",
                        user1username: currentUser.username,
                        user2: user.uid,
                        user2Pic: user.photoURL || "",
                        user2username: user.username,
                    });
                    await setDoc(doc(col, newChat.id), { chatId: newChat.id }, { merge: true });
                    // setSearching(false);
                    navigation.navigate('chat', { chatId: newChat.id });
                } else {
                    // setSearching(false);
                    navigation.navigate('chat', { chatId: res.docs[0].id });
                }
                setSearchId("");
                setSearchUser(null); // Reset searchUser to allow new searches
            } catch (e) {
                console.log(e);
            } finally {
                setSearching(false);
            }
        }
        catch (e) {
            console.log(e);
            setSearching(false);
        }
    };
    return (
        <SafeAreaView style={tw`flex flex-1 bg-[${COLORS.primary}]`}>
            <View style={tw`flex-row items-center justify-between p-4 mt-3 `}>
                <View style={tw`flex-row items-center px-2 gap-1 justify-center bg-white/60 h-10 flex-1 rounded-full`}>
                    <EvilIcons name="search" size={28} color="black" />
                    <TextInput
                        placeholder='Search a User...'
                        style={tw` flex-1 text-black bg-transparent `}
                        placeholderTextColor={"black"}
                        onChangeText={setsearchquery}
                        autoCapitalize='none'
                    />
                </View>
                {isSearching && <ActivityIndicator style={tw`absolute right-7`} size="large" color="blue" />}
            </View>
            {searchquery ?
                <ScrollView style={tw`border rounded-2xl p-2`}>
                    {!isSearching && users.length === 0 ? <Text style={tw`text-white text-center`}>No users found</Text> : null}
                    {users.map((user) => (
                        <TouchableOpacity key={user.uid} onPress={
                            () => {
                                setSearchUser(user);
                                setSearchId(user.uid);
                                console.log('SearchId in map:', searchId);
                                console.log('User in map:', user);
                                handleSearch(user);
                            }
                        }  >
                            <View style={tw`my-1 p-2 bg-black rounded-md flex flex-row gap-3 items-center`}>
                                {
                                    user?.photoURL ?
                                        <Image
                                            style={{ height: 32, width: 32, borderRadius: 999999, objectFit: 'contain' }}
                                            source={{ uri: user?.photoURL || "https://dummyimage.com/600x400/000/fff" }}
                                        />
                                        : <Avatar.Icon size={32} backgroundColor={COLORS.secondary} icon={"account"} />
                                }
                                <View>
                                    <Text style={tw`text-white font-montserrat mb-1 font-bold`}>{user.username}</Text>
                                    <Text style={tw`text-white/70 font-montserrat`}>{user.displayName}</Text>

                                </View>
                            </View>
                            <View style={tw`w-full h-[1px] bg-gray-500`}></View>
                        </TouchableOpacity>
                    ))}
                </ScrollView> :

                (chats.length === 0 ?
                    <>
                        <View style={tw`flex-1 gap-2 items-center`}>
                            <Text style={tw`text-base mt-6 pt-1 font-bold text-white`}>Direct Messages</Text>
                            <View style={tw`w-full h-[1px] bg-gray-500`}></View>
                            <View style={tw`justify-center mt-[50%]`}>
                                <Feather
                                    color="grey"
                                    size={58}
                                    resizeMode="contain"
                                    name="send"
                                />
                            </View>
                            <Text style={tw`text-base pt-4 font-bold text-gray-300`}>Message your friends</Text>
                            <Text style={tw`text-base text-white/50`}>Share videos or start a conversation</Text>
                        </View>
                    </> :
                    <>
                        <Text style={tw`text-white px-2 font-Montserrat`}>Messages</Text>
                        <ScrollView style={tw` py-2`}>
                            {chats?.map((chat, index) => (
                                <TouchableOpacity style={tw`flex-row items-center p-2`} key={index} onPress={() => {
                                    navigation.navigate('chat', { chatId: chat.chatId })
                                }}>
                                    {currentUser.uid === chat.user1 ?
                                        (chat.user2Pic ?
                                            <Image
                                                source={{ uri: chat.user2Pic }}
                                                style={{ width: 36, height: 36, borderRadius: 18 }}
                                            /> :
                                            <Avatar.Icon size={36} icon={"account"} />
                                        ) :
                                        (chat.user1Pic ?
                                            <Image
                                                source={{ uri: chat.user1Pic }}
                                                style={{ width: 36, height: 36, borderRadius: 18 }}
                                            /> :
                                            <Avatar.Icon size={36} icon={"account"} />
                                        )
                                    }
                                    {/* Determine and display the other user's username */}
                                    <Text style={tw`text-[#fff] ml-2`}>
                                        {currentUser.uid === chat.user1 ? chat.user2username : chat.user1username}
                                    </Text>
                                    {/* <Text style={tw`text-[#fff]`}>{chat.chatId}</Text> */}
                                </TouchableOpacity>

                            ))}
                        </ScrollView>
                    </>

                )}
        </SafeAreaView>

    )
}

export default ChatScreen