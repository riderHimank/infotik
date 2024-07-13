import { useNavigation, useRoute } from '@react-navigation/core'
import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query } from 'firebase/firestore'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import { Avatar } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FIREBASE_AUTH, FIREBASE_DB } from '../../firebaseConfig'
import tw from '../customtwrnc'
import { COLORS } from '../constants'
import ReelCard from "../components/ReelCard"
import { useSelector } from 'react-redux'

const Chat = () => {

    const currentUser = FIREBASE_AUTH.currentUser;
    const route = useRoute();
    const [chat, setChat] = useState(null);
    const navigation = useNavigation();

    const getChatDetails = async () => {
        try {
            const chatRef = doc(collection(FIREBASE_DB, 'chats'), route.params.chatId)
            const chatSnapshot = await getDoc(chatRef);
            // let data = [];
            // chatSnapshot.forEach(doc => {
            //     data.push({ ...doc.data() });
            // });
            setChat(chatSnapshot.data());
            // console.log("??", chat, data);
        } catch (r) {
            console.log(r);
        }
    }

    const fetchMessages = async () => {
        try {
            // const Snapshot = await getDocs(col);
            const col = collection(FIREBASE_DB, `chats/${route.params.chatId}/messages`);
            const q = query(col, orderBy('createdAt', 'desc'));
            onSnapshot(q, (Snapshot) => {
                let data = [];
                Snapshot.docs.forEach(doc => {
                    data.push(doc.data());
                })
                setMessages(data);
            })
        } catch (e) {
            console.log(e);
        }
    }

    const [messages, setMessages] = useState([])

    useEffect(() => {
        // setMessages([
        //     {
        //         _id: 1,
        //         text: 'Hello developer',
        //         createdAt: new Date(),
        //         user: {
        //             _id: 2,
        //             name: 'React Native',
        //             avatar: 'https://dummyjson.com/icon/emilys/128',
        //         },
        //     },
        // ])
        getChatDetails()
        fetchMessages();

    }, []);


    const onSend = (messageArray = []) => {
        // console.log(messageArray);
        const msg = messageArray[0];
        const msgModel = {
            ...msg,
            senderId: currentUser.uid,
            receiverId: chat.user1 === currentUser.uid ? chat.user2 : chat.user1,
            createdAt: new Date().toISOString()
        }
        // console.log(msgModel);
        const c = collection(FIREBASE_DB, `chats/${route.params.chatId}/messages`);
        addDoc(c, msgModel).then(() => {
            GiftedChat.append(msgModel, messages);
        }).catch((e) => {
            console.log(e);
        })
    }

    const renderImage = (props) => {
        const otherUserPic = currentUser.uid === chat.user1 ? chat.user2Pic : chat.user1Pic;
        return (
            <TouchableOpacity onPress={() => {
                const otherUserId = currentUser.uid === chat.user1 ? chat.user2 : chat.user1;
                navigation.navigate("profile", { uid: otherUserId })
            }} >
                {otherUserPic ? <Image
                    source={{ uri: otherUserPic }}
                    style={{ width: 40, height: 40, borderRadius: 20 }}
                /> : <Avatar.Icon size={40} icon={"account"} />}
            </TouchableOpacity>
        )
    }
    useLayoutEffect(() => {
        if (chat) {
            const otherUserId = currentUser.uid === chat.user1 ? chat.user2 : chat.user1;
            const otherUserName = currentUser.uid === chat.user1 ? chat.user2username : chat.user1username;
            const name = currentUser.uid === chat.user1 ? chat.user2displayName : chat.user1displayName;; // Replace with actual username
            const otherUserPic = currentUser.uid === chat.user1 ? chat.user2Pic : chat.user1Pic;

            const CustomHeaderTitle = () => (
                <TouchableOpacity style={{ flexDirection: 'row', flex: 1, alignItems: 'center', gap: 6 }} onPress={() => {
                    navigation.navigate("profile", { uid: otherUserId })
                }}>

                    {otherUserPic ? <Image
                        source={{ uri: otherUserPic }}
                        style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
                    /> : <Avatar.Icon size={40} icon={"account"} />}
                    <View style={tw``}>
                        <Text style={tw`text-base text-white font-bold`}>{name}</Text>
                        <Text style={tw`text-sm text-white`}>{otherUserName}</Text>
                    </View>
                </TouchableOpacity>
            );

            navigation.setOptions({
                headerTitle: () => <CustomHeaderTitle />,
                headerStyle: {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    shadowColor: 'transparent',
                },
                headerTintColor: COLORS.white,
            });
        }
    }, [chat, navigation]);

    const { posts } = useSelector(state => state.user);

    const onVideoPress = (post) => {
        // console.log(post);
        let copy = JSON.parse(JSON.stringify(posts));
        copy = copy.filter(item => item.uid != post.uid)
        copy.splice(0, 0, post);
        // console.log(copy);
        navigation.navigate('userPosts', { posts: copy, profile: true, comingFromChat: true })
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.9)' }}>
            {messages.length === 0 && <View style={tw`flex-1 justify-center items-center mt-[50%]`}>
                <Text style={tw`text-lg text-white font-montserrat`}>No messages yet</Text>
                <Text style={tw`text-lg text-white font-montserrat`}>Start by sending a message.</Text>
            </View>}
            {chat && <GiftedChat
                isTyping={true}
                renderAvatarOnTop={true}
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: currentUser.uid,
                }}
                alwaysShowSend
                isLoadingEarlier
                renderLoading={() => <ActivityIndicator size="small" color="blue" style={tw`mt-2`} />}
                renderAvatar={renderImage}
                renderMessageVideo={props => {
                    // console.log(props.currentMessage);
                    return (<ReelCard description={""} media={[{}, props.currentMessage?.post?.media[1]]} onPress={() => onVideoPress(props.currentMessage.post)} />)
                }}
                scrollToBottom
            />}
        </SafeAreaView>
    )
}

export default Chat

const styles = StyleSheet.create({})