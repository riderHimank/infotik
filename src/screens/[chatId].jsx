import { StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { FIREBASE_AUTH, FIREBASE_DB } from '../../firebaseConfig'
import { useRoute } from '@react-navigation/core'
import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, orderBy, query } from 'firebase/firestore'

const Chat = () => {

    const currentUser = FIREBASE_AUTH.currentUser;
    const route = useRoute();
    const [chat, setChat] = useState(null);
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

    return (
        <View style={{ flex: 1 }}>
            <Text style={{ color: "red" }}>Here is {chat?.chatId}</Text>
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: currentUser.uid,
                }}
            />
        </View>
    )
}

export default Chat

const styles = StyleSheet.create({})