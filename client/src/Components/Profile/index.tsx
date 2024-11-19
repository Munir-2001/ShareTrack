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


import { useAppDispatch, useAppSelector } from '../../Redux/Store/hooks';

export default function ProfileScreen({ navigation }: PropsWithChildren<any>) {
    const isDarkMode = useColorScheme() === 'dark';
    const dispatch = useAppDispatch();

    const user = useAppSelector((state: { auth: any }) => state.auth.user);
    const isAuth = useAppSelector((state: { auth: any }) => state.auth.isAuth);

    const [userState, setUserState] = useState(user);


    const handleLogout = () => {
        // Dispatch logout action
        dispatch({ type: 'LOGOUT' });
    };

    return (
        <View
            style={{

                backgroundColor: isDarkMode ? Colors.black : Colors.white,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 16,
            }}>
            <Text> PROFILE </Text>

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

