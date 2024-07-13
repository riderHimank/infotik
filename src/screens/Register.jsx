import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Dimensions, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import FbLogo from '../../assets/fb-icon.png';
import GoogleLogo from '../../assets/google_icon.png';
import Button from '../components/Button';
import Input from '../components/Input';
import SocialButton from '../components/SocialButton';
import { COLORS } from '../constants';
import tw from '../customtwrnc';
import { configureGoogleSignIn, getUsername, GoogleSignUp, register, saveUserField } from '../redux/actions/user';
import Toast from 'react-native-toast-message';


const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [loading, setloading] = useState(false);

    const { usernames } = useSelector(store => store.user);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [showForm, setShowForm] = useState(false);
    const [isUsernameSet, setIsUsernameSet] = useState(true);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: showForm,
            headerLeft: () => (
                <TouchableOpacity onPress={() => setShowForm(false)}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
            ),
            headerTitle: () => null,
            headerStyle: {
                backgroundColor: COLORS.primary,
            },
        });
    }, [navigation, showForm]);

    useEffect(() => {
        configureGoogleSignIn();

    }, []);

    const handleGoogleSignIn = async () => {
        try {
            setloading(true);
            const res = await dispatch(GoogleSignUp());
            setloading(false);
            if (res && typeof res === 'object') {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'home' }],
                });
            } else if (res) {
                setIsUsernameSet(false);
            }
        } catch (error) {
            setloading(false);
            Toast.show({
                type: "error",
                text1: "Google Sign in failed!",
                text2: 'Please try again',
                text1Style: tw`text-[14px] text-[${COLORS.primary}]`,
                text2Style: tw`text-[12px] text-red-600`,
            });
        }
    }

    const handleSetUsername = async () => {
        if (!username) {
            Toast.show({
                type: "error",
                text1: "Username cannot be empty!",
                text2: " Please enter a username",
                text1Style: tw`text-[14px] text-[${COLORS.primary}]`,
                text2Style: tw`text-[12px] text-red-600`,
            });
            return;
        }
        setloading(true);
        const success = await dispatch(saveUserField("username", username));
        setloading(false);
        if (success) {
            setIsUsernameSet(true); // Username is set, now navigate to the keyword screen
            navigation.reset({
                index: 0,
                routes: [{ name: 'keyword' }],
            });
        } else {
            setloading(false);
            Toast.show({
                type: "error",
                text1: "Username exists!",
                text2: "Please enter a different username",
                text1Style: tw`text-[14px] text-[${COLORS.primary}]`,
                text2Style: tw`text-[12px] text-red-600`,
            });
        }
    }

    const handleRegister = async (async) => {
        setloading(true);
        if (!email || !password || !name) {
            setloading(false);
            Toast.show({
                type: "error",
                text1: "Incomplete fields",
                text2: "Please fill all the fields",
                text1Style: tw`text-[14px] text-[${COLORS.primary}]`,
                text2Style: tw`text-[12px] text-red-600`,
            });
            return
        }
        const res = await dispatch(register(email, password, name, username));
        setloading(false);
        if (res) {
            navigation.reset({
                index: 0,
                routes: [{ name: 'keyword' }],
            });
        }
    }

    useEffect(() => {
        if (username !== username.toLowerCase()) {
            setError('Username must be in lowercase');
        } else if (usernames.includes(username)) {
            setError('This username is already taken');
        } else {
            setError('');
        }
    }, [username]);

    useEffect(() => {
        (async function () {
            dispatch(getUsername())
        })()
    }, [])

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;


    return (
        <SafeAreaView style={tw`flex-1 bg-[${COLORS.primary}] flex justify-start items-center`}>
            <ScrollView>
                {!isUsernameSet && (
                    <View style={tw`w-full p-4 flex justify-center`}>
                        <Text style={tw`text-white justify-center items-center text-xl mt-[50%]`}> Set your Username :</Text>
                        <Input
                            autoCapitalize='none'
                            placeholder={"Enter Your username"}
                            value={username}
                            setValue={setUsername}
                        />
                        {error && <Text style={tw`text-xs text-red-400 px-2 font-montserrat`}>{error}</Text>}
                        <View style={tw`items-center`}>
                            <Button loading={loading} disabled={loading} onPress={handleSetUsername}>Set Username</Button>
                        </View>
                    </View>
                )}
                {isUsernameSet && <View style={tw` w-[18rem] mt-10 rounded-md`}>
                    <View style={tw`flex items-center mt-10 `}>
                        <Image resizeMode='contain' source={require('../../assets/bented.png')} style={{ width: windowWidth * (showForm ? 0.6 : 0.7), height: windowHeight * (showForm ? 0.2 : 0.3), marginBottom: 2 }} />
                    </View>
                    <View style={tw`mt-5`}>
                        {showForm ? (
                            <View style={tw` mb-8`} >
                                <Input placeholder={"Enter Your name"} value={name} setValue={setName} />
                                <Input autoCapitalize='none' placeholder={"Enter Your username"} value={username} setValue={setUsername} />
                                {error && <Text style={tw`text-xs text-red-400 px-2 font-montserrat`}>{error}</Text>}

                                <Input keyboardType={'email-address'} placeholder={"Enter Your email"} value={email} setValue={setEmail} />
                                <Input placeholder={"Enter Your password"} value={password} setValue={setPassword} secureTextEntry={true} />
                                <View style={tw`flex flex-row justify-center items-center mt-1 `}>
                                    <Button loading={loading} disabled={loading} onPress={handleRegister}>SIGN UP
                                    </Button>
                                </View>
                            </View>
                        ) : (
                            <>
                                <SocialButton
                                    logo={GoogleLogo}
                                    color="#fff"
                                    textColor={'rgb(64 64 64);'}
                                    text="Sign in with Google"
                                    onPress={handleGoogleSignIn}
                                    disabled={loading}
                                    loading={loading}
                                />
                                <SocialButton
                                    logo={FbLogo}
                                    color="rgb(59 130 246)"
                                    text="Sign in with Facebook"
                                    textColor={'white'}
                                    onPress={() => {
                                        Toast.show({
                                            type: "error",
                                            text1: "Feature coming soon!",
                                            text2: "This feature is not available yet!",
                                            text1Style: tw`text-[14px] text-[${COLORS.primary}]`,
                                            text2Style: tw`text-[12px] text-yellow-600`,
                                        });
                                    }}
                                />
                                <View style={tw`flex flex-col items-center mt-6 gap-2`}>
                                    <Text style={tw.style(`text-white text-[13px]`, { fontFamily: 'Montserrat' })}>Or</Text>
                                    <TouchableOpacity onPress={() => setShowForm(true)}>
                                        <Text style={tw.style(`text-[${COLORS.secondary}] text-[14px]`, { fontFamily: 'Montserrat' })}>Sign Up with Email</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={tw`flex flex-row justify-center gap-1 mb-4 mt-4`}>
                                    <Text style={tw.style(`text-[${COLORS.white}] text-[14px]`, { fontFamily: 'Montserrat' })}>You Already have an account?</Text>
                                    <TouchableOpacity onPress={() => navigation.navigate('login')}>
                                        <Text style={tw.style(`text-[${COLORS.secondary}] text-[14px]`, { fontFamily: 'Montserrat' })}>Sign In</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                </View>}
            </ScrollView>

        </SafeAreaView>
    )
}

export default Register