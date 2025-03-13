import { useNavigation, useRoute } from '@react-navigation/native';
import React, { PropsWithChildren, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
    navigation: any;
    parentChildCall: (ids: number) => void;
}

export default function DashboardSendRequestMoneyTab({ navigation, parentChildCall }: Props) {
    const route = useRoute();

    console.log("this is route name", route)
    const gotoConnections = (ids: number) => {
        parentChildCall(ids);
        navigation.navigate('CONNECTIONS', {name: ids});
    };
    return (
        <View>
            <Text style={styles.screenText}>TWO</Text>
            <TouchableOpacity style={styles.container} onPress={() => { gotoConnections(1) }}>
                <Text style={styles.buttonText}>Send Money</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.container} onPress={() => { gotoConnections(2) }}>
                <Text style={styles.buttonText}>Request Money</Text>
            </TouchableOpacity>
        </View>
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
