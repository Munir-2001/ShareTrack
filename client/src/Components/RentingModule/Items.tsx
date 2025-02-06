import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';

import {
  getAllItems,
  getUserItems,
  deleteItem,
} from '../../Redux/Actions/AuthActions/ItemAction';
import { useAppDispatch, useAppSelector } from '../../Redux/Store/hooks';

export default function ItemScreen({ navigation }: any) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const allItems = useAppSelector(state => state.item.all_items);
  const myItems = useAppSelector(state => state.item.user_items);

  const [showAll, setShowAll] = useState(true);
  const [data, setData] = useState<any[]>([]); // ✅ Ensure data is an array of objects

  // useEffect(() => {
  //   if (showAll) setData(allItems);
  //   else setData(myItems);
  // }, [showAll, allItems, myItems]);
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
          {data.map((item: any, index: number) => (
            <View key={item.id} style={[styles.itemCard, index % 2 === 0 && styles.itemCardLeft]}>
              <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.itemImage} />
              <Text style={styles.itemName}>{item.name}</Text>

              {/* ✅ Corrected price display */}
              <Text style={styles.itemPrice}>
                💰 Price: {item.price !== null && item.price !== undefined ? `${parseFloat(item.price).toFixed(0)} PKR` : 'N/A'}
              </Text>

              <Text style={styles.itemCategory}>📌 Category: {item.category}</Text>
              <Text style={styles.itemLocation}>📍 Location: {item.city}, {item.state}, {item.country}</Text>

              {item.owner_id === user.id && (
                <TouchableOpacity
                  style={[styles.deleteButton, { backgroundColor: '#D32F2F' }]}
                  onPress={() => {
                    dispatch(deleteItem(item.id));
                    setData(prevData => prevData.filter(i => i.id !== item.id)); // ✅ Remove from local state
                  }}>
                  <Text style={styles.deleteText}>🗑️ Delete</Text>
                </TouchableOpacity>
              )}
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
  fab: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#1E2A78', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  fabText: { fontSize: 28, color: '#fff' },
});