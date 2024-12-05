import React from 'react';
import {
    useColorScheme,
    View,
    Text,
    StyleSheet,
} from 'react-native';




import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ConnectionScreen from './ManageFriendship';
import ProfileScreen from './ManageProfile';


const Stack = createNativeStackNavigator();

export default function Dashboard() {


    return (
        <>

            <Stack.Navigator initialRouteName="CONNECTIONS" screenOptions={{
                headerShown: false,
            }}>
                <Stack.Screen name="PROFILE">
                    {(props) => <ProfileScreen {...props} />}
                </Stack.Screen>

                <Stack.Screen name="CONNECTIONS">
                    {(props) => <ConnectionScreen {...props} />}
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

