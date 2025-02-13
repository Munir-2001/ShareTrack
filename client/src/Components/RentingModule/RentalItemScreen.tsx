import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Alert,
} from "react-native";
import { API_URL } from "../../constants";
import { useAppSelector } from "../../Redux/Store/hooks";

export default function RentalItemScreen({ route, navigation }: any) {
    const { item } = route.params; // ✅ Get rental item data
    const user = useAppSelector((state) => state.auth.user);

    const [offerPrice, setOfferPrice] = useState("");

    const submitRentalOffer = async () => {
        if (!offerPrice) {
            Alert.alert("Error", "Enter a rental price.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/rental/offer`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    item_id: item.id,
                    renter_id: user.id,
                    proposed_price: parseFloat(offerPrice),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to submit rental offer.");
            }

            Alert.alert("Success", "Rental offer submitted!");
            setOfferPrice("");
        } catch (error) {
            console.error("❌ Error submitting rental offer:", error);
            Alert.alert("Error", "Could not submit rental offer.");
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.itemName}>{item.item_name}</Text>
            <Text style={styles.itemPrice}>💰 Rental Price: {item.rental_price} PKR</Text>
            <Text style={styles.itemCategory}>📌 Category: {item.category}</Text>
            <Text style={styles.itemLocation}>📍 Location: {item.location}</Text>

            {/* ✅ Rental Offer Input */}
            {user.id !== item.owner_id && (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter offer price"
                        keyboardType="numeric"
                        value={offerPrice}
                        onChangeText={setOfferPrice}
                    />
                    <TouchableOpacity style={styles.offerButton} onPress={submitRentalOffer}>
                        <Text style={styles.offerButtonText}>📩 Submit Rental Offer</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#fff", alignItems: "center" },
    itemName: { fontSize: 22, fontWeight: "bold", marginBottom: 5, color: "#1E2A78" },
    itemPrice: { fontSize: 18, fontWeight: "600", color: "#333", marginBottom: 5 },
    itemCategory: { fontSize: 16, color: "#333", marginBottom: 3 },
    itemLocation: { fontSize: 16, color: "#333", marginBottom: 10 },
    backButton: { alignSelf: "flex-start", padding: 10, marginBottom: 10 },
    backButtonText: { fontSize: 18, color: "#1E2A78", fontWeight: "bold" },
    input: { width: "80%", borderBottomWidth: 1, marginVertical: 10, padding: 5 },
    offerButton: { backgroundColor: "#1E2A78", padding: 10, borderRadius: 8 },
    offerButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, FlatList, TextInput, StyleSheet, Alert } from 'react-native';
// import { API_URL } from '../../constants';
// import { useAppSelector } from '../../Redux/Store/hooks';

// export default function RentalOffersScreen({ navigation }: any) {
//   const user = useAppSelector(state => state.auth.user);
//   const [incomingOffers, setIncomingOffers] = useState<any[]>([]);
//   const [outgoingOffers, setOutgoingOffers] = useState<any[]>([]);
//   const [searchText, setSearchText] = useState('');
//   const [selectedTab, setSelectedTab] = useState<'incoming' | 'outgoing'>('incoming');

//   useEffect(() => {
//     if (!user?.id) {
//       console.error("❌ User ID is undefined, skipping API call.");
//       return;
//     }

//     const fetchRentalOffers = async () => {
//       try {
//         console.log(`Fetching rental offers for user_id: ${user.id}`);
//         const response = await fetch(`${API_URL}/api/rental/offers/${user.id}`);
//         if (!response.ok) throw new Error('Failed to fetch rental offers');

//         const data = await response.json();

//         console.log("✅ Rental Offers Fetched: ", data);
        
//         setIncomingOffers(data?.incoming || []);
//         setOutgoingOffers(data?.outgoing || []);
//       } catch (error) {
//         console.error('❌ Error fetching rental offers:', error);
//         setIncomingOffers([]);
//         setOutgoingOffers([]);
//       }
//     };

//     fetchRentalOffers();
//   }, [user]);

//   // ✅ Filter offers based on search input
//   const filteredOffers = (selectedTab === 'incoming' ? incomingOffers : outgoingOffers)?.filter(offer =>
//     offer.item_name?.toLowerCase().includes(searchText.toLowerCase()) ||
//     offer.renter_name?.toLowerCase().includes(searchText.toLowerCase())
//   ) || [];

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Rental Offers</Text>

//       {/* ✅ Search Bar */}
//       <TextInput
//         style={styles.searchBar}
//         placeholder="Search rental offers..."
//         value={searchText}
//         onChangeText={setSearchText}
//       />

//       {/* ✅ Tabs for Incoming & Outgoing Offers */}
//       <View style={styles.tabContainer}>
//         <TouchableOpacity
//           style={[styles.tabButton, selectedTab === 'incoming' && styles.activeTab]}
//           onPress={() => setSelectedTab('incoming')}
//         >
//           <Text style={styles.tabText}>Incoming</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.tabButton, selectedTab === 'outgoing' && styles.activeTab]}
//           onPress={() => setSelectedTab('outgoing')}
//         >
//           <Text style={styles.tabText}>Outgoing</Text>
//         </TouchableOpacity>
//       </View>

//       {/* ✅ List of Offers */}
//       {/* <FlatList
//         data={filteredOffers}
//         keyExtractor={item => item.id.toString()}
//         renderItem={({ item }) => (
//           <View style={styles.offerCard}>
//             <Text style={styles.itemName}>📌 {item.item_name}</Text>
//             <Text>💰 Original Price: {item.rental_price} PKR</Text>
//             <Text>💰 Offered Price: {item.proposed_price} PKR</Text>
//             <Text>👤 Offered by: {item.renter_name}</Text>

//             {selectedTab === 'incoming' && (
//               <View style={styles.buttonContainer}>
//                 <TouchableOpacity
//                   style={styles.acceptButton}
//                   onPress={() => handleAcceptOffer(item.id)}
//                 >
//                   <Text style={styles.buttonText}>✅ Accept</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   style={styles.rejectButton}
//                   onPress={() => handleRejectOffer(item.id)}
//                 >
//                   <Text style={styles.buttonText}>❌ Reject</Text>
//                 </TouchableOpacity>
//               </View>
//             )}
//           </View>
//         )}
//       /> */}
//       <FlatList
//   data={filteredOffers}
//   keyExtractor={(item) => item.id.toString()}
//   renderItem={({ item }) => (
//     <View style={styles.offerCard}>
//       <Text style={styles.itemName}>📌 {item.rental_items?.item_name || "Unknown Item"}</Text>
//       <Text>💰 Original Price: {item.rental_items?.rental_price || "N/A"} PKR</Text>
//       <Text>💰 Offered Price: {item.proposed_price} PKR</Text>
//       <Text>👤 Offered by: {item.renter_id}</Text>

//       {/* ✅ Approve/Reject buttons only for Incoming Offers */}
//       {selectedTab === "incoming" && (
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity
//             style={styles.acceptButton}
//             onPress={() => handleAcceptOffer(item.id)}
//           >
//             <Text style={styles.buttonText}>✅ Accept</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.rejectButton}
//             onPress={() => handleRejectOffer(item.id)}
//           >
//             <Text style={styles.buttonText}>❌ Reject</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   )}
// />

//     </View>
//   );
// }

// // ✅ Handle Accept Offer API Call
// const handleAcceptOffer = async (offerId: number) => {
//   try {
//     console.log(`✅ Accepting rental offer with ID: ${offerId}`);

//     const response = await fetch(`${API_URL}/api/rental/offer/accept`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ offer_id: offerId, rental_start: new Date(), rental_end: new Date() }),
//     });

//     if (!response.ok) throw new Error('Failed to accept offer');

//     Alert.alert('Success', 'Offer accepted successfully!');
//   } catch (error) {
//     console.error('❌ Error accepting rental offer:', error);
//     Alert.alert('Error', 'Could not accept rental offer');
//   }
// };

// // ✅ Handle Reject Offer API Call
// const handleRejectOffer = async (offerId: number) => {
//   try {
//     console.log(`❌ Rejecting rental offer with ID: ${offerId}`);

//     const response = await fetch(`${API_URL}/api/rental/offer/reject`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ offer_id: offerId }),
//     });

//     if (!response.ok) throw new Error('Failed to reject offer');

//     Alert.alert('Success', 'Offer rejected successfully!');
//   } catch (error) {
//     console.error('❌ Error rejecting rental offer:', error);
//     Alert.alert('Error', 'Could not reject rental offer');
//   }
// };
// const styles = StyleSheet.create({
//     container: { flex: 1, padding: 20, backgroundColor: "#fff", alignItems: "center" },
//     itemName: { fontSize: 22, fontWeight: "bold", marginBottom: 5, color: "#1E2A78" },
//     itemPrice: { fontSize: 18, fontWeight: "600", color: "#333", marginBottom: 5 },
//     itemCategory: { fontSize: 16, color: "#333", marginBottom: 3 },
//     itemLocation: { fontSize: 16, color: "#333", marginBottom: 10 },
//     backButton: { alignSelf: "flex-start", padding: 10, marginBottom: 10 },
//     backButtonText: { fontSize: 18, color: "#1E2A78", fontWeight: "bold" },
//     input: { width: "80%", borderBottomWidth: 1, marginVertical: 10, padding: 5 },
//     offerButton: { backgroundColor: "#1E2A78", padding: 10, borderRadius: 8 },
//     offerButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
//     title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
//     searchBar: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 10 },
//     tabContainer: { flexDirection: 'row', marginBottom: 10 },
//     tabButton: { flex: 1, padding: 10, alignItems: 'center', backgroundColor: '#ddd' },
//     activeTab: { backgroundColor: '#1E2A78' },
//     tabText: { fontSize: 16, color: '#fff' },
//     offerCard: { padding: 15, borderWidth: 1, borderColor: '#ddd', marginBottom: 10, borderRadius: 5 },
//     buttonContainer: { flexDirection: 'row', marginTop: 10 },
//     acceptButton: { flex: 1, backgroundColor: 'green', padding: 10, borderRadius: 5, alignItems: 'center', marginRight: 5 },
//     rejectButton: { flex: 1, backgroundColor: 'red', padding: 10, borderRadius: 5, alignItems: 'center' },
//     buttonText: { color: '#fff', fontWeight: 'bold' },
// });