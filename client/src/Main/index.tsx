import React, { useEffect } from 'react';
import type { PropsWithChildren } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
    useColorScheme,
} from 'react-native';

import {
    Colors,
} from 'react-native/Libraries/NewAppScreen';

import { useDispatch, useSelector } from 'react-redux';
import AuthScreen from '../Components/Authentication';
import Dashboard from '../Dashboard';





function Main(){
    const isDarkMode = useColorScheme() === 'dark';
    const isAuth = useSelector((state: { auth: any }) => state.auth.isAuth);

    return (
        <View>
            {isAuth ? (
                <Dashboard /> // Render the Dashboard if user is logged in
            ) : (
                <AuthScreen /> // Render the AuthScreen if user is not logged in
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Main;
