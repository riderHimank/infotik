import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc';

const Button = ({ children, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={tw`w-48`}>
            <LinearGradient
                colors={['#53C8D8', '#668AF7']}
                style={[tw`p-2 rounded-3xl flex items-center justify-center`, styles.button]}

            >
                <Text style={tw.style(`text-white text-sm`, { fontFamily: 'Montserrat', fontSize: 17 })}>{children}</Text>
            </LinearGradient>
        </TouchableOpacity>

    )
}
const styles = StyleSheet.create({
    touchable: {
        minHeight: 48,
        minWidth: 48,

    },
    button: {
        justifyContent: 'center',
        minHeight: 48,
    },
});


export default Button