import React, { useState, useEffect } from 'react';
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

import { useAppDispatch, useAppSelector } from '../Redux/Store/hooks';


import AuthScreen from '../Components/Authentication';
import LaunchScreen from '../LaunchScreen';

import Dashboard from '../Dashboard';
import RentingModule from '../Components/RentingModule';
import ProfileScreen from '../Components/Profile';


import { NavigationContainer, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Header from '../Components/Header';
import Icon from '@react-native-vector-icons/ionicons';
import BillModule from '../Components/BillModule/BillModule';





const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();





export default function Main() {

  const isDarkMode = useColorScheme() === 'dark';
  const isAuth = useAppSelector((state: { auth: any }) => state.auth.isAuth);
  const [isSignUp, setIsSignUp] = useState(false);
  const [authState, setAuthState] = useState(isAuth || false);

  useEffect(() => {
    setAuthState(isAuth);
  }, [isAuth]);



  return (

    <>
      <NavigationContainer>
        {
          isAuth ? (

            <Tab.Navigator
              screenOptions={({ route }) => ({
                header: () => (route.name === 'Profile' ? null : <Header />),
                headerShown: true,
                tabBarActiveTintColor: '#1E2A78',
                tabBarInactiveTintColor: '#8e8e93',
                tabBarIcon: ({ color, size }) => {
                  let iconName;

                  if (route.name === 'Dashboard') {
                    iconName = 'home-outline';
                  } else if (route.name === 'Profile') {
                    iconName = 'person-outline';
                  } else if (route.name === 'Rent') {
                    iconName = 'receipt-outline';
                  }
                 else if (route.name === 'Bills') {
                  iconName = 'receipt-outline';
                }
                  
                  return <Icon name={iconName} size={size || 24} color={color} />;
                },
                tabBarStyle: {
                  backgroundColor: '#fff',
                  height: 60,
                },
                tabBarLabelStyle: {
                  fontSize: 12,
                },
              })}
            >
              <Tab.Screen name="Dashboard">
                {(props) => <Dashboard {...props} />}
              </Tab.Screen>
              <Tab.Screen name="Profile">{() => <ProfileScreen />}</Tab.Screen>
              <Tab.Screen name="Rent">{() => <RentingModule />}</Tab.Screen>
              <Tab.Screen name="Bills">{() => <BillModule />}</Tab.Screen>
            </Tab.Navigator>


          ) : (
            <Stack.Navigator initialRouteName="Launch" screenOptions={{ headerShown: false, }}>
              <Stack.Screen name="Launch" >
                {() => <LaunchScreen setIsSignUp={setIsSignUp} />}
              </Stack.Screen>
              <Stack.Screen name="Auth" >
                {() => <AuthScreen isSignUp={isSignUp} setIsSignUp={setIsSignUp} />}
              </Stack.Screen>


            </Stack.Navigator>

          )
        }
      </NavigationContainer>
    </>);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


