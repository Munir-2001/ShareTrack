// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Image,
// } from 'react-native';
// import { Linking, Alert } from 'react-native';
// import { API_URL } from '../../constants';
// import {
//   getAllItems,
//   getUserItems,
//   deleteItem,
//   getItemOwnerPhone
// } from '../../Redux/Actions/AuthActions/ItemAction';
// import { useAppDispatch, useAppSelector } from '../../Redux/Store/hooks';
// import { TextInput } from 'react-native';

// // Function to Get a Random Image
// // const getRandomImage = () => itemImages[Math.floor(Math.random() * itemImages.length)];

// export default function ItemScreen({ navigation }: any) {
//   const dispatch = useAppDispatch();
//   const user = useAppSelector(state => state.auth.user);
//   const allItems = useAppSelector(state => state.item.all_items);
//   const myItems = useAppSelector(state => state.item.user_items);

//   const [showAll, setShowAll] = useState(true);
//   const [showRentals, setShowRentals] = useState(false); // ✅ Manage rentals tab visibility
//   const [rentalItems, setRentalItems] = useState<any[]>([]); // ✅ Store rental items data
//   const [data, setData] = useState<any[]>([]); // ✅ Ensure data is an array of objects
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showMyRentals, setShowMyRentals] = useState(false); // ✅ Toggle for user's rental items

//   useEffect(() => {
//     const unsubscribe = navigation.addListener('focus', () => {
//       dispatch(getAllItems()); // ✅ Refresh items list when returning to screen
//       dispatch(getUserItems(user.id));
//     });

//     return unsubscribe;
//   }, [navigation]);


//   // const fetchOwnerPhoneNumber = async (itemName: string) => {
//   //   try {
//   //     console.log(`📞 Fetching phone number for item: ${itemName}`);

//   //     const response = await fetch(`${API_URL}/api/item/getItemOwnerPhone`, {
//   //       method: "POST",
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //       },
//   //       body: JSON.stringify({ itemName: itemName }), // ✅ Send itemName instead of itemId
//   //     });

//   //     if (!response.ok) {
//   //       throw new Error(`Phone Number Not available. Status: ${response.status}`);
//   //     }

//   //     const data = await response.json();
//   //     console.log(`✅ Owner Details Received:`, data);

//   //     if (!data.owner_phone) {  // ✅ Fix here (use owner_phone instead of phone)
//   //       Alert.alert("Phone number not available!");
//   //       return;
//   //     }
//   //     // ✅ Generate WhatsApp URL
//   //     const whatsappUrl = `https://wa.me/${data.owner_phone.replace(/\D/g, "")}`;
//   //     console.log(`📲 Opening WhatsApp: ${whatsappUrl}`);

//   //     // ✅ Open WhatsApp Chat
//   //     Linking.openURL(whatsappUrl);

//   //   } catch (error) {
//   //     console.log("❌ Error fetching phone number:", error);
//   //     Alert.alert("Error fetching phone number");
//   //   }
//   // };
//   const fetchOwnerPhoneNumber = async (itemName: string) => {
//     try {
//       console.log(`📞 Fetching phone number for item: ${itemName}`);

//       const response = await fetch(`${API_URL}/api/item/getItemOwnerPhone`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ itemName }), // ✅ Ensure correct structure
//       });

//       console.log("📡 API Response Status:", response.status);

//       if (!response.ok) {
//         const errorResponse = await response.json();
//         console.error("❌ API Error Response:", errorResponse);
//         throw new Error(`Failed to fetch phone number: ${errorResponse.message || "Unknown error"}`);
//       }

//       const data = await response.json();
//       console.log("✅ Owner Details Received:", data);

//       if (!data || !data.owner_phone) {
//         Alert.alert("Phone number not available!");
//         console.warn("⚠️ No phone number found in response:", data);
//         return;
//       }

//       // ✅ Generate WhatsApp URL
//       const whatsappUrl = `https://wa.me/${data.owner_phone.replace(/\D/g, "")}`;
//       console.log(`📲 Opening WhatsApp: ${whatsappUrl}`);

//       // ✅ Open WhatsApp Chat
//       Linking.openURL(whatsappUrl);
//     } catch (error:any) {
//       console.log("❌ Error fetching phone number:", error);
//       Alert.alert("Error fetching phone number:",error || "Unknown error");
//     }
//   };



//   const fetchRentalItems = async () => {
//     try {
//       const response = await fetch(`${API_URL}/api/rental/rentals`);
//       if (!response.ok) throw new Error("Failed to fetch rental items");

//       const data = await response.json();
//       setRentalItems(data); // ✅ Update rental items state
//     } catch (error) {
//       console.log("❌ Error fetching rental items:", error);
//     }
//   };
//   const filteredData = data.filter((item) =>
//     item.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const filteredRentalItems = rentalItems.filter((item) =>
//     item.item_name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // ✅ Fetch rentals when Rentals tab is active
//   useEffect(() => {
//     if (showRentals) {
//       fetchRentalItems();
//       setShowAll(false);
//     } else {
//       setRentalItems([]); // ✅ Clear rental items when switching tabs
//     }
//   }, [showRentals]);


