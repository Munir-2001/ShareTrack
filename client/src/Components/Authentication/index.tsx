import React from 'react';
import type { PropsWithChildren } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    TextInput,
    Button,
} from 'react-native';

import {
    Colors,
} from 'react-native/Libraries/NewAppScreen';

// import { useDispatch, useSelector } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../Redux/Store/hooks';
import { loginUser, registerUser } from '../../Redux/Actions/AuthActions/AuthAction';
import { API_URL } from '../../constants';

function AuthScreen() {
    const isDarkMode = useColorScheme() === 'dark';
    const dispatch = useAppDispatch();
    const user = useAppSelector((state: { auth: any }) => state.auth.user);

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [isSignUp, setIsSignUp] = React.useState(false);

    const handleAuth = () => {
        if (isSignUp) {
            // Dispatch signup action
            dispatch(registerUser({ email, password, username, phone }))
        } else {
            // Dispatch login action
            dispatch(loginUser({ email, password }))
        }
    };

    return (
        <View style={{ backgroundColor: isDarkMode ? Colors.black : Colors.white }}>
            <Text> AUTH </Text>
            <ScrollView contentInsetAdjustmentBehavior="automatic">
                <View style={styles.container}>
                    <Text style={styles.header}>{isSignUp ? 'Sign Up' : 'Login'}</Text>
                    {isSignUp && (
                        <>
                            <TextInput
                                style={styles.input}
                                placeholder="Username"
                                value={username}
                                onChangeText={setUsername}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Phone Number"
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                            />
                        </>
                    )}
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <Button title={isSignUp ? 'Create Account' : 'Login'} onPress={handleAuth} />
                    <Button
                        title={`Switch to ${isSignUp ? 'Login' : 'Sign Up'}`}
                        onPress={() => setIsSignUp(prev => !prev)}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
});

export default AuthScreen;
