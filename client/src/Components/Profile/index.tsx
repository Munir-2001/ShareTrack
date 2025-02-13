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
    import UserProfile from './UserProfile';
    import PendingRequestsScreen from './PendingRequestsScreen';
    import TransactionHistoryScreen from './TransactionHistoryScreen';
    import AccountSettingsScreen from './AccountSettingsScreen';
    import UpcomingRepaymentsScreen from './UpcomingRepaymentsScreen'
import RentalOffersHistory from './RentalOfferHistory';

    const Stack = createNativeStackNavigator();

    export default function Dashboard() {


        return (
            <>

                <Stack.Navigator initialRouteName="PROFILE" screenOptions={{
                    headerShown: false,
                }}>
                    <Stack.Screen name="PROFILE">
                        {(props) => <ProfileScreen {...props} />}
                    </Stack.Screen>

                    <Stack.Screen name="CONNECTIONS">
                        {(props) => <ConnectionScreen {...props} />}
                    </Stack.Screen>
                    <Stack.Screen name="UserProfile" component={UserProfile} />
                    <Stack.Screen name="PendingRequestsScreen">
                        {(props) => <PendingRequestsScreen {...props} />}
                    </Stack.Screen>
                    <Stack.Screen name="TransactionHistoryScreen">
                        {(props) => <TransactionHistoryScreen {...props} />}
                    </Stack.Screen>
                    
                    <Stack.Screen name="AccountSettingsScreen">
                        {(props) => <AccountSettingsScreen {...props} />}
                    </Stack.Screen>
                    
                    <Stack.Screen name="UpcomingRepaymentsScreen" >
                    {(props) => <UpcomingRepaymentsScreen {...props} />}


                    </Stack.Screen>
                  
                    <Stack.Screen name="RentalOfferHistory">
                        {(props) => <RentalOffersHistory {...props} />}
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

