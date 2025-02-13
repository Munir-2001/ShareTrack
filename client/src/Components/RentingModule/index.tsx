import React from 'react';
import {
    useColorScheme,
    StyleSheet,
} from 'react-native';


import { createNativeStackNavigator } from '@react-navigation/native-stack';



import ItemScreen from './Items';
import AddItemScreen from './AddItem';
import ItemDetailScreen from './ItemDetailScreen';
import RentalItemScreen from './RentalItemScreen';
import RentalOffersScreen from './RentalOfferScreens';
import CreateRentalItem from '../Profile/CreateRentalItem';
const Stack = createNativeStackNavigator();

export default function RentingModule() {


    return (
        <>
            <Stack.Navigator initialRouteName="ITEMS"
                screenOptions={{ headerShown: false }}>
                <Stack.Screen name="ITEMS">
                    {(props) => <ItemScreen {...props} />}
                </Stack.Screen>
                <Stack.Screen name="ADDITEM">
                    {(props) => <AddItemScreen {...props} />}
                </Stack.Screen>
                <Stack.Screen name="ITEMDETAIL">
                    {(props) => <ItemDetailScreen {...props} />}
                </Stack.Screen>
                <Stack.Screen name="RENTALITEMDETAILS">
                    {(props) => <RentalItemScreen {...props} />}
                </Stack.Screen>
                <Stack.Screen name="RENTALOFFERS">
                    {(props) => <RentalOffersScreen {...props} />}
                </Stack.Screen>

                <Stack.Screen name="CREATERENTALITEM" component={CreateRentalItem} />

                

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
