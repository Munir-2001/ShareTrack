import React, { useEffect, useState } from 'react';
import { PropsWithChildren } from 'react';

import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
    Image,
} from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useAppDispatch, useAppSelector } from '../../Redux/Store/hooks';
import { loginUser, registerUser } from '../../Redux/Actions/AuthActions/AuthAction';

interface AuthScreenProps {
    isSignUp: boolean;
    setIsSignUp: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthScreen: React.FC<PropsWithChildren<AuthScreenProps>> = ({isSignUp, setIsSignUp }) => {
    const isDarkMode = useColorScheme() === 'dark';

    const dispatch = useAppDispatch();
    const isAuth = useAppSelector((state: { auth: any }) => state.auth.isAuth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');


    

    const handleAuth = () => {

        if (isSignUp && password !== confirmPassword) {
            Alert.alert('Passwords do not match');
            return;
        }
        if (isSignUp && (!username || !phone || !password || !confirmPassword || !email)) {
            Alert.alert('Please fill in all fields');
            return;
        }
        if (!isSignUp && (!password || !email)) {
            Alert.alert('Please fill in all fields');
            return;
        }

        if (isSignUp) {
            // Dispatch signup action
            dispatch(registerUser({ email, password, username, phone }));
        } else {
            dispatch(loginUser({ email, password }));
        }
    };





    return (
        <View style={{ flex:1,backgroundColor: isDarkMode ? Colors.black : Colors.white }}>
            <ScrollView contentInsetAdjustmentBehavior="automatic">
                <View style={styles.container}>
                    <Text style={styles.logo}>
                        SHARE<Text style={styles.track}>TRACK</Text>
                    </Text>
                    {!isSignUp && <Image source={require('../../Assets/profile.jpg')} style={styles.profileImage} />}
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
                    {isSignUp && (
                        <>
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm Password"
                                value={confirmPassword} // Ensure you bind to confirmPassword
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                            />
                        </>
                    )}
                    <TouchableOpacity style={styles.signInButton} onPress={handleAuth}>
                        <Text style={styles.buttonText}>{isSignUp ? 'Create Account' : 'Login'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setIsSignUp(prev => !prev)}>
                        <Text style={styles.switchButtonText}>
                            Switch to {isSignUp ? 'Login' : 'Sign Up'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    logo: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1E2A78',
        marginVertical: 20,
        marginTop: 75,
    },
    track: {
        color: '#E63946',
        marginVertical: 20,
        marginTop: 75,
    },
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    input: {
        width: '80%',
        padding: 15,
        borderColor: '#999',
        borderWidth: 1,
        borderRadius: 5,
        marginVertical: 10,
        backgroundColor: '#F5F5F5',
        textAlign: 'center',
    },
    signInButton: {
        backgroundColor: '#1E2A78',
        paddingVertical: 15,
        paddingHorizontal: 60,
        borderRadius: 30,
        marginTop: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    switchButtonText: {
        color: '#1E2A78',
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginVertical: 10,
    },
});

export default AuthScreen;
