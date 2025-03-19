// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   StyleSheet,
// } from 'react-native';
// import DateTimePicker from "@react-native-community/datetimepicker";
// import { useAppSelector } from '../../Redux/Store/hooks';
// import { requestMoney as requestMoneyAPI } from './relationshipUtils';
// import { useRoute, useNavigation } from '@react-navigation/native';

// export const RequestMoneyScreen: React.FC = () => {
//   const route = useRoute();
//   const navigation = useNavigation();

//   // Get friend details from route params
//   const { friendUsername, friendCreditScore } = route.params as {
//     friendUsername: string;
//     friendCreditScore: string;
//   };

//   const user = useAppSelector((state: { auth: any }) => state.auth?.user || {});
//   const requesterUsername = user.username || ""; // Ensure requesterUsername is always defined
//   const [amountToRequest, setAmountToRequest] = useState('');
//   const [repaymentDate, setRepaymentDate] = useState(new Date());
//   const [showDatePicker, setShowDatePicker] = useState(false);

//   const handleRequestMoney = async () => {
//     console.log('💰 Requesting money from:', friendUsername, 'Amount:', amountToRequest, 'Repayment Date:', repaymentDate);

//     if (!requesterUsername) {
//       console.log("❌ Requester username is undefined.");
//       return Alert.alert("Error", "Your username is missing. Please log in again.");
//     }

//     if (!friendUsername) {
//       console.log("❌ Friend username is undefined.");
//       return Alert.alert("Error", "Recipient username is missing.");
//     }

//     if (!amountToRequest || isNaN(Number(amountToRequest)) || Number(amountToRequest) <= 0) {
//       console.log("❌ Invalid amount entered.");
//       return Alert.alert("Error", "Please enter a valid amount greater than 0.");
//     }

//     // Prevent past dates
//     const today = new Date();
//     if (repaymentDate <= today) {
//       console.log("❌ Repayment date cannot be in the past.");
//       return Alert.alert("Invalid Date", "Repayment date cannot be in the past.");
//     }

//     try {
//       const response = await requestMoneyAPI(
//         requesterUsername,
//         friendUsername,
//         Number(amountToRequest),
//         repaymentDate.toISOString().split("T")[0] // Send as YYYY-MM-DD
//       );
//       console.log("✅ Request Money API Response:", response);
//       Alert.alert('Success', response.message);
//       setAmountToRequest('');
//       setRepaymentDate(new Date());
//       navigation.goBack(); // Navigate back after requesting money
//     } catch (error: any) {
//       console.log("❌ Error requesting money:", error.message);
//       Alert.alert('Error', error.message || "Something went wrong. Please try again.");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {/* <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//         <Text style={styles.backButtonText}>⬅ Back</Text>
//       </TouchableOpacity> */}

//       <Text style={styles.header}>Request Money from {friendUsername}</Text>
//       <Text style={styles.subHeader}>Credit Score: {friendCreditScore}</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Enter amount"
//         value={amountToRequest}
//         onChangeText={setAmountToRequest}
//         keyboardType="numeric"
//         placeholderTextColor="#666"
//       />

//       {/* Repayment Date Picker */}
//       <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
//         <Text style={{ color: repaymentDate ? "#333" : "#666" }}>
//           {repaymentDate.toISOString().split("T")[0]} {/* Show selected date */}
//         </Text>
//       </TouchableOpacity>

//       {showDatePicker && (
//         <DateTimePicker
//           value={repaymentDate}
//           mode="date"
//           display="default"
//           minimumDate={new Date()} // Prevent selecting past dates
//           onChange={(event, selectedDate) => {
//             setShowDatePicker(false);
//             if (selectedDate) setRepaymentDate(selectedDate);
//           }}
//         />
//       )}