//   useEffect(() => {
//     if (showAll) {
//       // ✅ Explicitly define the type of 'item' using TypeScript annotation
//       setData(allItems.filter((item: { owner_id: string }) => item.owner_id !== user.id));
//     } else {
//       setData(myItems);
//     }
//   }, [showAll, allItems, myItems]);


//   useEffect(() => {
//     dispatch(getAllItems());
//     dispatch(getUserItems(user.id));
//   }, []);

//   return (

//     <View style={styles.container}>
//       {/* <View style={styles.toggleButtonsContainer}>
//         <TouchableOpacity
//           style={[styles.toggleButton, showAll && styles.activeButton]}
//           onPress={() => setShowAll(true)}>
//           <Text style={showAll ? styles.activeButtonText : styles.toggleButtonText}>
//             📦 Show All Items
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.toggleButton, !showAll && styles.activeButton]}
//           onPress={() => setShowAll(false)}>
//           <Text style={!showAll ? styles.activeButtonText : styles.toggleButtonText}>
//             🏠 Show My Items
//           </Text>
//         </TouchableOpacity>
//       </View> */}
// <TextInput
//   style={styles.searchBar}
//   placeholder=" Search items..."
//   value={searchQuery}
//   onChangeText={setSearchQuery}
// />
//       <View style={styles.toggleButtonsContainer}>
//         {/* <TouchableOpacity
//           style={[styles.toggleButton, showAll && styles.activeButton]}
//           onPress={() => {
//             setShowAll(true);
//             setShowRentals(false);
//           }}>
//           <Text style={showAll ? styles.activeButtonText : styles.toggleButtonText}>
//             📦 Show All Items
//           </Text>
//         </TouchableOpacity> */}

//         {/* <TouchableOpacity
//           style={[styles.toggleButton, !showAll && !showRentals && styles.activeButton]}
//           onPress={() => {
//             setShowAll(false);
//             setShowRentals(false);
//           }}>
//           <Text style={!showAll && !showRentals ? styles.activeButtonText : styles.toggleButtonText}>
//             🏠 Show My Items
//           </Text>
//         </TouchableOpacity> */}


//         <TouchableOpacity
//           style={[styles.toggleButton, showRentals && styles.activeButton]}
//           onPress={() => {
//             setShowAll(false);
//             setShowRentals(true);
//           }}>
//           <Text style={showRentals ? styles.activeButtonText : styles.toggleButtonText}>
//           🚀 Rentals
//           </Text>
//         </TouchableOpacity>
//       </View>
//       <ScrollView>
//       <View style={styles.itemsRow}>
//   {/* {showRentals
//     ? filteredRentalItems.map((item, index) => (
//         <TouchableOpacity
//           key={item.id}
//           onPress={() => navigation.navigate("RENTALITEMDETAILS", { item })}
//           style={[styles.itemCard, index % 2 === 0 && styles.itemCardLeft]}
//         >
//           <Image source={{ uri: item.photo }} style={styles.itemImage} />
//           <Text style={styles.itemName}>{item.item_name}</Text>
//           <Text style={styles.itemPrice}>💰 Price: {item.rental_price} $</Text>
//           <Text style={styles.itemCategory}>📌 Category: {item.category}</Text>
//           <Text style={styles.itemLocation}>📍 Location: {item.location}</Text>
//         </TouchableOpacity>
//       ))
//     : filteredData.map((item, index) => (
//         <TouchableOpacity
//           key={item.id}
//           onPress={() => navigation.navigate("ITEMDETAIL", { item })}
//           style={[styles.itemCard, index % 2 === 0 && styles.itemCardLeft]}
//         >
//           <Image source={{ uri: item.photo }} style={styles.itemImage} />
//           <Text style={styles.itemName}>{item.name}</Text>
//           <Text style={styles.itemPrice}>
//             💰 Price: {item.price !== null && item.price !== undefined ? `${parseFloat(item.price).toFixed(0)} $` : "N/A"}
//           </Text>

//           <TouchableOpacity
//             style={styles.whatsappButton}
//             onPress={() => fetchOwnerPhoneNumber(item.name)}
//           >
//             <Text style={styles.whatsappText}>💬 Chat on WhatsApp</Text>
//           </TouchableOpacity>

//           <Text style={[styles.itemStatus, { color: item.is_available ? 'green' : 'red' }]}>
//             {item.is_available ? '🟢 Active' : '🔴 Inactive'}
//           </Text>
//         </TouchableOpacity>
//       ))} */}
//       {showRentals
//   ? filteredRentalItems.map((item, index) => (
//       <TouchableOpacity
//         key={item.id}
//         onPress={() => navigation.navigate("RENTALITEMDETAILS", { item })}
//         style={[styles.itemCard, index % 2 === 0 && styles.itemCardLeft]}
//       >
//         <Image source={{ uri: item.photo }} style={styles.itemImage} />
//         <Text style={styles.itemName}>{item.item_name}</Text>
//         <Text style={styles.itemPrice}>💰 Price: {item.rental_price} $</Text>
//         <Text style={styles.itemCategory}>📌 Category: {item.category}</Text>
//         <Text style={styles.itemLocation}>📍 Location: {item.location}</Text>

