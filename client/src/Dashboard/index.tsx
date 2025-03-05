import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

function ScreenTwo({ navigation }: { navigation: any }) {
    return (
        <View style={styles.container}>
            <Text style={styles.screenText}>Hello World</Text>

            <TouchableOpacity 
                style={styles.button} 
                onPress={() => navigation.navigate("NewScreen")} // Navigate to the new screen
            >
                <Text style={styles.buttonText}>Go to New Screen</Text>
            </TouchableOpacity>
        </View>
    );
}

export default ScreenTwo;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    screenText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: '#1E2A78',
        borderRadius: 8,
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
});