//       <TouchableOpacity style={styles.requestButton} onPress={handleRequestMoney}>
//         <Text style={styles.requestButtonText}>Request Money</Text>
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
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   requestButton: {
//     backgroundColor: '#1E2A78',
//     padding: 12,
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   requestButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   backButton: {
//     marginBottom: 15,
//   },
//   backButtonText: {
//     fontSize: 16,
//     color: '#1E2A78',
//     fontWeight: 'bold',
//   },
// });

// export default RequestMoneyScreen;

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAppSelector } from '../../Redux/Store/hooks';
import { requestMoney as requestMoneyAPI } from './relationshipUtils';
import { useRoute, useNavigation } from '@react-navigation/native';

export const RequestMoneyScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();

  // Get friend details from route params
  const { friendUsername, friendCreditScore } = route.params as {
    friendUsername: string;
    friendCreditScore: string;
  };

  const user = useAppSelector((state: { auth: any }) => state.auth?.user || {});
  const requesterUsername = user.username || ""; // Ensure requesterUsername is always defined
  const [amountToRequest, setAmountToRequest] = useState('');
  const [repaymentDate, setRepaymentDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // 📍 Get Current Date & Time
  const currentDate = new Date();
  const formattedDate = currentDate.toDateString(); // Example: "Tue, Mar 19 2025"
  const formattedTime = currentDate.toLocaleTimeString(); // Example: "10:45 AM"

  const handleRequestMoney = async () => {
    console.log('💰 Requesting money from:', friendUsername, 'Amount:', amountToRequest, 'Repayment Date:', repaymentDate);

    if (!requesterUsername) {
      console.log("❌ Requester username is undefined.");
      return Alert.alert("Error", "Your username is missing. Please log in again.");
    }

    if (!friendUsername) {
      console.log("❌ Friend username is undefined.");
      return Alert.alert("Error", "Recipient username is missing.");
    }

    if (!amountToRequest || isNaN(Number(amountToRequest)) || Number(amountToRequest) <= 0) {
      console.log("❌ Invalid amount entered.");
      return Alert.alert("Error", "Please enter a valid amount greater than 0.");
    }

    // Prevent past dates
    const today = new Date();
    if (repaymentDate <= today) {
      console.log("❌ Repayment date cannot be in the past.");
      return Alert.alert("Invalid Date", "Repayment date cannot be in the past.");
    }

    try {
      const response = await requestMoneyAPI(
        requesterUsername,
        friendUsername,
        Number(amountToRequest),
        repaymentDate.toISOString().split("T")[0] // Send as YYYY-MM-DD
      );
      console.log("✅ Request Money API Response:", response);
      Alert.alert('Success', response.message);
      setAmountToRequest('');
      setRepaymentDate(new Date());
      navigation.goBack(); // Navigate back after requesting money
    } catch (error: any) {
      console.log("❌ Error requesting money:", error.message);
      Alert.alert('Error', error.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>⬅ Back</Text>
      </TouchableOpacity>

      {/* Card UI */}
      <View style={styles.card}>
        <Text style={styles.header}>Request Money from {friendUsername}</Text>
        
        {/* 📍 Updated UI with Credit Score */}
        <Text style={styles.subHeader}>
          Credit Score: <Text style={{ fontWeight: 'bold' }}>{friendCreditScore}</Text>
        </Text>

        {/* 📍 Request Date & Time */}
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionText}>📅 Request Date: {formattedDate}</Text>
          <Text style={styles.transactionText}>⏰ Request Time: {formattedTime}</Text>
        </View>

        {/* Amount Input */}
        <TextInput
          style={styles.input}
          placeholder="Enter amount"
          value={amountToRequest}
          onChangeText={setAmountToRequest}
          keyboardType="numeric"
          placeholderTextColor="#666"
        />

        {/* Repayment Date Picker */}
        <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
          <Text style={{ color: repaymentDate ? "#333" : "#666" }}>
            Repayment Date: {repaymentDate.toISOString().split("T")[0]}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={repaymentDate}
            mode="date"
            display="default"
            minimumDate={new Date()} // Prevent selecting past dates
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setRepaymentDate(selectedDate);
            }}
          />
        )}

        {/* Request Money Button */}
        <TouchableOpacity style={styles.requestButton} onPress={handleRequestMoney}>
          <Text style={styles.requestButtonText}>💰 Request Money</Text>
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
    justifyContent: 'center',
  },
  requestButton: {
    backgroundColor: '#1E2A78',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  requestButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default RequestMoneyScreen;
