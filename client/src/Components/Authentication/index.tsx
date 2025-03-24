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
import DateTimePicker from "@react-native-community/datetimepicker";
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useAppDispatch, useAppSelector } from '../../Redux/Store/hooks';
import { loginUser, registerUser } from '../../Redux/Actions/AuthActions/AuthAction';
import { ActivityIndicator } from 'react-native';

interface AuthScreenProps {
    isSignUp: boolean;
    setIsSignUp: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthScreen: React.FC<PropsWithChildren<AuthScreenProps>> = ({ isSignUp, setIsSignUp }) => {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
    const isAuth = useAppSelector((state: { auth: any }) => state.auth.isAuth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [phone, setPhone] = useState('');
    const [nic, setNic] = useState('');
    const [address, setAddress] = useState('');
    const [dob, setDob] = useState<Date | null>(null); // ✅ Store as Date
    const [showDatePicker, setShowDatePicker] = useState(false);

    const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
    const validatePhone = (phone: string) => /^[0-9]{11}$/.test(phone);
    const validatePassword = (password: string) => password.length >= 6;
    const validateUsername = (username: string) => username.length >= 3;
    const validateFirstname = (firstname: string) =>/^[A-Za-z]+$/.test(firstname) && firstname.length > 3;
     const validateLastname = (lastname: string) =>/^[A-Za-z]+$/.test(lastname) && lastname.length > 3;
    const validateNic = (nic: string) => /^[0-9]{13}$/.test(nic);
    const validateAddress = (address: string) => address.length >= 3;
    const validateDob = (dob: string) => dob.length >= 3;

    const handleAuth = async () => {
        if (loading) return;
        setLoading(true);
        if (isSignUp) {
            // Full validation for sign-up
            
            if (!username || !phone || !email || !password || !confirmPassword || !nic || !address || !dob) {
                Alert.alert('Error', 'Please fill in all fields.');
                setLoading(false);
                return;
            }
            if (!validateUsername(username)) {
                Alert.alert('Invalid Username', 'Username must be at least 3 characters long.');
                setLoading(false);
                return;
            }
            if (!validateFirstname(firstname)) {
                Alert.alert('Invalid First name', 'First Name nust be reater the 3 words. First Name should not contain any special character, number or space');
                setLoading(false);
                return;
            }
            if (!validateLastname(lastname)) {
                Alert.alert('Invalid Last name', 'Last Name nust be reater the 3 words.. Last Name should not contain any special character, number or space');
                setLoading(false);
                return;
            }
            if (!validatePhone(phone)) {
                Alert.alert('Invalid Phone', 'Phone number must be 11 digits.');
                setLoading(false);
                return;
            }
            if (!validateEmail(email)) {
                Alert.alert('Invalid Email', 'Please enter a valid email address.');
                setLoading(false);
                return;
            }
            if (!validateNic(nic)) {
                Alert.alert('Invalid NIC', 'NIC must be 13 digits.');
                setLoading(false);
                return;
            }
            if (!validateAddress(address)) {
                Alert.alert('Please Enter Address', 'Please Enter Address');
                setLoading(false);
                return;
            }
            
            if (!validatePassword(password)) {
                Alert.alert('Weak Password', 'Password must be at least 6 characters long.');
                setLoading(false);
                return;
            }
            if (password !== confirmPassword) {
                Alert.alert('Passwords do not match', 'Please enter the same password.');
                setLoading(false);
                return;
            }

            await dispatch(registerUser({ email, password, username, firstname, lastname, phone, nic, address, dob }));
        } else {
            // Simple check for sign-in (no validation, just empty field check)
            if (!email || !password) {
                Alert.alert('Error', 'Please fill in all fields.');
                setLoading(false);
                return;
            }

            await dispatch(loginUser({ email, password }));
        }
        setLoading(false);
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
                                placeholder="First Name"
                                value={firstname}
                                onChangeText={setFirstname}
                                placeholderTextColor="#666"
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Last name"
                                value={lastname}
                                onChangeText={setLastname}
                                placeholderTextColor="#666"
                            />
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
                             <TextInput
                        style={styles.input}
                        placeholder="NIC"
                        value={nic}
                        onChangeText={setNic}
                        keyboardType="phone-pad"
                        placeholderTextColor="#666"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Address"
                        value={address}
                        onChangeText={setAddress}
                        keyboardType="email-address"
                        placeholderTextColor="#666"
                    />
                    {/* Touchable Input Field */}
                      {/* Touchable Input Field */}
      <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
        <Text style={[styles.inputText, { color: dob ? "#000" : "#888" }]}>
          {dob ? dob.toLocaleDateString() : "Select Date of Birth"} {/* Placeholder Text */}
        </Text>
      </TouchableOpacity>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={dob || new Date(2000, 0, 1)} // Default to Jan 1, 2000 if no date is selected
          mode="date"
          display="spinner"
          maximumDate={new Date()} // Prevent selecting future dates
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDob(selectedDate);
          }}
        />
      )}
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
                    {/* previous working below one */}
                    {/* <TouchableOpacity style={styles.signInButton} onPress={handleAuth}>
                        <Text style={styles.buttonText}>{isSignUp ? 'Create Account' : 'Login'}</Text>
                    </TouchableOpacity> */}
                    {/* normal login maybe with text no spinner */}
                    {/* <TouchableOpacity style={styles.signInButton} onPress={handleAuth} disabled={loading}>
                        <Text style={styles.buttonText}>{loading ? 'Loading...' : isSignUp ? 'Create Account' : 'Login'}</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity style={styles.signInButton} onPress={handleAuth} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>{isSignUp ? 'Create Account' : 'Login'}</Text>
                        )}
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
    inputText: {
        fontSize: 16,
        textAlign: "center",
        width: "100%",
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
