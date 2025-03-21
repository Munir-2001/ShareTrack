// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   StyleSheet,
// } from 'react-native';
// import { useAppSelector } from '../../Redux/Store/hooks';
// import { sendMoney as sendMoneyAPI } from './relationshipUtils';
// import { useRoute, useNavigation } from '@react-navigation/native';

// // 📍 Helper function for ranking
// const getCreditScoreInfo = (score: string | null) => {
//   const numericScore = score ? parseFloat(score) : null;

//   if (numericScore === null) return { color: "#ccc", label: "Unknown" }; // Default gray
//   if (numericScore > 550 && numericScore <= 650) return { color: "#E57373", label: "Risky" }; // Red
//   if (numericScore > 650 && numericScore <= 730) return { color: "#FFA500", label: "Fair" }; // Orange
//   if (numericScore > 730 && numericScore <= 800) return { color: "#388E3C", label: "Trustworthy" }; // Green
//   return { color: "#ccc", label: "Not Available" }; // Default fallback
// };

// export const SendMoneyScreen: React.FC = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
  
//   // Get friend details from route params
//   const { friendUsername, friendCreditScore } = route.params as {
//     friendUsername: string;
//     friendCreditScore: string;
//   };

//   const user = useAppSelector((state: { auth: any }) => state.auth?.user || {});
//   const senderUsername = user.username || ""; // Ensure senderUsername is always defined
//   const [amountToSend, setAmountToSend] = useState('');

//   // 📍 Get color and label
//   const { color, label } = getCreditScoreInfo(friendCreditScore);

//   const handleSendMoney = async () => {
//     console.log('🚀 Sending money from:', senderUsername, 'to:', friendUsername, 'amount:', amountToSend);

//     if (!senderUsername) {
//       console.log("❌ Sender username is undefined.");
//       return Alert.alert("Error", "Your username is missing. Please log in again.");
//     }

//     if (!friendUsername) {
//       console.log("❌ Friend username is undefined.");
//       return Alert.alert("Error", "Recipient username is missing.");
//     }

//     if (!amountToSend || isNaN(Number(amountToSend)) || Number(amountToSend) <= 0) {
//       console.log("❌ Invalid amount entered.");
//       return Alert.alert("Error", "Please enter a valid amount greater than 0.");
//     }

//     try {
//       const response = await sendMoneyAPI(senderUsername, friendUsername, Number(amountToSend)); 
//       console.log("✅ Send Money API Response:", response);
//       Alert.alert('Success', response.message);
//       setAmountToSend('');
//        navigation.goBack(); // Navigate back after sending money
//     } catch (error: any) {
//       console.log("❌ Error sending money:", error.message);
//       Alert.alert('Error', error.message || "Something went wrong. Please try again.");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Send Money to {friendUsername}</Text>
      
//       {/* 📍 Updated UI with Ranking */}
//       <Text style={styles.subHeader}>
//         Credit Score: <Text style={{ color }}>{friendCreditScore}</Text> {" "}
//         <Text style={{ fontWeight: 'bold' }}>({label})</Text>
//       </Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Enter amount"
//         value={amountToSend}
//         onChangeText={setAmountToSend}
//         keyboardType="numeric"
//         placeholderTextColor="#666"
//       />
//       <TouchableOpacity style={styles.sendButton} onPress={handleSendMoney}>
//         <Text style={styles.sendButtonText}>Send Money</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   header: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   subHeader: {
//     fontSize: 16,
//     color: '#555',
//     marginBottom: 20,
//   },
//   input: {
//     height: 50,
//     borderWidth: 1,
//     borderColor: '#DDD',
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     backgroundColor: '#f9f9f9',
//     fontSize: 16,
//     color: '#333',
//     marginBottom: 10,
//   },
//   sendButton: {
//     backgroundColor: '#1E2A78',
//     padding: 12,
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   sendButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
// });

// export default SendMoneyScreen;

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useAppSelector } from '../../Redux/Store/hooks';
import { sendMoney as sendMoneyAPI } from './relationshipUtils';
import { useRoute, useNavigation } from '@react-navigation/native';

