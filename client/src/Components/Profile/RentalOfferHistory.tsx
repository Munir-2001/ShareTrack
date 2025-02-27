import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { API_URL } from "../../constants.js";
import { useAppSelector } from "../../Redux/Store/hooks";

// ✅ Define TypeScript Interface
interface RentalOffer {
  id: number;
  item_id: number;
  item_name: string;
  proposed_price: number;
  status: string;
  renter_name: string;
  created_at: string;
}

const RentalOffersHistory = ({ navigation }: { navigation: any })  => {
  const user = useAppSelector((state: { auth: any }) => state.auth.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [offers, setOffers] = useState<{ incoming: RentalOffer[]; outgoing: RentalOffer[] }>({
    incoming: [],
    outgoing: [],
  });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"incoming" | "outgoing">("incoming");

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      // const response = await fetch(`${API_URL}/offers/history/user/${user.id}`);
      const response = await fetch(`${API_URL}/api/rental/history/user/${user.id}`);

      const data = await response.json();

      if (response.ok) {
        setOffers({
          incoming: (data.incoming || []).filter(
            (offer: RentalOffer) => ["accepted", "rejected"].includes(offer.status)
          ),
          outgoing: (data.outgoing || []).filter(
            (offer: RentalOffer) => ["accepted", "rejected"].includes(offer.status)
          ),
        });
      }
    } catch (error) {
      console.log("Error fetching offers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOffers = (tab === "incoming" ? offers.incoming : offers.outgoing).filter(
    (offer) =>
      offer.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.renter_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by item or renter name..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Tab Buttons */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, tab === "incoming" && styles.activeTab]}
          onPress={() => setTab("incoming")}
        >
          <Text style={[styles.tabText, tab === "incoming" && styles.activeTabText]}>Incoming</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, tab === "outgoing" && styles.activeTab]}
          onPress={() => setTab("outgoing")}
        >
          <Text style={[styles.tabText, tab === "outgoing" && styles.activeTabText]}>Outgoing</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1E2A78" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filteredOffers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.offerCard}>
              <Text style={styles.offerTitle}>{item.item_name}</Text>
              <Text>Renter: {item.renter_name}</Text>
              <Text>Proposed Price: ${item.proposed_price}</Text>
              <Text>Status: {item.status}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default RentalOffersHistory;

const styles = StyleSheet.create({
  searchInput: {
    height: 50,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#f9f9f9",
    fontSize: 16,
    color: "#333",
    margin: 15,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  tabButton: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#DDD",
  },
  activeTab: {
    borderBottomColor: "#1E2A78",
  },
  tabText: {
    fontSize: 16,
    color: "#777",
  },
  activeTabText: {
    fontWeight: "bold",
    color: "#1E2A78",
  },
  offerCard: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
    marginHorizontal: 10,
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
