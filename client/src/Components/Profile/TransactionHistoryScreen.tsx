import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  TextInput,
} from 'react-native';
import { useAppSelector } from '../../Redux/Store/hooks';

interface Transaction {
  _id: string;
  sender_username: string;
  receiver_username: string;
  amount: number;
  status: string;
  created_at: string;
}
import { getTransactionHistory } from './relationshipUtils';

// Function to format timestamp into human-readable format
const formatDate = (timestamp: string) => {
  if (!timestamp) return "N/A";

  try {
    // Ensure the timestamp is in a valid ISO 8601 format
    let date = new Date(timestamp);

    // If date is still invalid, attempt manual conversion
    if (isNaN(date.getTime())) {
      console.warn("⚠️ Invalid date detected, attempting manual fix:", timestamp);
      date = new Date(timestamp.replace(" ", "T") + "Z"); // Convert MySQL format to ISO
    }

    if (isNaN(date.getTime())) {
      console.log("❌ formatDate: Unable to parse date:", timestamp);
      return "Invalid Date";
    }

    return date.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  } catch (error) {
    console.log("❌ formatDate: Error parsing date:", error);
    return "Invalid Date";
  }
};



const TransactionHistoryScreen = ({ navigation }: { navigation: any }) => {
  const user = useAppSelector((state: { auth: any }) => state.auth.user);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      setLoading(true);
      try {
         const history = await getTransactionHistory(user.username);
        setTransactions(history);
        setFilteredTransactions(history);
      } catch (error) {
        console.log('Error fetching transaction history:', error);
      }
      setLoading(false);
    };

    fetchTransactionHistory();
  }, [user.username]);

  // Function to filter transactions based on search input
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredTransactions(transactions);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = transactions.filter(
      (transaction) =>
        transaction.sender_username.toLowerCase().includes(lowerQuery) ||
        transaction.receiver_username.toLowerCase().includes(lowerQuery) ||
        transaction.amount.toString().includes(lowerQuery)
    );

    setFilteredTransactions(filtered);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Transaction History</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by username or amount..."
        value={searchQuery}
        onChangeText={handleSearch}
        placeholderTextColor="#666"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#1E2A78" />
      ) : filteredTransactions.length === 0 ? (
        <Text style={styles.noTransactionsText}>No transactions found</Text>
      ) : (
        <FlatList
          data={filteredTransactions}
          // keyExtractor={(item) => String(item._id)}
          keyExtractor={(item, index) => item._id ? String(item._id) : `transaction-${index}`}
          renderItem={({ item }) => {
            const isSent = item.sender_username === user.username;
            const isPending = item.status === 'pending';

            return (
              <View
                style={[
                  styles.listItem,
                  isPending
                    ? styles.pendingTransaction
                    : isSent
                    ? styles.sentTransaction
                    : styles.receivedTransaction,
                ]}
              >
                <Text style={styles.transactionText}>
                  {isPending
                    ? isSent
                      ? `Pending to receive $${item.amount} from ${item.receiver_username}`
                      : `Pending to send $${item.amount} to ${item.sender_username}`
                    : isSent
                    ? `Sent $${item.amount} to ${item.receiver_username}`
                    : `Received request for $${item.amount} from ${item.sender_username}`}
                </Text>
                <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
                <Text style={styles.dateText}>{formatDate(item.created_at)}</Text>
              </View>
            );
          }}
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
    backgroundColor: '#f4f6f9',
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
  noTransactionsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
    marginTop: 20,
  },
  listItem: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    backgroundColor: '#fff',
  },
  sentTransaction: {
    borderLeftWidth: 6,
    borderLeftColor: '#E74C3C', // Red for sent transactions
  },
  receivedTransaction: {
    borderLeftWidth: 6,
    borderLeftColor: '#27AE60', // Green for received transactions
  },
  pendingTransaction: {
    borderLeftWidth: 6,
    borderLeftColor: '#A0A0A0', // Grey for pending transactions
  },
  transactionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  statusText: {
    fontSize: 14,
    color: '#1E2A78',
    fontWeight: '500',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
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
