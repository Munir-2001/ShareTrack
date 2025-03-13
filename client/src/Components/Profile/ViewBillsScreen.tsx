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
  TouchableOpacity,
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
  contributors?: Contributor[];
}

const ViewBillsScreen = ({ navigation }: { navigation: any }) => {
  const user = useAppSelector((state: { auth: any }) => state.auth.user);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState<'payBills' | 'myBills'>('payBills'); // Default Tab: "Pay Bills"

  useEffect(() => {
    fetchBillsWithContributors();
  }, []);

  const fetchBillsWithContributors = async () => {
    setLoading(true);
    try {
      const billsResponse = await fetch(`${API_URL}/api/bills`);
      const billsData: Bill[] = await billsResponse.json();
      console.log("Fetched Bills:", billsData);

      const billsWithContributors: Bill[] = [];
      for (const bill of billsData) {
        try {
          const detailResponse = await fetch(`${API_URL}/api/bills/${bill.id}`);
          if (detailResponse.ok) {
            const detailData = await detailResponse.json();
            billsWithContributors.push({
              ...bill,
              contributors: detailData.contributors,
            });
          } else {
            billsWithContributors.push(bill);
          }
        } catch (err) {
          console.error(`Error fetching details for bill ${bill.id}:`, err);
          billsWithContributors.push(bill);
        }
      }

      setBills(billsWithContributors);
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
    const contributors = item.contributors || [];
    const contributor = contributors.find(c => c.contributor_id === user.id);
    const pending = contributor ? contributor.share_amount - contributor.paid_amount : 0;

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
        <Text>{item.description}</Text>
        <Text>Total Amount: ${item.total_amount}</Text>

        {selectedTab === 'payBills' && contributor ? (
          <View style={styles.contributorContainer}>
            <Text style={styles.contributorTitle}>Your Contribution</Text>
            <Text>Share Amount: ${contributor.share_amount}</Text>
            <Text>Paid Amount: ${contributor.paid_amount}</Text>
            <Text>Pending Amount: ${pending}</Text>
            <Pressable style={styles.payButton}>
              <Text style={styles.payButtonText}>Pay Bill</Text>
            </Pressable>
          </View>
        ) : selectedTab === 'myBills' && (
          <View style={styles.contributorContainer}>
            <Text style={styles.contributorTitle}>Bill Creator</Text>
            <Text>This bill was created by you.</Text>
          </View>
        )}

        <Text style={styles.timestampText}>Created on: {formatDate(item.created_at)}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'payBills' && styles.activeTab]}
          onPress={() => setSelectedTab('payBills')}
        >
          <Text style={[styles.tabText, selectedTab === 'payBills' && styles.activeTabText]}>
            Pay Bills
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'myBills' && styles.activeTab]}
          onPress={() => setSelectedTab('myBills')}
        >
          <Text style={[styles.tabText, selectedTab === 'myBills' && styles.activeTabText]}>
            My Bills
          </Text>
        </TouchableOpacity>
      </View>

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
          data={bills.filter(bill =>
            selectedTab === 'payBills'
              ? bill.contributors?.some(c => c.contributor_id === user.id)
              : bill.creator_id === user.id
          )}
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
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  tabContainer: { flexDirection: 'row', marginBottom: 10 },
  tabButton: { flex: 1, padding: 10, backgroundColor: '#DDD', alignItems: 'center' },
  activeTab: { backgroundColor: '#1E2A78' },
  tabText: { fontSize: 16, color: '#555' },
  activeTabText: { color: '#fff', fontWeight: 'bold' },
  searchInput: { height: 50, borderWidth: 1, borderColor: '#DDD', borderRadius: 10, paddingHorizontal: 12, backgroundColor: '#f9f9f9', fontSize: 16, color: '#333', marginBottom: 15 },
  billContainer: { padding: 15, borderRadius: 10, backgroundColor: '#f9f9f9', marginBottom: 10, borderWidth: 1, borderColor: '#ddd' },
  billName: { fontSize: 18, fontWeight: 'bold', marginBottom: 5, color: '#1E2A78' },
  payButton: { marginTop: 10, backgroundColor: "#E63946", paddingVertical: 10, borderRadius: 5, alignItems: "center" },
  payButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  backButton: { marginTop: 20, alignSelf: 'center', paddingVertical: 12, paddingHorizontal: 20, backgroundColor: '#1E2A78', borderRadius: 8 },
  backButtonText: { fontSize: 16, color: '#fff', fontWeight: 'bold' },
});
