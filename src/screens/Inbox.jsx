import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS } from '../constants'
import tw from '../customtwrnc'
import { collection, getDocs, or, query, where } from 'firebase/firestore'
import { FIREBASE_AUTH, FIREBASE_DB } from '../../firebaseConfig'
import { Touchable } from 'react-native'
import { useNavigation } from '@react-navigation/core'

const Inbox = () => {

    const currentUser = FIREBASE_AUTH.currentUser;
    const [chats, setChats] = useState([]);
    const navigation = useNavigation();

    const fetchChats = async () => {
        try {
            // console.log(1);
            const q = query(collection(FIREBASE_DB, 'chats'), or(where("user1", "==", currentUser.uid), where("user2", "==", currentUser.uid)));
            // console.log(q);
            const u = await getDocs(q);
            // console.log(userSnap);
            let data = [];
            u.forEach(doc => {
                data.push(doc.data());
            })
            setChats(prev => [...prev, ...data]);
            // console.log(3);
        } catch (e) {
            console.log(e);
        }
    }
    // console.log(currentUser);
    useEffect(() => {
        fetchChats();
    }, [])

    return (
        <View style={tw`flex-1 bg-[${COLORS.primary}] py-4`}>
            {chats?.map((chat, index) => (
                <TouchableOpacity key={index} onPress={() => {
                    navigation.navigate('chat', { chatId: chat.chatId })
                }}>
                    <Text style={tw`text-[#fff]`}>{chat.chatId}</Text>
                </TouchableOpacity>

            ))}
        </View>
    )
}

export default Inbox

const styles = StyleSheet.create({})