//         {/* ✅ WhatsApp Chat Button */}
//         <TouchableOpacity
//           style={styles.whatsappButton}
//           onPress={() => fetchOwnerPhoneNumber(item.item_name)}
//         >
//           <Text style={styles.whatsappText}>💬 Chat on WhatsApp</Text>
//         </TouchableOpacity>

//       </TouchableOpacity>
//     ))
//   : filteredData.map((item, index) => (
//       <TouchableOpacity
//         key={item.id}
//         onPress={() => navigation.navigate("ITEMDETAIL", { item })}
//         style={[styles.itemCard, index % 2 === 0 && styles.itemCardLeft]}
//       >
//         <Image source={{ uri: item.photo }} style={styles.itemImage} />
//         <Text style={styles.itemName}>{item.name}</Text>
//         <Text style={styles.itemPrice}>
//           💰 Price: {item.price !== null && item.price !== undefined ? `${parseFloat(item.price).toFixed(0)} $` : "N/A"}
//         </Text>

//         {/* ✅ WhatsApp Chat Button */}
//         <TouchableOpacity
//           style={styles.whatsappButton}
//           onPress={() => fetchOwnerPhoneNumber(item.name)}
//         >
//           <Text style={styles.whatsappText}>💬 Chat on WhatsApp</Text>
//         </TouchableOpacity>

//         <Text style={[styles.itemStatus, { color: item.is_available ? 'green' : 'red' }]}>
//           {item.is_available ? '🟢 Active' : '🔴 Inactive'}
//         </Text>
//       </TouchableOpacity>
//     ))}


// </View>

//       </ScrollView>



//       {showRentals && (
//         <View style={styles.rentalManagementContainer}>
//           <Text style={styles.rentalManagementTitle}>Rental Management</Text>

//           <View style={styles.managementTiles}>
//             {/* Create Rental Item Button */}
//             <TouchableOpacity
//               style={styles.managementTile}
//               onPress={() => navigation.navigate("CREATERENTALITEM")}
//             >
//               <Text style={styles.managementTileText}>
//                 ➕</Text>
//             </TouchableOpacity>

//             {/* Show Rental Offers Button */}
//             <TouchableOpacity
//               style={styles.managementTile}
//               onPress={() => navigation.navigate("RENTALOFFERS")}
//             >
//               <Text style={styles.managementTileText}> Show Rental Offers</Text>
//             </TouchableOpacity>


//             <TouchableOpacity
//               style={styles.managementTile}
//               onPress={() => navigation.navigate("RentalStatus")}
//             >
//               <Text style={styles.managementTileText}>Rental Status</Text>
//             </TouchableOpacity>

//           </View>
//         </View>
//       )}


//       {/* Floating Add Button */}
//       {!showRentals && (
//         <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('ADDITEM')}>
//           <Text style={styles.fabText}>➕</Text>
//         </TouchableOpacity>
//       )}
//     </View>




//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: '#fff' },
//   toggleButtonsContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
//   toggleButton: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8, marginHorizontal: 5, borderWidth: 1, borderColor: '#ddd', backgroundColor: '#F5F5F5' },
//   activeButton: { backgroundColor: '#1E2A78', borderColor: '#1E2A78' },
//   toggleButtonText: { fontSize: 14, color: '#555' },
//   activeButtonText: { color: '#fff', fontWeight: 'bold' },
//   itemsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
//   itemCard: { backgroundColor: '#fff', borderRadius: 8, padding: 15, marginBottom: 15, width: '45%', marginRight: '2%', elevation: 5 },
//   itemCardLeft: { marginLeft: '2%' },
//   itemImage: { width: '100%', height: 150, borderRadius: 8, marginBottom: 10 },
//   itemName: { fontSize: 18, fontWeight: 'bold', marginBottom: 5, color: '#1E2A78' },
//   itemPrice: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 3 },
//   itemCategory: { fontSize: 14, color: '#333', marginBottom: 3 },
//   itemLocation: { fontSize: 14, color: '#333', marginBottom: 10 },
//   deleteButton: { padding: 10, justifyContent: 'center', alignItems: 'center' },
//   deleteText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },

//   whatsappButton: {
//     backgroundColor: "#25D366", // WhatsApp green color
//     padding: 12,
//     borderRadius: 8,
//     alignItems: "center",
//     justifyContent: "center",
//     marginVertical: 10,
//     flexDirection: "row",
//   },
//   rentalManagementContainer: {
//     marginTop: 20,
//     padding: 15,
//     backgroundColor: "#F5F5F5",
//     borderRadius: 10,
//     alignItems: "center",
//   },

//   rentalManagementTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#1E2A78",
//     marginBottom: 10,
//   },

//   managementTiles: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     width: "100%",
//   },

//   searchBar: {
//     height: 40,
//     borderColor: '#ddd',
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     marginBottom: 15,
//     backgroundColor: '#F5F5F5',
//     color: "#1E2A78",
//   },

//   managementTile: {
//     flex: 1,
//     backgroundColor: "#1E2A78",
//     paddingVertical: 15,
//     borderRadius: 8,
//     alignItems: "center",
//     marginHorizontal: 5,
//   },

//   managementTileText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   whatsappButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   itemStatus: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginTop: 5,
//     textAlign: 'center',
//   },

