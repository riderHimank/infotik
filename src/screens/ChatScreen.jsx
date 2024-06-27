import React, { useEffect } from 'react'
import { Alert, SafeAreaView, Text, View } from 'react-native'
import tw from '../customtwrnc'
import { COLORS } from '../constants'
import { Feather } from '@expo/vector-icons'

const ChatScreen = () => {
    useEffect(() => {
        // This code runs when the component mounts
        Alert.alert("Messaging coming soon!", message = "We are working on it, Stay Tuned!",);
    }, []);
    return (
        <SafeAreaView style={tw`bg-[${COLORS.primary}] flex-1 gap-2  items-center`}>
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

        </SafeAreaView>
    )
}

export default ChatScreen