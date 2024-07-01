import React, { useLayoutEffect } from 'react'
import { useNavigation, StackActions } from '@react-navigation/native'
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import tw from '../customtwrnc';

const Splash = () => {
  const { isAuth } = useSelector(store => store.user);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    if (isAuth == true) {
      navigation.dispatch(StackActions.replace('home'));
    } else if (isAuth == false) {
      navigation.dispatch(StackActions.replace('register'));
    }
  }, [isAuth])

  return (
    <>
      <View style={styles.container}>
        <Image source={require('../../assets/splash2.png')} style={styles.logo} />
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={tw`text-sky-200 text-base font-bold z-2`}>Loading...</Text>
      </View>
    </>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000', // Change this to your preferred background color
  },
  logo: {
    width: 350,
    height: 350,
    resizeMode: 'contain',
    marginBottom: 20,
    padding: 20,
  },
});

export default Splash