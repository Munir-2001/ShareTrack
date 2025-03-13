import React, { useEffect, useState } from 'react';
import {
    useColorScheme,
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../Redux/Store/hooks';
import type { PropsWithChildren } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import ConnectionScreen from '../Components/Profile/ManageFriendship';
import DashboardSendRequestMoneyTab from '../Dashboard/DashboardSendRequestMoneyTab';
type RootStackParamList = {
    ONE: undefined;
    TWO: undefined;
    THREE: undefined;
    CONNECTIONS: { userIds: number };
  };
// Individual screens
interface Props {
    navigation: any;
}
function ScreenOne() {
    return <View><Text style={styles.screenText}>ONE</Text></View>
}

// function ScreenTwo({ navigation }: PropsWithChildren<any>) {

//     const route = useRoute();
//     const [paramNumber, setParamNumber] = useState<number>(0);
//     console.log("this is route name", route)
//     const gotoConnections = (ids: number) => {
//         setParamNumber(ids)
//         console.log("navigation navigation ids", ids)
//         navigation.navigate('CONNECTIONS');
//     };
//     return (
//         <View>
//             <Text style={styles.screenText}>TWO</Text>
//             <TouchableOpacity style={styles.container} onPress={() => { gotoConnections(1) }}>
//                 <Text style={styles.buttonText}>Send Money</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.container} onPress={() => { gotoConnections(2) }}>
//                 <Text style={styles.buttonText}>Request Money</Text>
//             </TouchableOpacity>
//         </View>
//     );

// }

function ScreenThree() {
    return <View><Text style={styles.screenText}>THREE</Text></View>
}


type DashboardProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'TWO'>;
  };
  const Stack = createNativeStackNavigator();

export default function Dashboard({ navigation }:any) {
  
    const [paramNumber, setParamNumber] = useState<number>(3);
    const parentChildCall = (ids: number) => {
        setParamNumber(ids)
    }

    useEffect(()=>{
        console.log("useEffect 1234 ",navigation.navigate)
        if (paramNumber !== 3) {
            //  navigation.navigate('ConnectionScreen');
        }
    },[paramNumber])

    return (
        <>
            <Stack.Navigator initialRouteName="TWO">


                <Stack.Screen name="ONE">
                    {() => <ScreenOne />}
                </Stack.Screen>
                <Stack.Screen name="TWO">
                    {(props) =>
                        <DashboardSendRequestMoneyTab
                            {...props}
                            parentChildCall={parentChildCall}
                        />}
                </Stack.Screen>

                <Stack.Screen name="THREE">
                    {() => <ScreenThree />}
                </Stack.Screen>

                <Stack.Screen
                    name="CONNECTIONS"
                    component={ConnectionScreen}
                    // initialParams={{ userIds: paramNumber }}
                />
               

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

    container: {
        fontSize: 24,
        textAlign: 'center',
        backgroundColor: '#fff',
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 8,
        margin: 20,
    },
    buttonText: {
        color: '#000',
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
    },
});
