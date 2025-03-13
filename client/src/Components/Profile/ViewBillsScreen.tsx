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

interface Contributor {
  contributor_id: number;
  share_amount: number;
  paid_amount: number;
  pending_amount?: number;
}

interface Bill {
  id: number;
  creator_id: number;
  name: string;
  description: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
  // This field is optional because listBills doesn't return contributors
  contributors?: Contributor[];
}

const ViewBillsScreen = ({ navigation }: { navigation: any }) => {
  const user = useAppSelector((state: { auth: any }) => state.auth.user);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    fetchBillsWithContributors();
  }, []);

  // This function first fetches all bills, then for each bill, it calls getBill
  // to get the contributors, and finally filters the bills for which the user is a contributor.
  const fetchBillsWithContributors = async () => {
    setLoading(true);
    try {
      // 1. Fetch all bills (without contributor details)
      const billsResponse = await fetch(`${API_URL}/api/bills`);
      const billsData: Bill[] = await billsResponse.json();
      console.log("Fetched Bills:", billsData);

      // 2. For each bill, fetch its details (contributors) using the getBill endpoint.
      const billsWithContributors: Bill[] = [];
      for (const bill of billsData) {
        try {
          const detailResponse = await fetch(`${API_URL}/api/bills/${bill.id}`);
          if (detailResponse.ok) {
            const detailData = await detailResponse.json(); // { bill, contributors }
            // Attach contributors to the bill
            billsWithContributors.push({
              ...bill,
              contributors: detailData.contributors,
            });
          } else {
            // If fetching details fails, you can still add the bill without contributors
            billsWithContributors.push(bill);
          }
        } catch (err) {
          console.error(`Error fetching details for bill ${bill.id}:`, err);
          billsWithContributors.push(bill);
        }
      }
      console.log("Bills with contributors:", billsWithContributors);

      // 3. Filter bills where the logged-in user is a contributor.
      const filteredBills = billsWithContributors.filter(bill => {
        const contributors = bill.contributors || [];
        return contributors.some(c => c.contributor_id === user.id);
      });
      console.log("Filtered Bills:", filteredBills);
      setBills(filteredBills);
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while fetching bills.');
      console.error("Error fetching bills", error);
    }
    setLoading(false);
  };

  const formatDate = (timestamp: string) => {
    if (!timestamp) return "N/A";
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        console.log("Invalid date format:", timestamp);
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
      console.log("Error parsing date:", error);
      return "Invalid Date";
    }
  };

  const renderBill = ({ item }: { item: Bill }) => {
    // Use a fallback for contributors
    const contributors = item.contributors || [];
    // Find the current user's contribution for this bill.
    const contributor = contributors.find(c => c.contributor_id === user.id);
    const pending = contributor ? contributor.share_amount - contributor.paid_amount : 0;

    // Filter by search query if provided.
    if (
      searchQuery &&
      !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return null;
    }

    return (
      <View style={styles.billContainer}>
        <Text style={styles.billName}>{item.name}</Text>
        <Text style={styles.billDescription}>{item.description}</Text>
        <Text style={styles.billAmount}>Total Amount: ${item.total_amount}</Text>
        {contributor ? (
          <View style={styles.contributorContainer}>
            <Text style={styles.contributorTitle}>Your Contribution</Text>
            <Text>Share Amount: ${contributor.share_amount}</Text>
            <Text>Paid Amount: ${contributor.paid_amount}</Text>
            <Text>Pending Amount: ${pending}</Text>
            <Pressable style={styles.payButton} >
                <Text style={styles.payButtonText}>Pay Bill</Text>
              </Pressable>
          </View>
        ) : (
          <Text style={styles.noContributionText}>You are not a contributor for this bill.</Text>
        )}
        <Text style={styles.timestampText}>Created on: {formatDate(item.created_at)}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Bills</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by bill name or description..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#666"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#1E2A78" />
      ) : (
        <FlatList
          data={bills}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderBill}
          ListEmptyComponent={<Text style={styles.noBillsText}>No bills found.</Text>}
        />
      )}

      {/* Back Button */}
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </Pressable>
    </View>
  );
};

export default ViewBillsScreen;

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
  billContainer: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  billName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1E2A78',
  },
  billDescription: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  billAmount: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  contributorContainer: {
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 5,
    marginBottom: 10,
  },
  contributorTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#1E2A78',
  },
  noContributionText: {
    fontSize: 14,
    color: '#777',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  timestampText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  noBillsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
    marginTop: 20,
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
  payButton: {
    marginTop: 10,
    backgroundColor: "#E63946",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  
  payButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
