import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity } from "react-native";
import { API_URL } from "../../constants.js";
import { useAppSelector } from "../../Redux/Store/hooks"; // Import user selector
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'react-native-image-picker';

const CreateRentalItem = ({ navigation }: any) => {
  const user = useAppSelector((state: { auth: any }) => state.auth.user); // Get logged-in user
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [rentalPrice, setRentalPrice] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState<any>(null);

  const selectImage = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorMessage) {
        Alert.alert("Error", response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0]);
      }
    });
  };
  
  const handleCreateRentalItem = async () => {
    if (!itemName || !category || !rentalPrice || !location) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
  
    const formData = new FormData();
    formData.append("owner_id", user.id);
    formData.append("item_name", itemName);
    formData.append("category", category);
    formData.append("rental_price", rentalPrice);
    formData.append("location", location);
    formData.append("status", "available");
  
    if (image) {
      formData.append("photo", {
        uri: image.uri,
        type: image.type || "image/jpeg", // Ensure a valid MIME type
        name: image.fileName || `photo_${Date.now()}.jpg`,
      });
    }
  
    try {
      const response = await fetch(`${API_URL}/api/rental/createRentalItem`, {
        method: "POST",
        body: formData, // No need to set Content-Type
      });
  
      const data = await response.json();
  
      if (response.ok) {
        Alert.alert("Success", "Rental item created successfully!");
        navigation.goBack();
      } else {
        Alert.alert("Error", data.message || "Failed to create rental item.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
      console.error("API Error:", error);
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
                <TouchableOpacity style={styles.imagePicker} onPress={selectImage}>
        <Text style={styles.imagePickerText}>Select Image</Text>
      </TouchableOpacity>

      {image && (
        <Image source={{ uri: image.uri }} style={styles.previewImage} />
      )}
      <Button title="Create Item" onPress={handleCreateRentalItem} />
    </View>
  );
};


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
imagePicker: {
  backgroundColor: "#1E2A78",
  padding: 10,
  borderRadius: 5,
  alignItems: "center",
  marginBottom: 15,
},
imagePickerText: {
  color: "#fff",
  fontSize: 16,
},
previewImage: {
  width: "100%",
  height: 200,
  borderRadius: 10,
  marginBottom: 15,
},
});

export default CreateRentalItem;