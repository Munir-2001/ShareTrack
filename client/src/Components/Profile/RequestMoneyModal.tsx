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
  const [repaymentDate, setRepaymentDate] = useState<string>('');

  const handleRequestMoney = async () => {
    console.log('Requesting money from:', senderUsername, 'to:', friendUsername, 'amount:', amountToSend);
    if (!amountToSend || isNaN(Number(amountToSend))) {
      return Alert.alert('Please enter a valid amount.');
    }
    if (!repaymentDate || !isValidDate(repaymentDate)) {
      Alert.alert('Invalid Date', 'Please enter a valid repayment date (YYYY-MM-DD).');
      return;
    }
    const today = new Date();
    const selectedDate = new Date(repaymentDate);
    if (selectedDate < today) {
      Alert.alert('Invalid Date', 'Repayment date cannot be in the past.');
      return;
    }

    try {
      const response = await requestMoneyAPI(senderUsername, friendUsername, Number(amountToSend), repaymentDate); // Send sender's username
      Alert.alert('Success', response.message);
      setAmountToSend(''); // Clear the input
      setRepaymentDate('');
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
      {/* Repayment Date Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter repayment date (YYYY-MM-DD)"
        value={repaymentDate}
        onChangeText={(text) => setRepaymentDate(text)}
        keyboardType="default"
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
const isValidDate = (dateString: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(regex)) return false;

  const date = new Date(dateString);
  return !isNaN(date.getTime());
};
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
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

  header: {
    fontSize: 18,
    fontWeight: 'bold',
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