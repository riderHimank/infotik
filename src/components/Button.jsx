import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc';

const Button = ({ children, onPress, loading, disabled }) => {
    return (
        <TouchableOpacity onPress={onPress} style={tw`w-48`} disabled={disabled}>
            <LinearGradient
                colors={['#53C8D8', '#668AF7']}
                style={[tw`p-2 rounded-3xl flex flex-row items-center justify-center`, styles.button]}

            >

                <Text style={tw.style(`text-white text-sm pr-2`, { fontFamily: 'Montserrat', fontSize: 17 })}>{children}</Text>
                {loading && (
                    <ActivityIndicator size="small" color="#fff" />
                )}
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