//   whatsappText: {
//     color: "#fff",
//     fontSize: 14,
//     fontWeight: "bold",
//   },
//   fab: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#1E2A78', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 },
//   fabText: { fontSize: 28, color: '#fff' },
// });
// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Image,
//   TextInput,
//   Alert,
//   Linking,
// } from "react-native";
// import { useAppDispatch, useAppSelector } from "../../Redux/Store/hooks";
// import { API_URL } from "../../constants";

// export default function RentalsScreen({ navigation }: any) {
//   const dispatch = useAppDispatch();
//   const user = useAppSelector((state) => state.auth.user);

//   const [showMyRentals, setShowMyRentals] = useState(false); // ✅ Toggle for "My Rental Items"
//   const [rentalItems, setRentalItems] = useState<any[]>([]); // ✅ Store rental items
//   const [searchQuery, setSearchQuery] = useState("");

//   // ✅ Fetch All Rental Items
//   const fetchRentalItems = async () => {
//     try {
//       const response = await fetch(`${API_URL}/api/rental/rentals`);
//       if (!response.ok) throw new Error("Failed to fetch rental items");
//       const data = await response.json();
//       setRentalItems(data);
//     } catch (error) {
//       console.error("❌ Error fetching rental items:", error);
//     }
//   };

//   // ✅ Fetch My Rental Items
//   const fetchUserRentalItems = async () => {
//     try {
//       console.log(`📦 Fetching rental items for user: ${user.id}`);
//       const response = await fetch(`${API_URL}/api/rental/userRentals`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ owner_id: user.id }),
//       });
//       if (!response.ok) throw new Error("Failed to fetch user rental items");
//       const data = await response.json();
//       setRentalItems(data);
//     } catch (error) {
//       console.error("❌ Error fetching user rental items:", error);
//     }
//   };

//   // ✅ Handle Tab Switching
//   useEffect(() => {
//     if (showMyRentals) {
//       fetchUserRentalItems();
//     } else {
//       fetchRentalItems();
//     }
//   }, [showMyRentals]);

//   // ✅ Filter Items Based on Search
//   const filteredRentalItems = rentalItems.filter((item) =>
//     item.item_name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // ✅ Fetch Item Owner's Phone Number
//   const fetchOwnerPhoneNumber = async (itemName: string) => {
//     try {
//       console.log(`📞 Fetching phone number for item: ${itemName}`);
//       const response = await fetch(`${API_URL}/api/item/getItemOwnerPhone`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ itemName }),
//       });

//       if (!response.ok) throw new Error("Failed to fetch phone number");
//       const data = await response.json();

//       if (!data || !data.owner_phone) {
//         Alert.alert("Phone number not available!");
//         return;
//       }

//       const whatsappUrl = `https://wa.me/${data.owner_phone.replace(/\D/g, "")}`;
//       console.log(`📲 Opening WhatsApp: ${whatsappUrl}`);
//       Linking.openURL(whatsappUrl);
//     } catch (error) {
//       console.error("❌ Error fetching phone number:", error);
//       Alert.alert("Error fetching phone number");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {/* 🔍 Search Bar */}
//       <TextInput
//         style={styles.searchBar}
//         placeholder="🔎 Search rental items..."
//         value={searchQuery}
//         onChangeText={setSearchQuery}
//       />

//       {/* 🏷 Toggle Tabs */}
//       <View style={styles.toggleButtonsContainer}>
//         <TouchableOpacity
//           style={[styles.toggleButton, !showMyRentals && styles.activeButton]}
//           onPress={() => setShowMyRentals(false)}
//         >
//           <Text style={!showMyRentals ? styles.activeButtonText : styles.toggleButtonText}>
//             🚀 All Rentals
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.toggleButton, showMyRentals && styles.activeButton]}
//           onPress={() => setShowMyRentals(true)}
//         >
//           <Text style={showMyRentals ? styles.activeButtonText : styles.toggleButtonText}>
//             🏠 My Rental Items
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* 📦 Rental Items List */}
//       <ScrollView>
//         <View style={styles.itemsRow}>
//           {filteredRentalItems.map((item, index) => (
//             <TouchableOpacity
//               key={item.id}
//               onPress={() => navigation.navigate("RENTALITEMDETAILS", { item })}
//               style={[styles.itemCard, index % 2 === 0 && styles.itemCardLeft]}
//             >
//               <Image source={{ uri: item.photo }} style={styles.itemImage} />
//               <Text style={styles.itemName}>{item.item_name}</Text>
//               <Text style={styles.itemPrice}>💰 {item.rental_price} $</Text>
//               <Text style={styles.itemCategory}>📌 {item.category}</Text>
//               <Text style={styles.itemLocation}>📍 {item.location}</Text>

//               {/* ✅ WhatsApp Chat Button */}
//               <TouchableOpacity
//                 style={styles.whatsappButton}
//                 onPress={() => fetchOwnerPhoneNumber(item.item_name)}
//               >
//                 <Text style={styles.whatsappText}>💬 Chat on WhatsApp</Text>
//               </TouchableOpacity>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </ScrollView>

