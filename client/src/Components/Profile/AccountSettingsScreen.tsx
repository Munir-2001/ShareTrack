import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from "react-native";
import { useAppSelector, useAppDispatch } from "../../Redux/Store/hooks";
import { updateUser } from "../../Redux/Actions/AuthActions/AuthAction";
import { API_URL } from "../../constants";

const AccountSettingsScreen = ({ navigation }: { navigation: any }) => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);

    const [username, setUsername] = useState(user?.username || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [email, setEmail] = useState(user?.email || "");
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleUpdate = async () => {
        setLoading(true);
        setSuccessMessage("");

        try {
            const response = await fetch(`${API_URL}/api/auth/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({ phone, email }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }

            const updatedUser = await response.json();
            dispatch(updateUser(updatedUser));

            setSuccessMessage("Profile updated successfully!");
            navigation.goBack();
        } catch (error: any) {
            Alert.alert("Error", error.message || "Something went wrong.");
        }

        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Account Settings</Text>

            {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

            <Text style={styles.label}>Username</Text>
            <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                editable={false}
            />

            <Text style={styles.label}>Phone</Text>
            <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />

            <TouchableOpacity style={styles.button} onPress={handleUpdate} disabled={loading}>
                {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Update</Text>}
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('PROFILE')}>
                <Text style={styles.backButtonText}>Back to Profile</Text>
            </TouchableOpacity>
        </View>
    );
};

export default AccountSettingsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
        justifyContent: "center",
    },
    header: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#1E2A78",
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
    },
    input: {
        width: "100%",
        padding: 10,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        backgroundColor: "#F5F5F5",
    },
    button: {
        backgroundColor: "#1E2A78",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    successText: {
        color: "green",
        textAlign: "center",
        marginBottom: 10,
    },
    backButton: {
        marginTop: 20,
        alignSelf: "center",
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: "#ddd",
        borderRadius: 8,
    },
    backButtonText: {
        fontSize: 16,
        color: "#333",
        fontWeight: "bold",
    },
});
