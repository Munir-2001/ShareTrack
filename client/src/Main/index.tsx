import React, { useState, useEffect } from 'react';
import type { PropsWithChildren } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
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
import LaunchScreen from '../LaunchScreen';

const Stack = createNativeStackNavigator();





function Main() {
    const isDarkMode = useColorScheme() === 'dark';
    const isAuth = useSelector((state: { auth: any }) => state.auth.isAuth);
    const [isSignUp, setIsSignUp] = React.useState(false);
    const [authState, setAuthState] = useState(isAuth || false);

    useEffect(() => {
        setAuthState(isAuth);
    }, [isAuth]);
   
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={authState ? "Dashboard" : "Launch"}>
                <Stack.Screen
                    name="Launch"
                    options={{ headerShown: false }}>
                    {(props) => (
                        <LaunchScreen {...props} setIsSignUp={setIsSignUp} />
                    )}
                </Stack.Screen>
                <Stack.Screen
                    name="Auth"
                    options={{ title: 'Authentication' }}>
                    {(props) => (
                        <AuthScreen {...props} isSignUp={isSignUp} setIsSignUp={setIsSignUp} />
                    )}
                </Stack.Screen>

                <Stack.Screen
                    name="Dashboard"
                    options={{ title: 'Dashboard' }}>
                    {(props) => (
                        <Dashboard {...props} />
                    )}
                </Stack.Screen>

            </Stack.Navigator>
        </NavigationContainer>
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