//       {/* ➕ Floating Add Rental Button */}
//       <TouchableOpacity
//         style={styles.fab}
//         onPress={() => navigation.navigate("CREATERENTALITEM")}
//       >
//         <Text style={styles.fabText}>➕</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: "#fff" },
//   searchBar: {
//     height: 40,
//     borderColor: "#ddd",
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     marginBottom: 15,
//     backgroundColor: "#F5F5F5",
//     color: "#1E2A78",
//   },
//   toggleButtonsContainer: { flexDirection: "row", justifyContent: "center", marginBottom: 20 },
//   toggleButton: {
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 8,
//     marginHorizontal: 5,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     backgroundColor: "#F5F5F5",
//   },
//   activeButton: { backgroundColor: "#1E2A78", borderColor: "#1E2A78" },
//   toggleButtonText: { fontSize: 14, color: "#555" },
//   activeButtonText: { color: "#fff", fontWeight: "bold" },
//   itemsRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
//   itemCard: { backgroundColor: "#fff", borderRadius: 8, padding: 15, marginBottom: 15, width: "45%", marginRight: "2%", elevation: 5 },
//   itemCardLeft: { marginLeft: "2%" },
//   itemImage: { width: "100%", height: 150, borderRadius: 8, marginBottom: 10 },
//   itemName: { fontSize: 18, fontWeight: "bold", marginBottom: 5, color: "#1E2A78" },
//   itemPrice: { fontSize: 16, fontWeight: "600", color: "#333", marginBottom: 3 },
//   itemCategory: { fontSize: 14, color: "#333", marginBottom: 3 },
//   itemLocation: { fontSize: 14, color: "#333", marginBottom: 10 },
//   whatsappButton: { backgroundColor: "#25D366", padding: 12, borderRadius: 8, alignItems: "center", marginVertical: 10 },
//   whatsappText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
//   fab: { position: "absolute", bottom: 20, right: 20, backgroundColor: "#1E2A78", width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: "center", elevation: 5 },
//   fabText: { fontSize: 28, color: "#fff" },
// });

// // export default RentalsScreen;


// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Image,
//   TextInput,
//   Alert,
//   Linking,
// } from "react-native";
// import { useAppSelector } from "../../Redux/Store/hooks";
// import { API_URL } from "../../constants";

// export default function RentalsScreen({ navigation }: any) {
//   const user = useAppSelector((state) => state.auth.user);

//   const [showMyRentals, setShowMyRentals] = useState(false); // Toggle for "My Rental Items"
//   const [rentalItems, setRentalItems] = useState<any[]>([]); // Store rental items
//   const [searchQuery, setSearchQuery] = useState("");
//   const [refreshing, setRefreshing] = useState(false); // Pull-to-refresh state

//   // ✅ Fetch All Rental Items (Single API Call)
//   useEffect(() => {
//     const fetchRentalItems = async () => {
//       try {
//         const response = await fetch(`${API_URL}/api/rental/rentals`);
//         if (!response.ok) throw new Error("Failed to fetch rental items");
//         const data = await response.json();
//         setRentalItems(data);
//       } catch (error) {
//         console.error("❌ Error fetching rental items:", error);
//       }
//     };

//     fetchRentalItems();
//   }, []);

//   // ✅ Toggle Availability Status (Active / Inactive)
//   // const toggleAvailability = async (itemId: string, currentStatus: boolean) => {
//   //   try {
//   //     console.log(`🔄 Updating availability for item: ${itemId}`);
//   //     const response = await fetch(`${API_URL}/api/rental/updateAvailability`, {
//   //       method: "POST",
//   //       headers: { "Content-Type": "application/json" },
//   //       body: JSON.stringify({ itemId, is_available: !currentStatus }),
//   //     });

//   //     if (!response.ok) throw new Error("Failed to update item availability");
//   //     const updatedItem = await response.json();

//   //     // ✅ Update UI Immediately
//   //     setRentalItems((prevItems) =>
//   //       prevItems.map((item) =>
//   //         item.id === itemId ? { ...item, is_available: !currentStatus } : item
//   //       )
//   //     );
//   //   } catch (error) {
//   //     console.error("❌ Error updating availability:", error);
//   //     Alert.alert("Error updating item availability");
//   //   }
//   // };


//   // ✅ Filter Rental Items Based on Tab Selection
//   const filteredRentalItems = rentalItems
//     .filter((item) =>
//       showMyRentals ? item.owner_id === user.id : item.owner_id !== user.id
//     )
//     .filter((item) =>
//       item.item_name.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//   // ✅ Fetch Item Owner's Phone Number
//   const fetchOwnerPhoneNumber = async (itemName: string) => {
//     try {
//       console.log(`📞 Fetching phone number for item: ${itemName}`);
//       const response = await fetch(`${API_URL}/api/item/getItemOwnerPhone`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ itemName }),
//       });

//       if (!response.ok) throw new Error("Failed to fetch phone number");
//       const data = await response.json();

//       if (!data || !data.owner_phone) {
//         Alert.alert("Phone number not available!");
//         return;
//       }

