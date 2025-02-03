import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  StyleSheet,
} from 'react-native';
import { createItem } from '../../Redux/Actions/AuthActions/ItemAction';
import { useAppDispatch, useAppSelector } from '../../Redux/Store/hooks';
import Icon from '@react-native-vector-icons/ionicons';

interface FormData {
  item_name: string;
  description: string;
  rental_price: string;
  category: string;
  location: string;
  isAvailable: boolean;
}

export default function AddItemScreen({ navigation }: any) {
  const [formData, setFormData] = useState<FormData>({
    item_name: '',
    description: '',
    rental_price: '',
    category: '',
    location: '',
    isAvailable: true,
  });

  const user = useAppSelector(state => state.auth.user);
  const dispatch = useAppDispatch();

  // Update form values
  const handleInputChange = (field: string, value: any) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  // Handle Form Submission
  const handleSubmit = async () => {
    const { item_name, description, rental_price, category, location } = formData;

    if (!item_name || !description || !rental_price || !category || !location) {
      Alert.alert("All fields are required.");
      return;
    }

    const itemData = { item_name, category, rental_price, location, owner_id: user.id };

    try {
      await dispatch(createItem(itemData));
      Alert.alert("Success", "Item created successfully!");
      navigation.navigate('ITEMS'); // Redirect to Items screen
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ITEMS')}
            style={styles.backButtonContainer}>
            <Icon name="arrow-back" size={30} color="#1E2A78" style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.screenText}>Add Item for Rent</Text>
        </View>

        {/* Form Fields */}
        {Object.keys(formData).map((key) => (
          key !== "isAvailable" ? ( // ✅ Exclude `isAvailable` from `TextInput`
            <View key={key} style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{key.replace("_", " ")}</Text>
              <TextInput
                style={styles.input}
                value={String(formData[key as keyof FormData])} // ✅ Convert values to string
                onChangeText={(value) => handleInputChange(key, value)}
                placeholder={`Enter ${key.replace("_", " ")}`}
              />
            </View>
          ) : (
            <View key={key} style={styles.switchContainer}>
              <Text style={styles.switchText}>Available</Text>
              <Switch
                value={formData.isAvailable}
                onValueChange={(value) => handleInputChange("isAvailable", value)}
                trackColor={{ false: '#DDD', true: '#1E2A78' }}
                thumbColor={formData.isAvailable ? '#FFF' : '#F4F3F4'}
              />
            </View>
          )
        ))}

        {/* Submit Button */}
        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Create Item</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  screenText: { flex: 1, textAlign: 'center', fontSize: 26, fontWeight: 'bold', color: '#1E2A78' },
  inputContainer: { marginBottom: 15 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#444', marginBottom: 5 },
  input: { height: 50, borderWidth: 1, borderColor: '#DDD', borderRadius: 10, paddingHorizontal: 12, backgroundColor: '#f9f9f9', fontSize: 16, color: '#333', elevation: 3 },
  switchContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8, backgroundColor: '#f9f9f9', elevation: 3 },
  switchText: { fontSize: 14, fontWeight: '600' },
  button: { backgroundColor: '#1E2A78', paddingVertical: 15, borderRadius: 10, alignItems: 'center', marginTop: 10, elevation: 2 },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  backButtonContainer: { position: 'absolute', flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  icon: { marginRight: 8 },
  headerContainer: { position: 'relative', flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 10 },
});
