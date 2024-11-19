import React from 'react';
import {
    useColorScheme,
    StyleSheet,
} from 'react-native';


import { createNativeStackNavigator } from '@react-navigation/native-stack';



import ItemScreen from './Items';
import AddItemScreen from './AddItem';


const Stack = createNativeStackNavigator();

export default function RentingModule() {




    return (
        <>

            <Stack.Navigator initialRouteName="ITEMS">
                <Stack.Screen name="ITEMS">
                    {(props) => <ItemScreen {...props} />}
                </Stack.Screen>
                <Stack.Screen name="ADDITEM">
                    {(props) => <AddItemScreen {...props} />}
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