//       const whatsappUrl = `https://wa.me/${data.owner_phone.replace(/\D/g, "")}`;
//       console.log(`📲 Opening WhatsApp: ${whatsappUrl}`);
//       Linking.openURL(whatsappUrl);
//     } catch (error) {
//       console.error("❌ Error fetching phone number:", error);
//       Alert.alert("Error fetching phone number");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {/* 🔍 Search Bar */}
//       <TextInput
//         style={styles.searchBar}
//         placeholder="🔎 Search rental items..."
//         value={searchQuery}
//         onChangeText={setSearchQuery}
//         placeholderTextColor="#666"

//       />

//       {/* 🏷 Toggle Tabs */}
//       <View style={styles.toggleButtonsContainer}>
//         <TouchableOpacity
//           style={[styles.toggleButton, !showMyRentals && styles.activeButton]}
//           onPress={() => setShowMyRentals(false)}
//         >
//           <Text style={!showMyRentals ? styles.activeButtonText : styles.toggleButtonText}>
//             🚀 All Rentals
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.toggleButton, showMyRentals && styles.activeButton]}
//           onPress={() => setShowMyRentals(true)}
//         >
//           <Text style={showMyRentals ? styles.activeButtonText : styles.toggleButtonText}>
//             🏠 My Rental Items
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* 📦 Rental Items List */}
//       <ScrollView>
//         <View style={styles.itemsRow}>
//           {filteredRentalItems.length === 0 ? (
//             <Text style={styles.noItemsText}>No items found.</Text>
//           ) : (
//             filteredRentalItems.map((item, index) => (
//               <TouchableOpacity
//                 key={item.id}
//                 onPress={() => navigation.navigate("RENTALITEMDETAILS", { item })}
//                 style={[styles.itemCard, index % 2 === 0 && styles.itemCardLeft]}
//               >
//                 <Image source={{ uri: item.photo }} style={styles.itemImage} />
//                 <Text style={styles.itemName}>{item.item_name}</Text>
//                 <Text style={styles.itemPrice}>💰 {item.rental_price} $</Text>
//                 <Text style={styles.itemCategory}>📌 {item.category}</Text>
//                 <Text style={styles.itemLocation}>📍 {item.location}</Text>

//                 {/* ✅ WhatsApp Chat Button */}
//                 {/* {!showMyRentals && (
//                   <TouchableOpacity
//                     style={styles.whatsappButton}
//                     onPress={() => fetchOwnerPhoneNumber(item.item_name)}
//                   >
//                     <Text style={styles.whatsappText}>💬 Chat on WhatsApp</Text>
//                   </TouchableOpacity>
//                 )} */}
//                 {/* ✅ Display Active/Inactive Status */}
//                 {showMyRentals ? (
//                   <View
//                     style={[
//                       styles.statusContainer,
//                       item.is_available ? styles.activeStatus : styles.inactiveStatus,
//                     ]}
//                   >
//                     {/* <Text style={styles.statusText}>
//                       {item.is_available ? "🟢 Active" : "🔴 Inactive"}
//                     </Text> */}
//                     <Text style={styles.statusText}>
//                       {item.is_available ? "🟢 Available" : "🔴 Unavailable"}
//                     </Text>
//                   </View>
//                 ) : (
//                   <TouchableOpacity
//                     style={styles.whatsappButton}
//                     onPress={() => fetchOwnerPhoneNumber(item.item_name)}
//                   >
//                     <Text style={styles.whatsappText}>💬 Chat on WhatsApp</Text>
//                   </TouchableOpacity>
//                 )}

//               </TouchableOpacity>
//             ))
//           )}
//         </View>
//       </ScrollView>
//       {/* 📌 Rental Management Section (Only in My Rental Items Tab) */}
//       {showMyRentals && (
//         <View style={styles.rentalManagementContainer}>
//           <Text style={styles.rentalManagementTitle}>Rental Management</Text>

//           <View style={styles.managementTiles}>
//             {/* ➕ Create Rental Item */}
//             <TouchableOpacity
//               style={styles.managementTile}
//               onPress={() => navigation.navigate("CREATERENTALITEM")}
//             >
//               <Text style={styles.managementTileText}>➕ Create Rental</Text>
//             </TouchableOpacity>

//             {/* 📜 View Rental Offers */}
//             <TouchableOpacity
//               style={styles.managementTile}
//               onPress={() => navigation.navigate("RENTALOFFERS")}
//             >
//               <Text style={styles.managementTileText}>📜 Rental Offers</Text>
//             </TouchableOpacity>

//             {/* 📊 View Rental Status */}
//             <TouchableOpacity
//               style={styles.managementTile}
//               onPress={() => navigation.navigate("RentalStatus")}
//             >
//               <Text style={styles.managementTileText}>📊 Rental Status</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: "#fff" },
//   searchBar: {
//     height: 40,
//     borderColor: "#ddd",
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     marginBottom: 15,
//     backgroundColor: "#F5F5F5",
//     color: "#1E2A78",
//   },
//   availabilityButton: {
//     padding: 10,
//     borderRadius: 8,
//     alignItems: "center"
//   },
//   activeStatus: {
//     backgroundColor: "green"
//   },
//   inactiveStatus: {
//     backgroundColor: "red"
//   },
//   availabilityText: {
//     color: "#fff",
//     fontWeight: "bold"
//   },
//   rentalManagementContainer: {
//     marginTop: 20,
//     padding: 15,
//     backgroundColor: "#F5F5F5",
//     borderRadius: 10,
//     alignItems: "center",
//   },

