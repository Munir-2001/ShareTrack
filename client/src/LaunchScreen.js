// src/LaunchScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LaunchScreen = ({  setIsSignUp }) => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <Text style={styles.logo}>
                SHARE<Text style={styles.track}>TRACK</Text>
            </Text>
            <Text style={styles.welcomeText}>Welcome</Text>

            <TouchableOpacity
                style={styles.signInButton}
                onPress={() => {
                    setIsSignUp(false); // Set to sign in mode
                    navigation.navigate('Auth');
                }}>
                <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.signUpButton}
                onPress={() => {
                    setIsSignUp(true); // Set to sign up mode
                    navigation.navigate('Auth');
                }}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
    },
    logo: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#1E2A78', 
    },
    track: {
      color: '#E63946', 
    },
    welcomeText: {
      fontSize: 28,
      fontFamily: 'Cursive', 
      marginVertical: 20,
    },
    signInButton: {
      backgroundColor: '#E63946', 
      paddingVertical: 15,
      paddingHorizontal: 60,
      borderRadius: 30,
      marginBottom: 15,
    },
    signUpButton: {
      backgroundColor: '#1E2A78', 
      paddingVertical: 15,
      paddingHorizontal: 60,
      borderRadius: 30,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
  export default LaunchScreen;