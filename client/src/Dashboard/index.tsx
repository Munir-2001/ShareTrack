import React, { useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import {
    useColorScheme,
    View,
    Text,
    Button,
    StyleSheet,
} from 'react-native';

import {
    Colors,
} from 'react-native/Libraries/NewAppScreen';

import { useDispatch, useSelector } from 'react-redux';

function Dashboard({ navigation }: PropsWithChildren<any>) {
    const isDarkMode = useColorScheme() === 'dark';
    const dispatch = useDispatch();
    const user = useSelector((state: { auth: any }) => state.auth.user);
    const isAuth = useSelector((state: { auth: any }) => state.auth.isAuth);

    const [userState, setUserState] = useState(user);

    useEffect(() => {
        setUserState(user);
        if (isAuth) {
            navigation.navigate('Dashboard');
        }
    }, [user]);

    const handleLogout = () => {
        // Dispatch logout action
        dispatch({ type: 'LOGOUT' });
        navigation.navigate('Launch');
    };

    return (
        <View
            style={{

                backgroundColor: isDarkMode ? Colors.black : Colors.white,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 16,
            }}>
            <Text> Dashboard </Text>

            {user ? (
                <>
                    <Text style={styles.userInfo}>Welcome, {user.username || user.email}!</Text>
                    <Text style={styles.userInfo}>Email: {user.email}</Text>
                    <Text style={styles.userInfo}>Phone: {user.phone}</Text>
                    <Button title="Logout" onPress={handleLogout} />
                </>
            ) : (
                <Text style={styles.userInfo}>No user is logged in.</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    userInfo: {
        fontSize: 18,
        marginBottom: 10,
    },
});

export default Dashboard;