//   rentalManagementTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#1E2A78",
//     marginBottom: 10,
//   },

//   managementTiles: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     width: "100%",
//   },

//   managementTile: {
//     flex: 1,
//     backgroundColor: "#1E2A78",
//     paddingVertical: 15,
//     borderRadius: 8,
//     alignItems: "center",
//     marginHorizontal: 5,
//   },

//   managementTileText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   toggleButtonsContainer: { flexDirection: "row", justifyContent: "center", marginBottom: 20 },
//   toggleButton: {
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 8,
//     marginHorizontal: 5,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     backgroundColor: "#F5F5F5",
//   },
//   activeButton: { backgroundColor: "#1E2A78", borderColor: "#1E2A78" },
//   toggleButtonText: { fontSize: 14, color: "#555" },
//   activeButtonText: { color: "#fff", fontWeight: "bold" },
//   itemsRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
//   itemCard: { backgroundColor: "#fff", borderRadius: 8, padding: 15, marginBottom: 15, width: "45%", marginRight: "2%", elevation: 5 },
//   itemCardLeft: { marginLeft: "2%" },
//   itemImage: { width: "100%", height: 150, borderRadius: 8, marginBottom: 10 },
//   itemName: { fontSize: 18, fontWeight: "bold", marginBottom: 5, color: "#1E2A78" },
//   itemPrice: { fontSize: 16, fontWeight: "600", color: "#333", marginBottom: 3 },
//   itemCategory: { fontSize: 14, color: "#333", marginBottom: 3 },
//   itemLocation: { fontSize: 14, color: "#333", marginBottom: 10 },
//   whatsappButton: { backgroundColor: "#25D366", padding: 12, borderRadius: 8, alignItems: "center", marginVertical: 10 },
//   whatsappText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
//   fab: { position: "absolute", bottom: 20, right: 20, backgroundColor: "#1E2A78", width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: "center", elevation: 5 },
//   fabText: { fontSize: 28, color: "#fff" },
//   noItemsText: { textAlign: "center", fontSize: 16, marginTop: 20, color: "#999" },
//   statusContainer: {
//     padding: 10,
//     borderRadius: 8,
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: 5,
//   },
//   statusText: {
//     color: "#fff",
//     fontWeight: "bold"
//   },

// });


import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Alert,
  Linking,
  RefreshControl,
} from "react-native";
import { useAppSelector } from "../../Redux/Store/hooks";
import { API_URL } from "../../constants";

