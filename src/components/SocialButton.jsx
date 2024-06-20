import React from 'react';
import { TouchableOpacity, Image, Text, View } from 'react-native';
import tw from '../customtwrnc';

const SocialButton = ({ logo, color, text, onPress, textColor }) => {
    return (
        <View style={tw`mt-5`}>
            <TouchableOpacity
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
            </TouchableOpacity>
        </View>
    );
};

export default SocialButton;