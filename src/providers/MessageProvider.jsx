import React, { useLayoutEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ClearError, ClearMessage } from '../redux/ActionType';
import { loadme } from '../redux/actions/user';
import Toast from 'react-native-toast-message';

const MessageProvider = ({ children }) => {
    const { error, message } = useSelector(store => store.user);
    const dispatch = useDispatch();

    useLayoutEffect(() => {
        if (error) {
            Toast.show({
                type: 'error',
                position: 'bottom',
                text1: 'Error',
                text2: error

            })
            dispatch({ type: ClearError })
        }

        if (message) {
            Toast.show({
                type: 'success',
                position: 'bottom',
                text1: 'Success',
                text2: message
            })
            dispatch({ type: ClearMessage })
        }

    }, [error, message]);



    useLayoutEffect(() => {
        dispatch(loadme());
    }, [])
    return (children)
}

export default MessageProvider