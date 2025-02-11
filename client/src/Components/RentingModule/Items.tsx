import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { Linking, Alert } from 'react-native';
import { API_URL } from '../../constants';
import {
  getAllItems,
  getUserItems,
  deleteItem,
  getItemOwnerPhone
} from '../../Redux/Actions/AuthActions/ItemAction';
import { useAppDispatch, useAppSelector } from '../../Redux/Store/hooks';

export default function ItemScreen({ navigation }: any) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const allItems = useAppSelector(state => state.item.all_items);
  const myItems = useAppSelector(state => state.item.user_items);

  const [showAll, setShowAll] = useState(true);
  const [data, setData] = useState<any[]>([]); // ✅ Ensure data is an array of objects
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
        dispatch(getAllItems()); // ✅ Refresh items list when returning to screen
        dispatch(getUserItems(user.id));
    });

    return unsubscribe;
}, [navigation]);


  const fetchOwnerPhoneNumber = async (itemName: string) => {
    try {
      console.log(`📞 Fetching phone number for item: ${itemName}`);

      const response = await fetch(`${API_URL}/api/item/getItemOwnerPhone`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemName: itemName }), // ✅ Send itemName instead of itemId
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch phone number. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ Owner Details Received:`, data);

      if (!data.owner_phone) {  // ✅ Fix here (use owner_phone instead of phone)
        Alert.alert("Phone number not available!");
        return;
      }
      // ✅ Generate WhatsApp URL
      const whatsappUrl = `https://wa.me/${data.owner_phone.replace(/\D/g, "")}`;
      console.log(`📲 Opening WhatsApp: ${whatsappUrl}`);

      // ✅ Open WhatsApp Chat
      Linking.openURL(whatsappUrl);

    } catch (error) {
      console.error("❌ Error fetching phone number:", error);
      Alert.alert("Error fetching phone number");
    }
  };


  useEffect(() => {
    if (showAll) {
      // ✅ Explicitly define the type of 'item' using TypeScript annotation
      setData(allItems.filter((item: { owner_id: string }) => item.owner_id !== user.id));
    } else {
      setData(myItems);
    }
  }, [showAll, allItems, myItems]);


  useEffect(() => {
    dispatch(getAllItems());
    dispatch(getUserItems(user.id));
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.toggleButtonsContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, showAll && styles.activeButton]}
          onPress={() => setShowAll(true)}>
          <Text style={showAll ? styles.activeButtonText : styles.toggleButtonText}>
            📦 Show All Items
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, !showAll && styles.activeButton]}
          onPress={() => setShowAll(false)}>
          <Text style={!showAll ? styles.activeButtonText : styles.toggleButtonText}>
            🏠 Show My Items
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.itemsRow}>
          {data.map((item, index) => (
            <View key={item.id} style={[styles.itemCard, index % 2 === 0 && styles.itemCardLeft]}>
              <Image source={{ uri: "https://via.placeholder.com/150" }} style={styles.itemImage} />
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>
                💰 Price: {item.price !== null && item.price !== undefined ? `${parseFloat(item.price).toFixed(0)} PKR` : "N/A"}
              </Text>
              <Text style={styles.itemCategory}>📌 Category: {item.category}</Text>
              <Text style={styles.itemLocation}>📍 Location: {item.city}, {item.state}, {item.country}</Text>

              {/* ✅ WhatsApp Chat Button */}
              <TouchableOpacity
                style={styles.whatsappButton}
                onPress={() => fetchOwnerPhoneNumber(item.name)}>
                <Text style={styles.whatsappText}>💬 Chat on WhatsApp</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('ITEMDETAIL', { item })} // ✅ Pass item data
                style={styles.itemCard}
              >
                {/* <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.itemImage} />
                <Text style={styles.itemName}>{item.name}</Text> */}
                <Text style={[styles.itemStatus, { color: item.is_available ? 'green' : 'red' }]}>
                  {item.is_available ? '🟢 Active' : '🔴 Inactive'}
                </Text>
              </TouchableOpacity>

            </View>
          ))}

        </View>
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('ADDITEM')}>
        <Text style={styles.fabText}>➕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  toggleButtonsContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  toggleButton: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8, marginHorizontal: 5, borderWidth: 1, borderColor: '#ddd', backgroundColor: '#F5F5F5' },
  activeButton: { backgroundColor: '#1E2A78', borderColor: '#1E2A78' },
  toggleButtonText: { fontSize: 14, color: '#555' },
  activeButtonText: { color: '#fff', fontWeight: 'bold' },
  itemsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  itemCard: { backgroundColor: '#fff', borderRadius: 8, padding: 15, marginBottom: 15, width: '45%', marginRight: '2%', elevation: 5 },
  itemCardLeft: { marginLeft: '2%' },
  itemImage: { width: '100%', height: 150, borderRadius: 8, marginBottom: 10 },
  itemName: { fontSize: 18, fontWeight: 'bold', marginBottom: 5, color: '#1E2A78' },
  itemPrice: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 3 },
  itemCategory: { fontSize: 14, color: '#333', marginBottom: 3 },
  itemLocation: { fontSize: 14, color: '#333', marginBottom: 10 },
  deleteButton: { padding: 10, justifyContent: 'center', alignItems: 'center' },
  deleteText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  whatsappButton: {
    backgroundColor: "#25D366", // WhatsApp green color
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    flexDirection: "row",
  },
  whatsappButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  itemStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'center',
  },
  
  whatsappText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  fab: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#1E2A78', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  fabText: { fontSize: 28, color: '#fff' },
});