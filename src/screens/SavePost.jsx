import { StackActions, useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View, StyleSheet, ScrollView } from 'react-native'
import { Entypo, EvilIcons, Feather } from '@expo/vector-icons'
import { useDispatch } from 'react-redux'
import { createPost } from '../redux/actions/user'
import tw from 'twrnc'
import { COLORS } from '../constants/index'
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../components/Button'
import * as ImagePicker from 'expo-image-picker'
import { Icon } from 'react-native-paper'


const allKeyword = [
    '#News',
    '#Politics',
    '#Science',
    '#Technology',
    '#Health',
    '#Environment',
    '#Education',
    '#History',
    '#Sports',
    '#AI',
    '#Business',
    '#Finance',
    '#Medicine',
    '#Culture',
    '#Art',
    '#Fashion',
    '#Robotics',
    '#Cooking',
    '#DIY',
    '#Fitness',
    '#Wellness',
    '#Nature',
    '#Space',
    '#Philosophy',
    '#Psychology',
    '#Sustainability'
]



const GradientText = ({ children, selected, onPress }) => {
    return (
        <>
            {
                !selected ? (
                    <TouchableOpacity onPress={onPress}>
                        <View

                            style={tw`p-1 px-2 rounded-2xl flex items-center border border-[${COLORS.secondary}]`}

                        >
                            <Text style={tw`text-white text-sm font-bold text-[${COLORS.secondary}]`}>{children}</Text>
                        </View>
                    </TouchableOpacity>
                ) :
                    (
                        <TouchableOpacity style={tw` p-1 px-2  flex flex-row items-center justify-center bg-[${COLORS.keywordColor}] rounded-2xl border`} onPress={onPress}>
                            {/* <LinearGradient
                                colors={['#53C8D8', '#668AF7']}
                                style={tw`p-1 px-1 rounded-3xl flex flex-row items-center justify-center`}

                            > */}
                            <Text style={tw`text-black text-sm font-bold`}>{children}</Text>
                            <TouchableOpacity onPress={onPress}>
                                <Entypo name='cross' size={20} color={'#fff'} />
                            </TouchableOpacity>
                            {/* </LinearGradient> */}
                        </TouchableOpacity>
                    )
            }
        </>

    );
};

