// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   Pressable,
//   Alert,
//   ActivityIndicator,
//   TextInput,
// } from 'react-native';
// import { useAppSelector } from '../../Redux/Store/hooks';
// import { API_URL } from '../../constants';

// interface MoneyRequest {
//   _id: string;
//   sender_username: string;
//   receiver_username: string;
//   amount: number;
//   status: string;
// }

// const PendingRequestsScreen = ({ navigation }: { navigation: any }) => {
//   const user = useAppSelector((state: { auth: any }) => state.auth.user);
//   const [incomingRequests, setIncomingRequests] = useState<MoneyRequest[]>([]);
//   const [outgoingRequests, setOutgoingRequests] = useState<MoneyRequest[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [searchQuery, setSearchQuery] = useState<string>('');

//   useEffect(() => {
//     fetchPendingRequests();
//   }, []);

//   // Fetch pending money requests from the backend
//   const fetchPendingRequests = async () => {
//     setLoading(true);
//     try {
//       const incomingResponse = await fetch(`${API_URL}/api/relationship/getMoneyRequests`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username: user.username }),
//       });

//       const outgoingResponse = await fetch(`${API_URL}/api/relationship/getSentMoneyRequests`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username: user.username }),
//       });

//       const incomingData = await incomingResponse.json();
//       const outgoingData = await outgoingResponse.json();

//       console.log(incomingData+"is incoming data");
//       console.log(outgoingData+"is outgoing data")


//       if (incomingResponse.ok) setIncomingRequests(incomingData);
//       if (outgoingResponse.ok) setOutgoingRequests(outgoingData);
//     } catch (error) {
//       Alert.alert('Error', 'Something went wrong while fetching requests.');
//     }
//     setLoading(false);
//   };

//   // Approve money request
//   const handleApproveRequest = async (transactionId: string) => {
//     try {
//       const response = await fetch(`${API_URL}/api/relationship/respondToRequest`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ transactionId, response: 'approved' }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         Alert.alert('Success', 'Request approved successfully!');
//         fetchPendingRequests();
//       } else {
//         Alert.alert('Error', data.message || 'Failed to approve request');
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Something went wrong while approving request.');
//     }
//   };

//   // Decline money request
//   const handleDeclineRequest = async (transactionId: string) => {
//     try {
//       const response = await fetch(`${API_URL}/api/relationship/respondToRequest`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ transactionId, response: 'declined' }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         Alert.alert('Success', 'Request declined successfully!');
//         fetchPendingRequests();
//       } else {
//         Alert.alert('Error', data.message || 'Failed to decline request');
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Something went wrong while declining request.');
//     }
//   };

//   // Filter results based on search query
//   const filteredIncoming = incomingRequests.filter(
//     (item) =>
//       item.sender_username.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       item.amount.toString().includes(searchQuery)
//   );

//   const filteredOutgoing = outgoingRequests.filter(
//     (item) =>
//       item.receiver_username.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       item.amount.toString().includes(searchQuery)
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Pending Money Requests</Text>

//       {/* Search Bar */}
//       <TextInput
//         style={styles.searchInput}
//         placeholder="Search by username or amount..."
//         value={searchQuery}
//         onChangeText={setSearchQuery}
//       />

//       {loading ? (
//         <ActivityIndicator size="large" color="#1E2A78" />
//       ) : (
//         <>
//           {/* Incoming Requests */}
//           <Text style={styles.sectionHeader}>Requests to You</Text>
//           {filteredIncoming.length === 0 ? (
//             <Text style={styles.noRequestsText}>No incoming requests</Text>
//           ) : (
//             <FlatList
//               data={filteredIncoming}
//               keyExtractor={(item) => item._id}
//               renderItem={({ item }) => (
//                 <View style={styles.listItem}>
//                   <Text style={styles.requestText}>
//                     {item.sender_username} requested ${item.amount}
//                   </Text>
//                   <View style={styles.buttonContainer}>
//                     <Pressable
//                       style={styles.approveButton}
//                       onPress={() => handleApproveRequest(item._id)}>
//                       <Text style={styles.buttonText}>Approve</Text>
//                     </Pressable>
//                     <Pressable
//                       style={styles.declineButton}
//                       onPress={() => handleDeclineRequest(item._id)}>
//                       <Text style={styles.buttonText}>Decline</Text>
//                     </Pressable>
//                   </View>
//                 </View>
//               )}
//             />
//           )}

//           {/* Outgoing Requests */}
//           <Text style={styles.sectionHeader}>Requests You Sent</Text>
//           {filteredOutgoing.length === 0 ? (
//             <Text style={styles.noRequestsText}>No outgoing requests</Text>
//           ) : (
//             <FlatList
//               data={filteredOutgoing}
//               keyExtractor={(item) => item._id}
//               renderItem={({ item }) => (
//                 <View style={styles.listItemOutgoing}>
//                   <Text style={styles.requestText}>
//                     You requested ${item.amount} from {item.receiver_username}
//                   </Text>
//                 </View>
//               )}
//             />
//           )}
//         </>
//       )}

//       {/* Back Button */}
//       <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
//         <Text style={styles.backButtonText}>Back</Text>
//       </Pressable>
//     </View>
//   );
// };

