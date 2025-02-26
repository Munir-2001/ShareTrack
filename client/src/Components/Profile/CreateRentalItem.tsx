import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { API_URL } from "../../constants.js";
import { useAppSelector } from "../../Redux/Store/hooks"; // Import user selector
import { Picker } from '@react-native-picker/picker';

const CreateRentalItem = ({ navigation }: any) => {
  const user = useAppSelector((state: { auth: any }) => state.auth.user); // Get logged-in user
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [rentalPrice, setRentalPrice] = useState("");
  const [location, setLocation] = useState("");

  const handleCreateRentalItem = async () => {
    
    if (!itemName || !category || !rentalPrice || !location) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/rental/createRentalItem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          owner_id: user.id, // Assign owner_id from logged-in user
          item_name: itemName,
          category,
          rental_price: parseFloat(rentalPrice),
          location,
          status: "available", // Default status
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Rental item created successfully!");
        navigation.goBack(); // Navigate back after success
      } else {
        Alert.alert("Error", data.message || "Failed to create rental item.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create Rental Item</Text>

      <TextInput
        style={styles.input}
        placeholder="Item Name"
        value={itemName}
        onChangeText={setItemName}
      />
      <TextInput
        style={styles.input}
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
      />
      <TextInput
        style={styles.input}
        placeholder="Rental Price (per day)"
        value={rentalPrice}
        onChangeText={setRentalPrice}
        keyboardType="numeric"
      />
                <Picker selectedValue={location} onValueChange={setLocation} style={styles.picker}>
                    <Picker.Item label="Location" value="" />
                    <Picker.Item label="Karachi" value="Karachi" />
                    <Picker.Item label="Lahore" value="Lahore" />
                    <Picker.Item label="Islamabad" value="Islamabad" />
                    <Picker.Item label="Quetta" value="Quetta" />
                    <Picker.Item label="Peshawar" value="Peshawar" />
                    <Picker.Item label="Rawalpindi" value="Rawalpindi " />
                </Picker>

      <Button title="Create Item" onPress={handleCreateRentalItem} />
    </View>
  );
};

export default CreateRentalItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#1E2A78",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#f9f9f9",
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
},
picker: {
  height: 50,
  backgroundColor: "#F5F5F5",
  marginBottom: 15,
},
});
