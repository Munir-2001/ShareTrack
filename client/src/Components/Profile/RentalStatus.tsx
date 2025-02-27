import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Pressable,
} from "react-native";
import { useAppSelector } from "../../Redux/Store/hooks";
import { API_URL } from '../../constants';

// ✅ API Call Function
const fetchUserRentalItems = async (userId: number) => {
  try {
    const response = await fetch(`${API_URL}/api/rental/user/${userId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('userId is '+ userId)
    console.log("❌ Error fetching user rental items:", error);
    return [];
  }
};

// ✅ Rental Item Type
interface RentalItem {
  id: number;
  item_name: string;
  rental_price: number;
  location: string;
  status: string;
  rejection_reason?: string;
  created_at: string;
}

// ✅ Function to format date properly
const formatDate = (timestamp: string) => {
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

const RentalStatus = ({ navigation }: { navigation: any }) => {
  const userId = useAppSelector((state) => state.auth.user.id);
  const [rentalItems, setRentalItems] = useState<RentalItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserRentals();
  }, []);

  const loadUserRentals = async () => {
    setLoading(true);
    try {
      const rentals = await fetchUserRentalItems(userId);
      setRentalItems(rentals);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch rental items.");
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Rental Submissions</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#1E2A78" />
      ) : rentalItems.length === 0 ? (
        <Text style={styles.noItemsText}>No rental submissions found.</Text>
      ) : (
        <FlatList
          data={rentalItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const isApproved = item.status === "approved";
            const isRejected = item.status === "rejected";
            const isAvailable = item.status === "available";
            const isRented = item.status === "rented";
            const isUnderReview = item.status === "under_review";

            return (
              <View
                style={[
                  styles.listItem,
                  isApproved
                    ? styles.approvedItem
                    : isRejected
                    ? styles.rejectedItem
                    : isAvailable
                    ? styles.availableItem
                    : isRented
                    ? styles.rentedItem
                    : styles.underReviewItem,
                ]}
              >
                <Text style={styles.itemTitle}>{item.item_name}</Text>
                <Text style={styles.itemText}>💰 Price: ${item.rental_price}</Text>
                <Text style={styles.itemText}>📍 Location: {item.location}</Text>
                <Text style={styles.itemText}>🕒 Created: {formatDate(item.created_at)}</Text>

                <Text
                  style={[
                    styles.statusText,
                    isApproved
                      ? styles.statusApproved
                      : isRejected
                      ? styles.statusRejected
                      : isAvailable
                      ? styles.statusAvailable
                      : isRented
                      ? styles.statusRented
                      : styles.statusReview,
                  ]}
                >
                  Status: {item.status.toUpperCase()}
                </Text>

                {isRejected && (
                  <Text style={styles.rejectionReason}>
                    ❌ Reason: {item.rejection_reason || "No reason provided"}
                  </Text>
                )}
              </View>
            );
          }}
        />
      )}

      {/* 🔙 Back Button */}
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </Pressable>
    </View>
  );
};

export default RentalStatus;

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
  noItemsText: {
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
  approvedItem: {
    borderLeftWidth: 6,
    borderLeftColor: "#27AE60", // Green for approved
    backgroundColor: "#e6f9e6",
  },
  underReviewItem: {
    borderLeftWidth: 6,
    borderLeftColor: "#F39C12", // Yellow for under review
    backgroundColor: "#fcf8e3",
  },
  rejectedItem: {
    borderLeftWidth: 6,
    borderLeftColor: "#E74C3C", // Red for rejected
    backgroundColor: "#fdecec",
  },
  availableItem: {
    borderLeftWidth: 6,
    borderLeftColor: "#3498DB", // Blue for available
    backgroundColor: "#e6f3ff",
  },
  rentedItem: {
    borderLeftWidth: 6,
    borderLeftColor: "#9B59B6", // Purple for rented
    backgroundColor: "#f5e6ff",
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  itemText: {
    fontSize: 14,
    color: "#666",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
  },
  statusApproved: {
    color: "#27AE60",
  },
  statusReview: {
    color: "#F39C12",
  },
  statusRejected: {
    color: "#E74C3C",
  },
  statusAvailable: {
    color: "#3498DB",
  },
  statusRented: {
    color: "#9B59B6",
  },
  rejectionReason: {
    fontSize: 14,
    color: "#C0392B",
    marginTop: 5,
    fontStyle: "italic",
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