// export default PendingRequestsScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   header: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 10,
//     color: '#1E2A78',
//   },
//   searchInput: {
//     height: 50,
//     borderWidth: 1,
//     borderColor: '#DDD',
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     backgroundColor: '#f9f9f9',
//     fontSize: 16,
//     color: '#333',
//     elevation: 3,
//     marginBottom: 15,
//   },
//   sectionHeader: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1E2A78',
//     marginTop: 15,
//     marginBottom: 5,
//   },
//   noRequestsText: {
//     textAlign: 'center',
//     fontSize: 16,
//     color: '#777',
//     marginBottom: 10,
//   },
//   listItem: {
//     padding: 15,
//     borderRadius: 10,
//     backgroundColor: '#f9f9f9',
//     marginBottom: 10,
//   },
//   listItemOutgoing: {
//     padding: 15,
//     borderRadius: 10,
//     backgroundColor: '#FFF9C4', // Yellow background for sent requests
//     marginBottom: 10,
//   },
//   requestText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   approveButton: {
//     backgroundColor: '#1E2A78',
//     padding: 10,
//     borderRadius: 5,
//     flex: 1,
//     marginRight: 5,
//     alignItems: 'center',
//   },
//   declineButton: {
//     backgroundColor: '#D9534F',
//     padding: 10,
//     borderRadius: 5,
//     flex: 1,
//     marginLeft: 5,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   backButton: {
//     marginTop: 20,
//     alignSelf: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     backgroundColor: '#1E2A78',
//     borderRadius: 8,
//   },
//   backButtonText: {
//     fontSize: 16,
//     color: '#fff',
//     fontWeight: 'bold',
//   },
// });

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useAppSelector } from '../../Redux/Store/hooks';
import { API_URL } from '../../constants';

interface MoneyRequest {
  _id: string;
  sender_username: string;
  receiver_username: string;
  amount: number;
  status: string;
  timestamp: string; // Added timestamp
}

const PendingRequestsScreen = ({ navigation }: { navigation: any }) => {
  const user = useAppSelector((state: { auth: any }) => state.auth.user);
  const [incomingRequests, setIncomingRequests] = useState<MoneyRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<MoneyRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  // Fetch pending money requests from the backend
  const fetchPendingRequests = async () => {
    setLoading(true);
    try {
      const incomingResponse = await fetch(`${API_URL}/api/relationship/getMoneyRequests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user.username }),
      });

      const outgoingResponse = await fetch(`${API_URL}/api/relationship/getSentMoneyRequests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user.username }),
      });

      const incomingData = await incomingResponse.json();
      const outgoingData = await outgoingResponse.json();

      if (incomingResponse.ok) setIncomingRequests(incomingData);
      if (outgoingResponse.ok) setOutgoingRequests(outgoingData);
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while fetching requests.');
    }
    setLoading(false);
  };

  // Date Formatting Function
  const formatDate = (timestamp: string) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pending Money Requests</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by username or amount..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#1E2A78" />
      ) : (
        <>
          {/* Incoming Requests */}
          <Text style={styles.sectionHeader}>Requests to You</Text>
          {incomingRequests.length === 0 ? (
            <Text style={styles.noRequestsText}>No incoming requests</Text>
          ) : (
            <FlatList
              data={incomingRequests}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={styles.listItem}>
                  <Text style={styles.requestText}>
                    {item.sender_username} requested ${item.amount}
                  </Text>
                  <Text style={styles.timestampText}>Requested on: {formatDate(item.timestamp)}</Text>
                  <View style={styles.buttonContainer}>
                    <Pressable
                      style={styles.approveButton}
                      onPress={() => Alert.alert('Approve', `Approved request of $${item.amount}`)}
                    >
                      <Text style={styles.buttonText}>Approve</Text>
                    </Pressable>
                    <Pressable
                      style={styles.declineButton}
                      onPress={() => Alert.alert('Decline', `Declined request of $${item.amount}`)}
                    >
                      <Text style={styles.buttonText}>Decline</Text>
                    </Pressable>
                  </View>
                </View>
              )}
            />
          )}

          {/* Outgoing Requests */}
          <Text style={styles.sectionHeader}>Requests You Sent</Text>
          {outgoingRequests.length === 0 ? (
            <Text style={styles.noRequestsText}>No outgoing requests</Text>
          ) : (
            <FlatList
              data={outgoingRequests}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={styles.listItemOutgoing}>
                  <Text style={styles.requestText}>
                    You requested ${item.amount} from {item.receiver_username}
                  </Text>
                  <Text style={styles.timestampText}>Sent on: {formatDate(item.timestamp)}</Text>
                </View>
              )}
            />
          )}
        </>
      )}

      {/* Back Button */}
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </Pressable>
    </View>
  );
};

export default PendingRequestsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#1E2A78',
  },
  searchInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
    color: '#333',
    elevation: 3,
    marginBottom: 15,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E2A78',
    marginTop: 15,
    marginBottom: 5,
  },
  noRequestsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
    marginBottom: 10,
  },
  listItem: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
  },
  listItemOutgoing: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FFF9C4', // Yellow background for sent requests
    marginBottom: 10,
  },
  requestText: {
    fontSize: 16,
    color: '#333',
  },
  timestampText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  approveButton: {
    backgroundColor: '#1E2A78',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  declineButton: {
    backgroundColor: '#D9534F',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 20,
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#1E2A78',
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});
