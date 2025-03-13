import React, { useState } from 'react';
import { PropsWithChildren } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
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

const AuthScreen: React.FC<PropsWithChildren<AuthScreenProps>> = ({ isSignUp, setIsSignUp }) => {
    const dispatch = useAppDispatch();
    const isAuth = useAppSelector((state: { auth: any }) => state.auth.isAuth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');

    const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
    const validatePhone = (phone: string) => /^[0-9]{10,15}$/.test(phone);
    const validatePassword = (password: string) => password.length >= 6;
    const validateUsername = (username: string) => username.length >= 3;

    const handleAuth = () => {
        if (isSignUp) {
            // Full validation for sign-up
            if (!username || !phone || !email || !password || !confirmPassword) {
                Alert.alert('Error', 'Please fill in all fields.');
                return;
            }
            if (!validateUsername(username)) {
                Alert.alert('Invalid Username', 'Username must be at least 3 characters long.');
                return;
            }
            if (!validatePhone(phone)) {
                Alert.alert('Invalid Phone', 'Phone number must be 10-15 digits.');
                return;
            }
            if (!validateEmail(email)) {
                Alert.alert('Invalid Email', 'Please enter a valid email address.');
                return;
            }
            if (!validatePassword(password)) {
                Alert.alert('Weak Password', 'Password must be at least 6 characters long.');
                return;
            }
            if (password !== confirmPassword) {
                Alert.alert('Passwords do not match', 'Please enter the same password.');
                return;
            }

            dispatch(registerUser({ email, password, username, phone }));
        } else {
            // Simple check for sign-in (no validation, just empty field check)
            if (!email || !password) {
                Alert.alert('Error', 'Please fill in all fields.');
                return;
            }

            dispatch(loginUser({ email, password }));
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: Colors.white }}>
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
                                placeholderTextColor="#666"
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Phone Number"
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                                placeholderTextColor="#666"
                            />
                        </>
                    )}
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        placeholderTextColor="#666"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        placeholderTextColor="#666"
                    />
                    {isSignUp && (
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            placeholderTextColor="#666"
                        />
                    )}
                    <TouchableOpacity style={styles.signInButton} onPress={handleAuth}>
                        <Text style={styles.buttonText}>{isSignUp ? 'Create Account' : 'Login'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setIsSignUp((prev) => !prev)}>
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
    logo: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1E2A78',
        marginVertical: 20,
        marginTop: 75,
    },
    track: {
        color: '#E63946',
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
        borderColor: '#000000',
        borderWidth: 1,
        borderRadius: 5,
        marginVertical: 10,
        backgroundColor: '#F5F5F5',
        textAlign: 'center',
        color: '#000',
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
