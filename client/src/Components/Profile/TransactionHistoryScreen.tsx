// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   ActivityIndicator,
//   Pressable,
// } from 'react-native';
// import { useAppSelector } from '../../Redux/Store/hooks';
// import { getTransactionHistory } from './relationshipUtils';

// interface Transaction {
//   _id: string;
//   sender_username: string;
//   receiver_username: string;
//   amount: number;
//   status: string;
//   createdAt: string;
// }

// const TransactionHistoryScreen = ({ navigation }: { navigation: any }) => {
//   const user = useAppSelector((state: { auth: any }) => state.auth.user);
//   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);

//   useEffect(() => {
//     fetchTransactionHistory();
//   }, []);

//   // Fetch transaction history
//   const fetchTransactionHistory = async () => {
//     setLoading(true);
//     const history = await getTransactionHistory(user.username);
//     setTransactions(history);
//     setLoading(false);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Transaction History</Text>

//       {loading ? (
//         <ActivityIndicator size="large" color="#1E2A78" />
//       ) : transactions.length === 0 ? (
//         <Text style={styles.noTransactionsText}>No transactions found</Text>
//       ) : (
//         <FlatList
//           data={transactions}
//           keyExtractor={(item) => item._id}
//           renderItem={({ item }) => (
//             <View style={styles.listItem}>
//               <Text style={styles.transactionText}>
//                 {item.sender_username === user.username
//                   ? `Sent $${item.amount} to ${item.receiver_username}`
//                   : `Received $${item.amount} from ${item.sender_username}`}
//               </Text>
//               <Text style={styles.statusText}>{item.status}</Text>
//               <Text style={styles.dateText}>{new Date(item.createdAt).toLocaleString()}</Text>
//             </View>
//           )}
//         />
//       )}

//       {/* Back Button */}
//       <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
//         <Text style={styles.backButtonText}>Back</Text>
//       </Pressable>
//     </View>
//   );
// };

// export default TransactionHistoryScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   header: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//     color: '#1E2A78',
//   },
//   noTransactionsText: {
//     textAlign: 'center',
//     fontSize: 16,
//     color: '#777',
//     marginTop: 20,
//   },
//   listItem: {
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//     backgroundColor: '#f9f9f9',
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   transactionText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   statusText: {
//     fontSize: 14,
//     color: '#1E2A78',
//   },
//   dateText: {
//     fontSize: 12,
//     color: '#666',
//   },
//   backButton: {
//     marginTop: 20,
//     alignSelf: 'center',
//     padding: 10,
//     backgroundColor: '#ddd',
//     borderRadius: 5,
//   },
//   backButtonText: {
//     fontSize: 16,
//     color: '#333',
//   },
// });

// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   ActivityIndicator,
//   Pressable,
// } from 'react-native';
// import { useAppSelector } from '../../Redux/Store/hooks';
// import { getTransactionHistory } from './relationshipUtils';

// interface Transaction {
//   _id: string;
//   sender_username: string;
//   receiver_username: string;
//   amount: number;
//   status: string;
//   createdAt: string;
// }
// const formatDate = (dateString: string) => {
//   try {
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) return 'Invalid Date';
    
//     return date.toLocaleDateString('en-US', {
//       weekday: 'short',
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//       hour12: true,  // Ensures AM/PM format
//       timeZone: 'UTC', // Ensures consistency
//     });
//   } catch (error) {
//     console.error('Date formatting error:', error);
//     return 'Invalid Date';
//   }
// };


// const TransactionHistoryScreen = ({ navigation }: { navigation: any }) => {
//   const user = useAppSelector((state: { auth: any }) => state.auth.user);
//   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);

//   useEffect(() => {
//     fetchTransactionHistory();
//   }, []);

//   // Fetch transaction history
//   const fetchTransactionHistory = async () => {
//     setLoading(true);
//     try {
//       const history = await getTransactionHistory(user.username);
//       setTransactions(history);
//     } catch (error) {
//       console.error('Error fetching transaction history:', error);
//     }
//     setLoading(false);
//   };

