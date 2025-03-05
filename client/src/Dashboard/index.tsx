import React from 'react';
import {
    useColorScheme,
    View,
    Text,
    StyleSheet,
    SafeAreaView,
} from 'react-native';

import { useAppDispatch, useAppSelector } from '../Redux/Store/hooks';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Individual screens
function ScreenOne() {
    return <View><Text style={styles.screenText}>ONE</Text></View>
}

function ScreenTwo() {
    return <View><Text style={styles.screenText}>TWO</Text></View>
}

function ScreenThree() {
    return <View><Text style={styles.screenText}>THREE</Text></View>
}

const Stack = createNativeStackNavigator();

export default function Dashboard() {


    return (
        <>

            <Stack.Navigator initialRouteName="TWO">
                <Stack.Screen name="ONE">
                    {() => <ScreenOne />}
                </Stack.Screen>

                <Stack.Screen name="TWO">
                    {() => <ScreenTwo />}
                </Stack.Screen>
                <Stack.Screen name="THREE">
                    {() => <ScreenThree />}
                </Stack.Screen>
            </Stack.Navigator>
        </>

    );
}

const styles = StyleSheet.create({
    screenText: {
        fontSize: 24,
        textAlign: 'center',
        margin: 20,
    },
});
