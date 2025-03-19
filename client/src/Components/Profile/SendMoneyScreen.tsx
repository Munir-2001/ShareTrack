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
import { useRoute, useNavigation } from '@react-navigation/native';

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
      const response = await sendMoneyAPI(senderUsername, friendUsername, Number(amountToSend)); 
      console.log("✅ Send Money API Response:", response);
      Alert.alert('Success', response.message);
      setAmountToSend('');
       navigation.goBack(); // Navigate back after sending money
    } catch (error: any) {
      console.log("❌ Error sending money:", error.message);
      Alert.alert('Error', error.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>⬅ Back</Text>
      </TouchableOpacity> */}

      <Text style={styles.header}>Send Money to {friendUsername}</Text>
      <Text style={styles.subHeader}>Credit Score: {friendCreditScore}</Text>

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
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
  },
  backButton: {
    marginBottom: 15,
  },
  backButtonText: {
    fontSize: 16,
    color: '#1E2A78',
    fontWeight: 'bold',
  },
});

export default SendMoneyScreen;