export default function RentalsScreen({ navigation }: any) {
  const user = useAppSelector((state) => state.auth.user);

  const [showMyRentals, setShowMyRentals] = useState(false); // Toggle for "My Rental Items"
  const [rentalItems, setRentalItems] = useState<any[]>([]); // Store rental items
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false); // Pull-to-refresh state

  // ✅ Fetch All Rental Items
  const fetchRentalItems = async () => {
    try {
        if (!user || !user.username) {
            console.error("❌ User not found in Redux store");
            return;
        }

        console.log(`📨 Fetching rental items for user: ${user.username}`);

        const response = await fetch(`${API_URL}/api/rental/rentals?username=${encodeURIComponent(user.username)}`);
        if (!response.ok) throw new Error("Failed to fetch rental items");

        const data = await response.json();
        console.log("✅ Fetched Rental Items:", data);

        setRentalItems(data); // ✅ Update state with sorted items
    } catch (error) {
        console.error("❌ Error fetching rental items:", error);
    }
};

  // ✅ Refresh on screen focus
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchRentalItems);
    return unsubscribe;
  }, [navigation]);

  // ✅ Pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRentalItems();
    setRefreshing(false);
  };

  // ✅ Filter Rental Items Based on Tab Selection
  // const filteredRentalItems = rentalItems
  //   .filter((item) =>
  //     showMyRentals ? item.owner_id === user.id : item.owner_id !== user.id
  //   )
  //   .filter((item) =>
  //     item.item_name.toLowerCase().includes(searchQuery.toLowerCase())
  //   );
  const filteredRentalItems = rentalItems
  .filter((item) =>
    showMyRentals
      ? item.owner_id === user.id
      : item.is_available === true && item.owner_id !== user.id // ✅ Show only available items NOT uploaded by the owner
  )
  .filter((item) =>
    item.item_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Fetch Item Owner's Phone Number
  const fetchOwnerPhoneNumber = async (itemName: string) => {
    try {
      console.log(`📞 Fetching phone number for item: ${itemName}`);
      const response = await fetch(`${API_URL}/api/item/getItemOwnerPhone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemName }),
      });

      if (!response.ok) throw new Error("Failed to fetch phone number");
      const data = await response.json();

      if (!data || !data.owner_phone) {
        Alert.alert("Phone number not available!");
        return;
      }

      const whatsappUrl = `https://wa.me/${data.owner_phone.replace(/\D/g, "")}`;
      console.log(`📲 Opening WhatsApp: ${whatsappUrl}`);
      Linking.openURL(whatsappUrl);
    } catch (error) {
      console.error("❌ Error fetching phone number:", error);
      Alert.alert("Error fetching phone number");
    }
  };

  return (
    <View style={styles.container}>
      {/* 🔍 Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="🔎 Search rental items..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#666"
      />

      {/* 🏷 Toggle Tabs */}
      <View style={styles.toggleButtonsContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, !showMyRentals && styles.activeButton]}
          onPress={() => setShowMyRentals(false)}
        >
          <Text style={!showMyRentals ? styles.activeButtonText : styles.toggleButtonText}>
            🚀 All Rentals
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleButton, showMyRentals && styles.activeButton]}
          onPress={() => setShowMyRentals(true)}
        >
          <Text style={showMyRentals ? styles.activeButtonText : styles.toggleButtonText}>
            🏠 My Rental Items
          </Text>
        </TouchableOpacity>
      </View>

      {/* 📦 Rental Items List */}
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.itemsRow}>
          {filteredRentalItems.length === 0 ? (
            <Text style={styles.noItemsText}>No items found.</Text>
          ) : (
            filteredRentalItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => navigation.navigate("RENTALITEMDETAILS", { item })}
                style={[styles.itemCard, index % 2 === 0 && styles.itemCardLeft]}
              >
                <Image source={{ uri: item.photo }} style={styles.itemImage} />
                <Text style={styles.itemName}>{item.item_name}</Text>
                <Text style={styles.itemPrice}>💰 $ {item.rental_price}</Text>
                <Text style={styles.itemCategory}>📌 {item.category}</Text>
                <Text style={styles.itemLocation}>📍 {item.location}</Text>

                {/* ✅ Display Active/Inactive Status */}
                <View
                  style={[
                    styles.statusContainer,
                    item.is_available ? styles.activeStatus : styles.inactiveStatus,
                  ]}
                >
                  <Text style={styles.statusText}>
                    {item.is_available ? "🟢 Available" : "🔴 Unavailable"}
                  </Text>
                </View>

                {/* ✅ WhatsApp Chat Button for Non-Owners */}
                {!showMyRentals && (
                  <TouchableOpacity
                    style={styles.whatsappButton}
                    onPress={() => fetchOwnerPhoneNumber(item.item_name)}
                  >
                    <Text style={styles.whatsappText}>💬 Chat on WhatsApp</Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* 📌 Rental Management Section (Only in My Rental Items Tab) */}
      {showMyRentals && (
        <View style={styles.rentalManagementContainer}>
          <Text style={styles.rentalManagementTitle}>Rental Management</Text>
          <View style={styles.managementTiles}>
            <TouchableOpacity
              style={styles.managementTile}
              onPress={() => navigation.navigate("CREATERENTALITEM")}
            >
              <Text style={styles.managementTileText}>➕ Create Rental</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.managementTile}
              onPress={() => navigation.navigate("RENTALOFFERS")}
            >
              <Text style={styles.managementTileText}>📜 Rental Offers</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.managementTile}
              onPress={() => navigation.navigate("RentalStatus")}
            >
              <Text style={styles.managementTileText}>📊 Rental Status</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  searchBar: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#F5F5F5",
    color: "#1E2A78",
  },
  availabilityButton: {
    padding: 10,
    borderRadius: 8,
    alignItems: "center"
  },
  activeStatus: {
    backgroundColor: "green"
  },
  inactiveStatus: {
    backgroundColor: "red"
  },
  availabilityText: {
    color: "#fff",
    fontWeight: "bold"
  },
  rentalManagementContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    alignItems: "center",
  },

  rentalManagementTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E2A78",
    marginBottom: 10,
  },

  managementTiles: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },

  managementTile: {
    flex: 1,
    backgroundColor: "#1E2A78",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },

  managementTileText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  toggleButtonsContainer: { flexDirection: "row", justifyContent: "center", marginBottom: 20 },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#F5F5F5",
  },
  activeButton: { backgroundColor: "#1E2A78", borderColor: "#1E2A78" },
  toggleButtonText: { fontSize: 14, color: "#555" },
  activeButtonText: { color: "#fff", fontWeight: "bold" },
  itemsRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  itemCard: { backgroundColor: "#fff", borderRadius: 8, padding: 15, marginBottom: 15, width: "45%", marginRight: "2%", elevation: 5 },
  itemCardLeft: { marginLeft: "2%" },
  itemImage: { width: "100%", height: 150, borderRadius: 8, marginBottom: 10 },
  itemName: { fontSize: 18, fontWeight: "bold", marginBottom: 5, color: "#1E2A78" },
  itemPrice: { fontSize: 16, fontWeight: "600", color: "#333", marginBottom: 3 },
  itemCategory: { fontSize: 14, color: "#333", marginBottom: 3 },
  itemLocation: { fontSize: 14, color: "#333", marginBottom: 10 },
  whatsappButton: { backgroundColor: "#25D366", padding: 12, borderRadius: 8, alignItems: "center", marginVertical: 10 },
  whatsappText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  fab: { position: "absolute", bottom: 20, right: 20, backgroundColor: "#1E2A78", width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: "center", elevation: 5 },
  fabText: { fontSize: 28, color: "#fff" },
  noItemsText: { textAlign: "center", fontSize: 16, marginTop: 20, color: "#999" },
  statusContainer: {
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },
  statusText: {
    color: "#fff",
    fontWeight: "bold"
  },

});