export default function SavePostScreen(props) {
    const [description, setDescription] = useState('')
    const [requestRunning, setRequestRunning] = useState(false)
    const [newsdescription, setnewsdescription] = useState('');
    const [newstitle, setnewstitle] = useState('');
    const [newslink, setnewslink] = useState('');
    const [hashtags, setHashtags] = useState([]);
    const [open, setOpen] = useState(false)
    const [thumbnails, setThumbNail] = useState('')
    const navigation = useNavigation()



    const pickFromGallery = async () => {

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [16, 9],
            quality: 1,
        });

        if (!result.canceled) {

            setThumbNail(result.assets[0].uri)

        }
    }

    useEffect(() => {
        setThumbNail(props.route.params.sourceThumb)
    }, [props.route.params.sourceThumb])


    const dispatch = useDispatch();
    const handleSavePost = async () => {
        setRequestRunning(true)
        const res = await createPost(description, props.route.params.source, thumbnails, newstitle, newsdescription, newslink, hashtags);
        if (res) {
            navigation.dispatch(StackActions.popToTop());
            setRequestRunning(false);
        } else {
            setRequestRunning(false)
        }
    }

    if (requestRunning) {
        return (
            <View style={styles.uploadingContainer}>
                <ActivityIndicator size={79} color={COLORS.secondary} />
            </View>
        )
    }

    const handleSelect = (k) => {
        if (hashtags.length >= 5 && !hashtags.includes(k)) {
            return
        }
        setHashtags(prev => {
            if (prev.includes(k)) {
                return prev.filter(ke => ke != k);
            } else {
                return [...prev, k];
            }
        })
    }

    useEffect(() => {
        handleCheckUrl(newslink);
    }, [newslink]);
    const [isValid, setIsValid] = useState(false);
    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleCheckUrl = (url) => {
        setIsValid(isValidUrl(url));
    };
    return (

        <ScrollView style={styles.container}>
            <View style={styles.formContainer}>
                <Image
                    style={styles.mediaPreview}
                    source={{ uri: thumbnails }}
                />

                <TouchableOpacity
                    onPress={pickFromGallery}
                    style={tw`px-8 border w-50 flex flex-row items-center border-[${COLORS.secondary}] h-16 rounded-md`}>
                    <Text style={tw`text-center text-xl text-[${COLORS.secondary}]`}>Change cover image</Text>
                </TouchableOpacity>
            </View>


            <View style={''}>
                <Text style={tw`text-white font-montserrat ml-6`}>Title (150 characters)</Text>
                <View style={tw`mx-6 mt-1 mb-6 flex-row justify-center`}>
                    <TextInput
                        style={styles.inputText}
                        maxLength={150}
                        multilinev
                        onChangeText={(text) => setDescription(text)}

                        placeholder=""
                    />
                </View>
            </View>

            {/* <View style={''}>
                    <Text style={tw`text-white font-montserrat ml-6`}>News Title</Text>
                    <View style={tw`mx-6 mt-1 mb-6 flex-row justify-center`}>
                        <TextInput
                            style={styles.inputText}
                            maxLength={150}
                            multiline
                            onChangeText={(text) => setnewstitle(text)}

                            placeholder="Describe your video"
                        />
                    </View>
                </View> */}


            <View style={''}>
                <Text style={tw`text-white font-montserrat ml-6`}>News link</Text>
                <View style={tw`mx-6 mt-1 mb-6 flex-row justify-center`}>
                    <TextInput
                        style={styles.inputText}
                        maxLength={150}
                        multiline
                        onChangeText={(text) => {
                            setnewslink(text);
                            handleCheckUrl(text);
                        }}
                        placeholder="https://www.example.com"
                        placeholderTextColor={'grey'}
                    />
                    {isValid ? <EvilIcons name="check" size={35} color="green" /> : <EvilIcons name="check" size={35} color="red" />}
                </View>
            </View>
            <View style={''}>
                <Text style={tw`text-white font-montserrat ml-6`}>News Description</Text>
                <View style={tw`mx-6 mt-1 flex-row justify-center`}>
                    <TextInput
                        style={styles.inputText}
                        maxLength={150}
                        multiline
                        onChangeText={(text) => setnewsdescription(text)}

                        placeholder=""
                    />
                </View>
            </View>


            <View style={tw.style(`h-32 border border-[${COLORS.secondary}] m-6 mr-11`, { borderRadius: 4 })} >
                <TouchableOpacity onPress={() => setOpen(true)}>

                    <Text style={tw`text-[${COLORS.secondary}] text-xl text-center`}>{hashtags.length == 0 ? 'Add' : 'Edit'}  Tags</Text>
                </TouchableOpacity>
                <ScrollView>
                    <View style={tw`p-4 flex flex-wrap flex-row gap-3 justify-center`}>
                        {
                            hashtags.map((k) => (
                                <GradientText onPress={() => handleSelect(k)} selected={hashtags.includes(k)}>
                                    {k}
                                </GradientText>
                            ))
                        }
                    </View>
                </ScrollView>
            </View>


            <View style={styles.spacer} />
            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.cancelButton}>
                    <Text style={styles.cancelButtonText}>CANCEL</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => handleSavePost()}
                    style={styles.postButton}>
                    <Text style={styles.postButtonText}>POST</Text>
                    <Feather name="chevron-right" size={24} color={COLORS.secondary} />
                </TouchableOpacity>
            </View>
            <ScrollView style={tw`absolute top-0 left-0 right-0 bottom-0 bg-[${COLORS.primary}] ${open ? '' : 'hidden'}`}>
                <View style={tw`flex-1 bg-[${COLORS.primary}] py-4`}>
                    <View style={tw`flex items-center`}>
                        <Image source={require('../../assets/fulllogo.png')} style={{ width: 80, height: 80, resizeMode: 'contain', marginBottom: 2 }} />
                    </View>
                    <View style={tw`flex gap-2 items-center`}>
                        <Text style={tw`text-white text-lg text-center font-montserrat`}>
                            Choose some of your favorite topics
                        </Text>
                        <Text style={tw`text-white text-2xl text-center`}>
                            ({hashtags.length}/5)
                        </Text>
                    </View>


                    <View style={tw`p-4 flex flex-wrap flex-row gap-3 justify-center`}>
                        {
                            allKeyword.map((k) => (
                                <GradientText onPress={() => handleSelect(k)} selected={hashtags.includes(k)}>
                                    {k}
                                </GradientText>
                            ))
                        }
                    </View>

                    <View style={tw`p-4 px-4 items-center`}>
                        <Button onPress={() => setOpen(false)}>Save</Button>
                    </View>
                </View>
            </ScrollView>
        </ScrollView>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30,
        backgroundColor: COLORS.primary
    },
    uploadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary
    },
    spacer: {
        flex: 1
    },
    formContainer: {
        margin: 20,
        flexDirection: 'row',
        gap: 30,
        alignItems: 'center'
    },
    buttonsContainer: {
        flexDirection: 'row',
        margin: 20,
    },
    inputText: {
        paddingVertical: 10,
        marginRight: 20,
        flex: 1,
        borderWidth: 1,
        borderColor: COLORS.secondary,
        color: 'white',
        borderRadius: 4,
        paddingHorizontal: 10,

    },
    mediaPreview: {
        aspectRatio: 9 / 16,
        backgroundColor: 'black',
        width: 60
    },
    cancelButton: {
        alignItems: 'center',
        flex: 1,
        borderColor: COLORS.secondary,
        borderWidth: 1,
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 20,
        justifyContent: 'center',
        borderRadius: 4,
        marginRight: 10
    },
    postButton: {
        alignItems: 'center',
        flex: 1,
        borderColor: COLORS.secondary,
        borderWidth: 1,
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 20,
        justifyContent: 'space-around',
        borderRadius: 4,
        marginRight: 10
    },
    cancelButtonText: {
        marginLeft: 5,
        color: COLORS.secondary,

        fontSize: 16,
        fontFamily: 'Montserrat'
    },
    postButtonText: {
        marginLeft: 5,
        color: COLORS.secondary,
        fontSize: 16,
        fontFamily: 'Montserrat'
    }
});