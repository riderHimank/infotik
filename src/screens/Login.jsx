import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Dimensions, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import tw from 'twrnc';
import Button from '../components/Button';
import Input from '../components/Input';
import { COLORS } from '../constants';
import { login } from '../redux/actions/user';
import Toast from 'react-native-toast-message';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setloading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isAuth } = useSelector(store => store.user);




  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "Incorrect values",
        text2: "Please enter email and password",
        text1Style: tw`text-[14px] text-[${COLORS.primary}]`,
        text2Style: tw`text-[12px] text-red-600`,
      });
      return
    }
    setloading(true);

    const res = await dispatch(login(email, password));
    setloading(false);
    if (res) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'home' }],
      });
    }
    else {
      setloading(false);
      Toast.show({
        type: "error",
        text1: "Incorrect email/password",
        text2: "Please enter correct email and password",
        text1Style: tw`text-[14px] text-[${COLORS.primary}]`,
        text2Style: tw`text-[12px] text-red-600`,

      });

    }
  }
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  return (
    <SafeAreaView style={tw`flex-1 bg-[${COLORS.primary}] flex justify-start items-center`}>
      <ScrollView>
        <View style={tw` w-[18rem] gap-4 mt-10 rounded-md`}>
          <View style={tw`flex items-center mt-10`}>
            <Image resizeMode="contain" source={require('../../assets/bented.png')} style={{ width: windowWidth * 0.7, height: windowHeight * 0.3, marginBottom: 2, }} />
          </View>

          <View style={tw`mt-10`}>
            <Input placeholder={"Enter Your email"} value={email} setValue={setEmail} />
            <Input placeholder={"Enter Your password"} value={password} setValue={setPassword} secureTextEntry={true} />

            <View style={tw`mb-3 mt-1 flex flex-row justify-center`}>
              <View style={tw`flex flex-row  gap-1`}>
                <Text style={tw.style(`text-[${COLORS.registerText}] text-[14px]`, { fontFamily: 'Montserrat' })}>Don't have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('register')}  >
                  <Text style={tw.style(`text-[${COLORS.coloredText}] text-[14px]`, { fontFamily: 'Montserrat' })} > Sign Up  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <TouchableOpacity onPress={() =>
                Toast.show({
                  type: "info",
                  text1: "Coming soon!",
                  text2: "This feature is not available yet!",
                  text1Style: tw`text-[14px] text-[${COLORS.primary}]`,
                  text2Style: tw`text-[12px] text-green-600`,
                })}>
                <Text style={tw.style(` text-center text-white text-[13px] mb-3`, { fontFamily: 'Montserrat' })}> Forgot Password?</Text>
              </TouchableOpacity>
            </View>
            <View style={tw`items-center mt-1`}>
              <Button disabled={loading} loading={loading} onPress={handleLogin} >SIGN IN</Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Login