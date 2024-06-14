import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import { LinearGradient } from 'expo-linear-gradient';

const Button = ({ children, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.touchable}>
            <LinearGradient
                colors={['#53C8D8', '#668AF7']}
                style={[tw`p-2 rounded-md flex items-center`, styles.button]}

            >
                <Text style={tw.style(`text-white text-sm`, { fontFamily: 'Montserrat', fontSize: 17 })}>{children}</Text>
            </LinearGradient>
        </TouchableOpacity>

    )
}
const styles = StyleSheet.create({
    touchable: {
        minHeight: 48,
        minWidth: 100,
    },
    button: {
        justifyContent: 'center',
        minHeight: 48,
    },
});


export default Button