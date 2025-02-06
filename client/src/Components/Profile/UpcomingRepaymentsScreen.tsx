import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  TextInput,
  Alert,
  TouchableOpacity,
} from "react-native";

import {getUserLoans,repayLoan} from "../../Components/Profile/loanUtils"
import { useAppSelector } from "../../Redux/Store/hooks";

// ✅ Define Loan Type with Usernames
interface Loan {
  transaction_id: number;
  amount: number;
  repayment_date: string;
  sender_username: string;
  receiver_username: string;
}

const formatDate = (timestamp: string) => {
  if (!timestamp) return "N/A";
  try {
    let date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      date = new Date(timestamp.replace(" ", "T") + "Z");
    }
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    return "Invalid Date";
  }
};

const UpcomingRepaymentsScreen = ({ navigation }: { navigation: any }) => {
  const userId = useAppSelector((state) => state.auth.user.id);
  const username = useAppSelector((state) => state.auth.user.username);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [filteredLoans, setFilteredLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    setLoading(true);
    try {
        console.log('trying to fetch');
      const loanData= await getUserLoans(userId);
      setLoans(loanData);
      setFilteredLoans(loanData);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch loans.");
    }
    setLoading(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredLoans(loans);
      return;
    }
    const lowerQuery = query.toLowerCase();
    const filtered = loans.filter(
      (loan) =>
        loan.sender_username.toLowerCase().includes(lowerQuery) ||
        loan.receiver_username.toLowerCase().includes(lowerQuery) ||
        loan.amount.toString().includes(lowerQuery)
    );
    setFilteredLoans(filtered);
  };

  const handleRepayLoan = async (transactionId: number) => {
    try {
      await repayLoan(transactionId);
      Alert.alert("Success", "Loan repaid successfully!");
      fetchLoans();
    } catch (error) {
      Alert.alert("Error", "Failed to repay loan.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upcoming Loan Repayments</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by username or amount..."
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#1E2A78" />
      ) : filteredLoans.length === 0 ? (
        <Text style={styles.noLoansText}>No upcoming repayments</Text>
      ) : (
        <FlatList
          data={filteredLoans}
          keyExtractor={(item) => item.transaction_id.toString()}
          renderItem={({ item }) => {
            const isBorrower = item.receiver_username === username;
            return (
              <View
                style={[
                  styles.listItem,
                  isBorrower ? styles.borrowerLoan : styles.lenderLoan,
                ]}
              >
                <Text style={styles.loanText}>
                  {isBorrower
                    ? `You owe $${item.amount} to ${item.sender_username}`
                    : `${item.receiver_username} owes you $${item.amount}`}
                </Text>
                <Text style={styles.dueDateText}>
                  Due: {formatDate(item.repayment_date)}
                </Text>

                {isBorrower && (
                  <TouchableOpacity
                    style={styles.repayButton}
                    onPress={() => handleRepayLoan(item.transaction_id)}
                  >
                    <Text style={styles.repayButtonText}>Repay Loan</Text>
                  </TouchableOpacity>
                )}
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

export default UpcomingRepaymentsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f6f9",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#1E2A78",
  },
  searchInput: {
    height: 50,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#f9f9f9",
    fontSize: 16,
    color: "#333",
    elevation: 3,
    marginBottom: 15,
  },
  noLoansText: {
    textAlign: "center",
    fontSize: 16,
    color: "#777",
    marginTop: 20,
  },
  listItem: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    backgroundColor: "#fff",
  },
  borrowerLoan: {
    borderLeftWidth: 6,
    borderLeftColor: "#E74C3C", // Red for loans you owe
  },
  lenderLoan: {
    borderLeftWidth: 6,
    borderLeftColor: "#27AE60", // Green for loans given
  },
  loanText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  dueDateText: {
    fontSize: 14,
    color: "#666",
  },
  repayButton: {
    backgroundColor: "#1E2A78",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  repayButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  backButton: {
    marginTop: 20,
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#1E2A78",
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});
