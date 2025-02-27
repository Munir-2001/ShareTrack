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
import { respondToMoneyRequest } from "../../Components/Profile/relationshipUtils"; // Import API call

interface MoneyRequest {
  id: string;
  sender_username: string;
  receiver_username: string;
  amount: number;
  status: string;
  created_at: string; // Added timestamp
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

  const handleApproveRequest = async (transactionId: string) => {
    try {
      console.log("Approving request for transactionId:", transactionId);
      const response = await respondToMoneyRequest(transactionId, "approved");
      if(response!=null)
      Alert.alert("Success", "Request approved successfully!");

      fetchPendingRequests(); // Refresh the request list
    } catch (error:any) {
      Alert.alert("Error", error.message || "Failed to approve request");
    }
  };
  
  const handleDeclineRequest = async (transactionId: string) => {
    try {
      console.log("Declining request for transactionId:", transactionId);
      const response = await respondToMoneyRequest(transactionId, "declined");
      if(response!=null)
      Alert.alert("Success", "Request declined successfully!");
      fetchPendingRequests(); // Refresh the request list
    } catch (error:any) {
      Alert.alert("Error", error.message || "Failed to decline request");
    }
  };

  // Fetch pending money requests from the backend
  // const fetchPendingRequests = async () => {
  //   setLoading(true);
  //   try {
  //     const incomingResponse = await fetch(`${API_URL}/api/relationship/getMoneyRequests`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ username: user.username }),
  //     });

  //     const outgoingResponse = await fetch(`${API_URL}/api/relationship/getSentMoneyRequests`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ username: user.username }),
  //     });

  //     const incomingData = await incomingResponse.json();
  //     const outgoingData = await outgoingResponse.json();

  //     if (incomingResponse.ok) setIncomingRequests(incomingData);
  //     if (outgoingResponse.ok) setOutgoingRequests(outgoingData);
  //   } catch (error) {
  //     Alert.alert('Error', 'Something went wrong while fetching requests.');
  //   }
  //   setLoading(false);
  // };

  const fetchPendingRequests = async () => {
    setLoading(true);
    try {
      const incomingResponse = await fetch(`${API_URL}/api/relationship/getMoneyRequests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user.username }), // ✅ Fix: Ensure username is sent
      });
  
      const outgoingResponse = await fetch(`${API_URL}/api/relationship/getSentMoneyRequests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user.username }), // ✅ Fix: Ensure username is sent
      });
  
      const incomingData = await incomingResponse.json();
      const outgoingData = await outgoingResponse.json();
  
      console.log("Incoming Requests:", incomingData); // Debugging logs
      console.log("Outgoing Requests:", outgoingData); // Debugging logs
  
      if (incomingResponse.ok) setIncomingRequests(incomingData);
      if (outgoingResponse.ok) setOutgoingRequests(outgoingData);
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while fetching requests.');
    }
    setLoading(false);
  };
  

  // Date Formatting Function
  // const formatDate = (timestamp: string) => {
  //   if (!timestamp) return 'N/A';
  //   const date = new Date(timestamp);
  //   if (isNaN(date.getTime())) return 'Invalid Date';
  //   return date.toLocaleDateString('en-US', {
  //     weekday: 'short',
  //     year: 'numeric',
  //     month: 'short',
  //     day: 'numeric',
  //     hour: '2-digit',
  //     minute: '2-digit',
  //     hour12: true,
  //   });
  // };
  // const formatDate = (timestamp: string) => {
  //   if (!timestamp) return 'N/A';
  
  //   // Ensure the timestamp is in a valid format
  //   const formattedTimestamp = timestamp.replace(" ", "T") + "Z"; // Convert to ISO format
  //   const date = new Date(formattedTimestamp);
  
  //   if (isNaN(date.getTime())) return 'Invalid Date';
  
  //   return date.toLocaleDateString('en-US', {
  //     weekday: 'short',
  //     year: 'numeric',
  //     month: 'short',
  //     day: 'numeric',
  //     hour: '2-digit',
  //     minute: '2-digit',
  //     hour12: true,
  //   });
  // };
  const formatDate = (timestamp: string) => {
    if (!timestamp) return "N/A";

    try {
        // Ensure timestamp is a valid ISO 8601 string
        const date = new Date(timestamp);

        if (isNaN(date.getTime())) {
            console.log("❌ formatDate: Invalid date format:", timestamp);
            return "Invalid Date";
        }

        return date.toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    } catch (error) {
        console.log(" formatDate: Error parsing date:", error);
        return "Invalid Date";
    }
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
              keyExtractor={(item, index) => item.id?.toString() || index.toString()} // ✅ Ensures a unique key
              renderItem={({ item }) => (
                <View style={styles.listItem}>
                  <Text style={styles.requestText}>
                    {item.sender_username} requested ${item.amount}
                  </Text>
                  <Text style={styles.timestampText}>Requested on: {formatDate(item.created_at)}</Text>
                  <View style={styles.buttonContainer}>
                    <Pressable
                      style={styles.approveButton}
                      // onPress={() => Alert.alert('Approve', `Approved request of $${item.amount}`)}
                      onPress={() => 
                        handleApproveRequest(item.id)
                      }
            

                    >
                      <Text style={styles.buttonText}>Approve</Text>
                    </Pressable>
                    <Pressable
                      style={styles.declineButton}
                      // onPress={() => Alert.alert('Decline', `Declined request of $${item.amount}`)}
                      onPress={() => handleDeclineRequest(item.id)}

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
              keyExtractor={(item, index) => item.id?.toString() || index.toString()} // ✅ Ensures a unique key
              renderItem={({ item }) => (
                <View style={styles.listItemOutgoing}>
                  <Text style={styles.requestText}>
                    You requested ${item.amount} from {item.receiver_username}
                  </Text>
                  <Text style={styles.timestampText}>Sent on: {formatDate(item.created_at)}</Text>
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
