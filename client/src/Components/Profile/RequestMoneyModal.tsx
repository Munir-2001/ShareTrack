// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Modal,
//   Pressable,
//   StyleSheet,
//   Alert,
// } from 'react-native';
// import { requestMoney } from '../Profile/relationshipUtils';

// interface RequestMoneyModalProps {
//   visible: boolean;
//   onClose: () => void;
//   senderUsername: string;
//   receiverUsername: string;
// }

// const RequestMoneyModal: React.FC<RequestMoneyModalProps> = ({
//   visible,
//   onClose,
//   senderUsername,
//   receiverUsername,
// }) => {
//   const [amount, setAmount] = useState('');

//   const handleRequestMoney = async () => {
//     if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
//       Alert.alert('Invalid Amount', 'Please enter a valid amount.');
//       return;
//     }

//     try {
//       await requestMoney(senderUsername, receiverUsername, Number(amount));
//       Alert.alert('Request Sent', `Money request of $${amount} sent to ${receiverUsername}`);
//       setAmount('');
//       onClose();
//     } catch (error: any) {
//       Alert.alert('Error', error.message);
//     }
//   };

//   return (
//     <Modal visible={visible} transparent animationType="slide">
//       <View style={styles.modalOverlay}>
//         <View style={styles.modalContent}>
//           <Text style={styles.header}>Request Money from {receiverUsername}</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Enter amount"
//             keyboardType="numeric"
//             value={amount}
//             onChangeText={setAmount}
//           />
//           <View style={styles.buttonContainer}>
//             <Pressable style={[styles.button, styles.requestButton]} onPress={handleRequestMoney}>
//               <Text style={styles.buttonText}>Send Request</Text>
//             </Pressable>
//             <Pressable style={[styles.button, styles.cancelButton]} onPress={onClose}>
//               <Text style={styles.buttonText}>Cancel</Text>
//             </Pressable>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// export default RequestMoneyModal;

// const styles = StyleSheet.create({
//     modalOverlay: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'rgba(0, 0, 0, 0.5)', // Ensures a dim background
//       },
//       modalContent: {
//         width: '85%', // Ensure it's properly visible
//         backgroundColor: '#fff',
//         padding: 20,
//         borderRadius: 12,
//         alignItems: 'center',
//         justifyContent: 'center',
//         elevation: 10, // Ensures it's on top
//         shadowColor: '#000', // Shadow for visibility
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.3,
//         shadowRadius: 4,
//       },
//   header: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 15,
//   },
//   input: {
//     width: '100%',
//     height: 50,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     marginBottom: 20,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//   },
//   button: {
//     flex: 1,
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginHorizontal: 5,
//   },
//   requestButton: {
//     backgroundColor: '#1E2A78',
//   },
//   cancelButton: {
//     backgroundColor: '#ccc',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
// });


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
import { requestMoney as requestMoneyAPI } from './relationshipUtils';

interface RequestMoneyProps {
  friendUsername: string; // The username of the friend
  onClose: () => void; // Function to close the component
}

const RequestMoney: React.FC<RequestMoneyProps> = ({ friendUsername, onClose }) => {
  const senderUsername = useAppSelector((state: { auth: any }) => state.auth.user.username); // Get sender's username
  const [amountToSend, setAmountToSend] = useState('');

  const handleRequestMoney = async () => {
    console.log('Requesting money from:', senderUsername, 'to:', friendUsername, 'amount:', amountToSend);
    if (!amountToSend || isNaN(Number(amountToSend))) {
      return Alert.alert('Please enter a valid amount.');
    }

    try {
      const response = await requestMoneyAPI(senderUsername, friendUsername, Number(amountToSend)); // Send sender's username
      Alert.alert('Success', response.message);
      setAmountToSend(''); // Clear the input
      onClose(); // Close the component after sending money
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Request Money from {friendUsername}</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        value={amountToSend}
        onChangeText={setAmountToSend}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.sendButton} onPress={handleRequestMoney}>
        <Text style={styles.sendButtonText}>Request Money</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
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

export default RequestMoney; 