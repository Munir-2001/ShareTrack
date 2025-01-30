import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAppSelector } from '../../Redux/Store/hooks';
import { API_URL } from '../../constants';

interface MoneyRequest {
  _id: string;
  sender_username: string;
  amount: number;
}

const PendingRequestsScreen = ({ navigation }: { navigation: any }) => {
  const user = useAppSelector((state: { auth: any }) => state.auth.user);
  const [pendingRequests, setPendingRequests] = useState<MoneyRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  // Fetch pending money requests from the backend
  const fetchPendingRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/relationship/getMoneyRequests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: user.username }),
      });

      const data = await response.json();

      if (response.ok) {
        setPendingRequests(data);
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch pending requests');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while fetching requests.');
    }
    setLoading(false);
  };

  // Approve money request
  const handleApproveRequest = async (transactionId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/relationship/respondToRequest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transactionId, response: 'approved' }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Request approved successfully!');
        fetchPendingRequests(); // Refresh data
      } else {
        Alert.alert('Error', data.message || 'Failed to approve request');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while approving request.');
    }
  };

  // Decline money request
  const handleDeclineRequest = async (transactionId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/relationship/respondToRequest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transactionId, response: 'declined' }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Request declined successfully!');
        fetchPendingRequests(); // Refresh data
      } else {
        Alert.alert('Error', data.message || 'Failed to decline request');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while declining request.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pending Money Requests</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#1E2A78" />
      ) : pendingRequests.length === 0 ? (
        <Text style={styles.noRequestsText}>No pending money requests</Text>
      ) : (
        <FlatList
          data={pendingRequests}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={styles.requestText}>
                {item.sender_username} requested ${item.amount}
              </Text>
              <View style={styles.buttonContainer}>
                <Pressable
                  style={styles.approveButton}
                  onPress={() => handleApproveRequest(item._id)}>
                  <Text style={styles.buttonText}>Approve</Text>
                </Pressable>
                <Pressable
                  style={styles.declineButton}
                  onPress={() => handleDeclineRequest(item._id)}>
                  <Text style={styles.buttonText}>Decline</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
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
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1E2A78',
  },
  noRequestsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
    marginTop: 20,
  },
  listItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 10,
  },
  requestText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  approveButton: {
    backgroundColor: '#1E2A78',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    marginRight: 5,
  },
  declineButton: {
    backgroundColor: '#D9534F',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    marginLeft: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 20,
    alignSelf: 'center',
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  backButtonText: {
    fontSize: 16,
    color: '#333',
  },
});