// 📍 Helper function for ranking
const getCreditScoreInfo = (score: string | null) => {
  const numericScore = score ? parseFloat(score) : null;

  if (numericScore === null) return { color: "#ccc", label: "Unknown" }; // Default gray
  if (numericScore > 550 && numericScore <= 650) return { color: "#E57373", label: "Risky" }; // Red
  if (numericScore > 650 && numericScore <= 730) return { color: "#FFA500", label: "Fair" }; // Orange
  if (numericScore > 730 && numericScore <= 800) return { color: "#388E3C", label: "Trustworthy" }; // Green
  
  return { color: "#ccc", label: "Not Available" }; // Default fallback
};

export const SendMoneyScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  
  // Get friend details from route params
  const { friendUsername, friendCreditScore } = route.params as {
    friendUsername: string;
    friendCreditScore: string;
  };

  const user = useAppSelector((state: { auth: any }) => state.auth?.user || {});
  const senderUsername = user.username || ""; // Ensure senderUsername is always defined
  const [amountToSend, setAmountToSend] = useState('');
  const [isSending, setIsSending] = useState(false);

  // 📍 Get color and label
  const { color, label } = getCreditScoreInfo(friendCreditScore);

  // 📍 Get Current Date & Time
  const currentDate = new Date();
  const formattedDate = currentDate.toDateString(); // Example: "Tue, Mar 19 2025"
  const formattedTime = currentDate.toLocaleTimeString(); // Example: "10:45 AM"

  const handleSendMoney = async () => {
    console.log('🚀 Sending money from:', senderUsername, 'to:', friendUsername, 'amount:', amountToSend);

    if (!senderUsername) {
      console.log("❌ Sender username is undefined.");
      return Alert.alert("Error", "Your username is missing. Please log in again.");
    }

    if (!friendUsername) {
      console.log("❌ Friend username is undefined.");
      return Alert.alert("Error", "Recipient username is missing.");
    }

    if (!amountToSend || isNaN(Number(amountToSend)) || Number(amountToSend) <= 0) {
      console.log("❌ Invalid amount entered.");
      return Alert.alert("Error", "Please enter a valid amount greater than 0.");
    }

    try {
      setIsSending(true);
      const response = await sendMoneyAPI(senderUsername, friendUsername, Number(amountToSend)); 
      console.log("✅ Send Money API Response:", response);
      Alert.alert('Success', response.message);
      setAmountToSend('');
      navigation.goBack(); // Navigate back after sending money
    } catch (error: any) {
      console.log("❌ Error sending money:", error.message);
      Alert.alert('Error', error.message || "Something went wrong. Please try again.");
    }finally {
      setIsSending(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>⬅ Back</Text>
      </TouchableOpacity> */}

      {/* Card UI */}
      <View style={styles.card}>
        <Text style={styles.header}>Send Money to {friendUsername}</Text>
        
        {/* 📍 Updated UI with Ranking */}
        <Text style={styles.subHeader}>
          Credit Score: <Text style={{ color }}>{friendCreditScore}</Text> {" "}
          <Text style={{ fontWeight: 'bold' }}>({label})</Text>
        </Text>

        {/* 📍 Transaction Date & Time */}
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionText}>📅 Date: {formattedDate}</Text>
          <Text style={styles.transactionText}>⏰ Time: {formattedTime}</Text>
        </View>

        {/* Amount Input */}
        <TextInput
          style={styles.input}
          placeholder="Enter amount"
          value={amountToSend}
          onChangeText={setAmountToSend}
          keyboardType="numeric"
          placeholderTextColor="#666"
        />

        {/* Send Money Button */}
                  <TouchableOpacity style={styles.sendButton} onPress={handleSendMoney} disabled={isSending}>
            {isSending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.sendButtonText}>💸 Send Money</Text>
            )}
</TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F3F4F6', // Light gray background
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#1E2A78',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff', 
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 3 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 6, 
    elevation: 6, // For Android
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1E2A78',
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
    textAlign: 'center',
  },
  transactionDetails: {
    backgroundColor: "#EFF6FF",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  transactionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  sendButton: {
    backgroundColor: '#1E2A78',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SendMoneyScreen;
