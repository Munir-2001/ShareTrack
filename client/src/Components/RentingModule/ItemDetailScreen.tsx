import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Alert,
    Switch
} from 'react-native';
import { useAppSelector } from '../../Redux/Store/hooks';
import { API_URL } from '../../constants';

export default function ItemDetailScreen({ route, navigation }: any) {
    const { item } = route.params; // ✅ Get item data from navigation
    const [isAvailable, setIsAvailable] = useState(item.is_available);
    const user = useAppSelector(state => state.auth.user);

    // const toggleAvailability = async () => {
    //     try {
    //       const response = await fetch(`${API_URL}/api/item/updateStatus`, {
    //         method: 'PUT',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ itemId: item.id, isAvailable: !isAvailable }),
    //       });
      
    //       if (!response.ok) {
    //         throw new Error('Failed to update item status');
    //       }
      
    //       const data = await response.json();
    //       setIsAvailable(!isAvailable); // ✅ Toggle state
      
    //       Alert.alert('Success', `Item is now ${!isAvailable ? 'Inactive' : 'Active'}`);
      
    //       // ✅ Refresh item list after updating status
    //       navigation.navigate('ITEMS');
    //     } catch (error) {
    //       console.error('Error updating item:', error);
    //       Alert.alert('Error', 'Could not update item status');
    //     }
    //   };
    const toggleAvailability = async () => {
        try {
            const newStatus = !isAvailable; // ✅ Determine new status before API call
    
            const response = await fetch(`${API_URL}/api/item/updateStatus`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemId: item.id, is_available: newStatus }), // ✅ Use correct key
            });
    
            if (!response.ok) {
                throw new Error('Failed to update item status');
            }
    
            const data = await response.json();
            setIsAvailable(newStatus); // ✅ Update UI state only after a successful API response
    
            Alert.alert('Success', `Item is now ${newStatus ? 'Active' : 'Inactive'}`);
            navigation.navigate('ITEMS', { refresh: true });

        } catch (error) {
            console.error('Error updating item:', error);
            Alert.alert('Error', 'Could not update item status');
        }
    };
    

    return (
        <View style={styles.container}>
            <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.itemImage} />
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>💰 Price: {item.price} PKR</Text>
            <Text style={styles.itemCategory}>📌 Category: {item.category}</Text>
            <Text style={styles.itemLocation}>📍 Location: {item.city}, {item.state}, {item.country}</Text>

            {/* ✅ Toggle Switch for Active/Inactive */}
            <View style={styles.switchContainer}>
                <Text style={styles.statusText}>Status: {isAvailable ? 'Active' : 'Inactive'}</Text>
                {user.id === item.owner_id && ( // ✅ Only show switch if user owns the item
                    <Switch
                    value={isAvailable}
                    onValueChange={toggleAvailability} // ✅ Call function correctly
                    trackColor={{ false: '#888', true: '#1E2A78' }}
                    thumbColor={isAvailable ? '#fff' : '#f4f3f4'}
                />
                )}
            </View>


            {/* ✅ Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>🔙 Back</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff', alignItems: 'center' },
    itemImage: { width: 200, height: 200, borderRadius: 8, marginBottom: 10 },
    itemName: { fontSize: 22, fontWeight: 'bold', marginBottom: 5, color: '#1E2A78' },
    itemPrice: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 5 },
    itemCategory: { fontSize: 16, color: '#333', marginBottom: 3 },
    itemLocation: { fontSize: 16, color: '#333', marginBottom: 10 },
    switchContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
    statusText: { fontSize: 18, fontWeight: 'bold', marginRight: 10, color: '#1E2A78' },
    backButton: { backgroundColor: '#1E2A78', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
    backButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    toggleButtonsContainer: {
        flexDirection: 'row', // ✅ Align buttons horizontally
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        gap: 10, // ✅ Add spacing between buttons (or use margin)
    },
    
});
