import React from 'react';
import { TouchableOpacity, Image, Text, View, ActivityIndicator } from 'react-native';
import tw from '../customtwrnc';

const SocialButton = ({ logo, color, text, onPress, textColor, loading, disabled }) => {
    return (
        <View style={tw`mt-5`}>
            <TouchableOpacity
                disabled={disabled}
                style={{
                    minHeight: 48,
                    minWidth: 280,
                    borderRadius: 24,
                    backgroundColor: color,
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    flexDirection: 'row',
                }}
                onPress={onPress}
            >
                <Image source={logo} style={{ width: 30, height: 30, borderRadius: 15 }} />
                <Text style={{ color: textColor, fontSize: 16, fontWeight: 'bold' }}>{text}</Text>
                {loading && (
                    <ActivityIndicator size="small" color="#000" />
                )}
            </TouchableOpacity>
        </View>
    );
};

export default SocialButton;