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

interface RequestMoneyProps {
  friendUsername: string; // The username of the friend
  onClose: () => void; // Function to close the component
}

const RequestMoney: React.FC<RequestMoneyProps> = ({ friendUsername, onClose }) => {
  const senderUsername = useAppSelector((state: { auth: any }) => state.auth.user.username); // Get sender's username
  const [amountToSend, setAmountToSend] = useState('');
  const [repaymentDate, setRepaymentDate] = useState(new Date()); // ✅ Store as Date
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleRequestMoney = async () => {
    console.log(
      "Requesting money from:",
      senderUsername,
      "to:",
      friendUsername,
      "amount:",
      amountToSend
    );

    if (!amountToSend || isNaN(Number(amountToSend))) {
      return Alert.alert("Please enter a valid amount.");
    }

    const today = new Date();
    if (repaymentDate < today) {
      Alert.alert("Invalid Date", "Repayment date cannot be in the past.");
      return;
    }

    try {
      console.log(
        "Data sent to API - RD:",
        repaymentDate.toISOString().split("T")[0], // Convert to YYYY-MM-DD format
        "Amount:",
        amountToSend,
        "Sender:",
        senderUsername,
        "Friend:",
        friendUsername
      );

      const response = await requestMoneyAPI(
        senderUsername,
        friendUsername,
        Number(amountToSend),
        repaymentDate.toISOString().split("T")[0] // Send as YYYY-MM-DD
      );

      Alert.alert("Success", response.message);
      setAmountToSend(""); // Clear the input
      setRepaymentDate(new Date()); // Reset date picker
      onClose(); // Close the component after requesting money
    } catch (error: any) {
      Alert.alert("Error", error.message);
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
                placeholderTextColor="#666"
      />
     {/* Repayment Date Picker */}
     <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
        <Text style={{ color: repaymentDate ? "#333" : "#666" }}>
          {repaymentDate.toISOString().split("T")[0]} {/* Show selected date */}
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