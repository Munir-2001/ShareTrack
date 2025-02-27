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

// interface SendMoneyProps {
//   friendUsername: string; // The username of the friend
//   onClose: () => void; // Function to close the component
// }

// const SendMoney: React.FC<SendMoneyProps> = ({ friendUsername, onClose }) => {
//   const user = useAppSelector((state: { auth: any }) => state.auth?.user || {});
//   const senderUsername = user.username || ""; // Ensure senderUsername is always defined
//   const [amountToSend, setAmountToSend] = useState('');

//   const handleSendMoney = async () => {
//     console.log('🚀 Sending money from:', senderUsername, 'to:', friendUsername, 'amount:', amountToSend);

//     if (!senderUsername) {
//       console.error("❌ Sender username is undefined.");
//       return Alert.alert("Error", "Your username is missing. Please log in again.");
//     }

//     if (!friendUsername) {
//       console.error("❌ Friend username is undefined.");
//       return Alert.alert("Error", "Recipient username is missing.");
//     }

//     if (!amountToSend || isNaN(Number(amountToSend)) || Number(amountToSend) <= 0) {
//       console.error("❌ Invalid amount entered.");
//       return Alert.alert("Error", "Please enter a valid amount greater than 0.");
//     }

//     try {
//       const response = await sendMoneyAPI(senderUsername, friendUsername, Number(amountToSend)); // Send API request
//       console.log("✅ Send Money API Response:", response);
//       Alert.alert('Success', response.message);
//       setAmountToSend(''); // Clear the input
//       onClose(); // Close the component after sending money
//     } catch (error: any) {
//       console.error("❌ Error sending money:", error.message);
//       Alert.alert('Error', error.message || "Something went wrong. Please try again.");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Send Money to {friendUsername}</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Enter amount"
//         value={amountToSend}
//         onChangeText={setAmountToSend}
//         keyboardType="numeric"
//       />
//       <TouchableOpacity style={styles.sendButton} onPress={handleSendMoney}>
//         <Text style={styles.sendButtonText}>Send Money</Text>
//       </TouchableOpacity>
//       <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
//         <Text style={styles.cancelButtonText}>Cancel</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     elevation: 5,
//   },
//   header: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
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
//     padding: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   sendButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   cancelButton: {
//     marginTop: 10,
//     alignItems: 'center',
//   },
//   cancelButtonText: {
//     color: '#1E2A78',
//     fontWeight: 'bold',
//   },
// });

// export default SendMoney;

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { useAppSelector } from '../../Redux/Store/hooks';
import { sendMoney as sendMoneyAPI } from './relationshipUtils';

interface SendMoneyProps {
  friendUsername: string; // The username of the friend
  onClose: () => void; // Function to close the component
}

const SendMoney: React.FC<SendMoneyProps> = ({ friendUsername, onClose }) => {
  const user = useAppSelector((state: { auth: any }) => state.auth?.user || {});
  const senderUsername = user.username || ""; // Ensure senderUsername is always defined
  const [amountToSend, setAmountToSend] = useState('');

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
      const response = await sendMoneyAPI(senderUsername, friendUsername, Number(amountToSend)); // Send API request
      console.log("✅ Send Money API Response:", response);
      Alert.alert('Success', response.message);
      setAmountToSend(''); // Clear the input
      onClose(); // Close the component after sending money
    } catch (error: any) {
      console.log("❌ Error sending money:", error.message);
      Alert.alert('Error', error.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Send Money to {friendUsername}</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        value={amountToSend}
        onChangeText={setAmountToSend}
        keyboardType="numeric"
        placeholderTextColor="#666"
      />
      <TouchableOpacity style={styles.sendButton} onPress={handleSendMoney}>
        <Text style={styles.sendButtonText}>Send Money</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
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
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#1E2A78',
    fontWeight: 'bold',
  },
});

export default SendMoney;
