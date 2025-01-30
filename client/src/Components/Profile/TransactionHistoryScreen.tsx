import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { useAppSelector } from '../../Redux/Store/hooks';
import { getTransactionHistory } from './relationshipUtils';

interface Transaction {
  _id: string;
  sender_username: string;
  receiver_username: string;
  amount: number;
  status: string;
  createdAt: string;
}

const TransactionHistoryScreen = ({ navigation }: { navigation: any }) => {
  const user = useAppSelector((state: { auth: any }) => state.auth.user);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchTransactionHistory();
  }, []);

  // Fetch transaction history
  const fetchTransactionHistory = async () => {
    setLoading(true);
    const history = await getTransactionHistory(user.username);
    setTransactions(history);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Transaction History</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#1E2A78" />
      ) : transactions.length === 0 ? (
        <Text style={styles.noTransactionsText}>No transactions found</Text>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={styles.transactionText}>
                {item.sender_username === user.username
                  ? `Sent $${item.amount} to ${item.receiver_username}`
                  : `Received $${item.amount} from ${item.sender_username}`}
              </Text>
              <Text style={styles.statusText}>{item.status}</Text>
              <Text style={styles.dateText}>{new Date(item.createdAt).toLocaleString()}</Text>
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

export default TransactionHistoryScreen;

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
  noTransactionsText: {
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
  transactionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusText: {
    fontSize: 14,
    color: '#1E2A78',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
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
