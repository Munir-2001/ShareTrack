import React, { useState } from "react";
import { 
    View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet, ScrollView 
} from "react-native";
import { useAppSelector, useAppDispatch } from "../../Redux/Store/hooks";
import { updateUser } from "../../Redux/Actions/AuthActions/AuthAction";
import { API_URL } from "../../constants";
import { Picker } from '@react-native-picker/picker';

const AccountSettingsScreen = ({ navigation }: { navigation: any }) => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const [age, setAge] = useState(user?.age?.toString() || "");
    const [gender, setGender] = useState(user?.gender || "");
    const [maritalStatus, setMaritalStatus] = useState(user?.marital_status || "");
    const [educationLevel, setEducationLevel] = useState(user?.education_level || "");
    const [employmentStatus, setEmploymentStatus] = useState(user?.employment_status || "");

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
                body: JSON.stringify({ phone, email, age, gender, marital_status: maritalStatus, education_level: educationLevel, employment_status: employmentStatus }),
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
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
            <View style={styles.innerContainer}>
                <Text style={styles.header}>Account Settings</Text>

                {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

                <Text style={styles.label}>Username</Text>
                <TextInput style={styles.input} value={username} editable={false} />

                <Text style={styles.label}>Phone</Text>
                <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

                <Text style={styles.label}>Email</Text>
                <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

                <Text style={styles.label}>Age</Text>
                <TextInput style={styles.input} value={age} onChangeText={setAge} keyboardType="numeric" />

                <Text style={styles.label}>Gender</Text>
                <Picker selectedValue={gender} onValueChange={setGender} style={styles.picker}>
                    <Picker.Item label="Select Gender" value="" />
                    <Picker.Item label="Male" value="Male" />
                    <Picker.Item label="Female" value="Female" />
                    <Picker.Item label="Other" value="Other" />
                </Picker>

                <Text style={styles.label}>Marital Status</Text>
                <Picker selectedValue={maritalStatus} onValueChange={setMaritalStatus} style={styles.picker}>
                    <Picker.Item label="Select Marital Status" value="" />
                    <Picker.Item label="Single" value="0" />
                    <Picker.Item label="Married" value="1" />
                </Picker>

                <Text style={styles.label}>Education Level</Text>
                <Picker selectedValue={educationLevel} onValueChange={setEducationLevel} style={styles.picker}>
                    <Picker.Item label="Select Education Level" value="" />
                    <Picker.Item label="High School" value="High School" />
                    <Picker.Item label="Bachelor" value="Bachelor" />
                    <Picker.Item label="Master" value="Master" />
                    <Picker.Item label="PhD" value="PhD" />
                    <Picker.Item label="Other" value="Other" />
                </Picker>

                <Text style={styles.label}>Employment Status</Text>
                <Picker selectedValue={employmentStatus} onValueChange={setEmploymentStatus} style={styles.picker}>
                    <Picker.Item label="Select Employment Status" value="" />
                    <Picker.Item label="Employed" value="Employed" />
                    <Picker.Item label="Unemployed" value="Unemployed" />
                    <Picker.Item label="Self-Employed" value="Self-Employed" />
                    <Picker.Item label="Student" value="Student" />
                    <Picker.Item label="Retired" value="Retired" />
                </Picker>

                <TouchableOpacity style={styles.button} onPress={handleUpdate} disabled={loading}>
                    {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Update</Text>}
                </TouchableOpacity>

                <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('PROFILE')}>
                    <Text style={styles.backButtonText}>Back to Profile</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default AccountSettingsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    innerContainer: {
        padding: 20,
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
    picker: {
        height: 50,
        backgroundColor: "#F5F5F5",
        marginBottom: 15,
    },
});