//   // Function to format date into human-readable format
//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) return 'Invalid Date';
//     return date.toLocaleDateString('en-US', {
//       weekday: 'short',
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Transaction History</Text>

//       {loading ? (
//         <ActivityIndicator size="large" color="#1E2A78" />
//       ) : transactions.length === 0 ? (
//         <Text style={styles.noTransactionsText}>No transactions found</Text>
//       ) : (
//         <FlatList
//           data={transactions}
//           keyExtractor={(item) => item._id}
//           renderItem={({ item }) => {
//             const isSent = item.sender_username === user.username;
//             return (
//               <View
//                 style={[
//                   styles.listItem,
//                   isSent ? styles.sentTransaction : styles.receivedTransaction,
//                 ]}
//               >
//                 <Text style={styles.transactionText}>
//                   {isSent
//                     ? `Sent $${item.amount} to ${item.receiver_username}`
//                     : `Received $${item.amount} from ${item.sender_username}`}
//                 </Text>
//                 <Text style={styles.statusText}>{item.status}</Text>
//                 <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
//                 </View>
//             );
//           }}
//         />
//       )}

//       {/* Back Button */}
//       <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
//         <Text style={styles.backButtonText}>Back</Text>
//       </Pressable>
//     </View>
//   );
// };

// export default TransactionHistoryScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f4f6f9',
//   },
//   header: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//     color: '#1E2A78',
//   },
//   noTransactionsText: {
//     textAlign: 'center',
//     fontSize: 16,
//     color: '#777',
//     marginTop: 20,
//   },
//   listItem: {
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 4,
//     backgroundColor: '#fff',
//   },
//   sentTransaction: {
//     borderLeftWidth: 6,
//     borderLeftColor: '#E74C3C', // Red for sent transactions
//   },
//   receivedTransaction: {
//     borderLeftWidth: 6,
//     borderLeftColor: '#27AE60', // Green for received transactions
//   },
//   transactionText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 5,
//   },
//   statusText: {
//     fontSize: 14,
//     color: '#1E2A78',
//     fontWeight: '500',
//   },
//   dateText: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 4,
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
  ActivityIndicator,
  Pressable,
  TextInput,
} from 'react-native';
import { useAppSelector } from '../../Redux/Store/hooks';
import { getTransactionHistory } from './relationshipUtils';

interface Transaction {
  _id: string;
  sender_username: string;
  receiver_username: string;
  amount: number;
  status: string;
  timestamp: string;
}

// Function to format timestamp into human-readable format
const formatDate = (timestamp: string) => {
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return 'Invalid Date';

    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'N/A';
  }
};

const TransactionHistoryScreen = ({ navigation }: { navigation: any }) => {
  const user = useAppSelector((state: { auth: any }) => state.auth.user);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    fetchTransactionHistory();
  }, []);

  // Fetch transaction history
  const fetchTransactionHistory = async () => {
    setLoading(true);
    try {
      const history = await getTransactionHistory(user.username);
      setTransactions(history);
      setFilteredTransactions(history);
    } catch (error) {
      console.error('Error fetching transaction history:', error);
    }
    setLoading(false);
  };

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
      />

      {loading ? (
        <ActivityIndicator size="large" color="#1E2A78" />
      ) : filteredTransactions.length === 0 ? (
        <Text style={styles.noTransactionsText}>No transactions found</Text>
      ) : (
        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item._id}
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
                      ? `Pending to send $${item.amount} to ${item.receiver_username}`
                      : `Pending to receive $${item.amount} from ${item.sender_username}`
                    : isSent
                    ? `Sent $${item.amount} to ${item.receiver_username}`
                    : `Received $${item.amount} from ${item.sender_username}`}
                </Text>
                <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
                <Text style={styles.dateText}>{formatDate(item.timestamp)}</Text>
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
