import React, { useState } from 'react';
import {
    Button,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert
} from 'react-native';

import { API_URL } from "../../constants";
import DynamicBillerForm from './DynamicBillerForm';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';

export default function BillModule() {
    const [eventName, setEventName] = useState("");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [getBillerDynamicFormDataFromChildData,setgetBillerDynamicFormDataFromChildData]=useState([])
    const [conditionFortrigerringdatacollector,setconditionFortrigerringdatacollector]=useState(0)

    const handleCreateReq = (details: any) => { 
        setgetBillerDynamicFormDataFromChildData(details)
        console.log("This is Create Bill Req",details);
    }


    const getBillerDynamicFormDataFromChild=(getBillerSplitdata:any,userId:any)=>{
       timerFunctionforapicall(getBillerSplitdata,userId)
    }
    const timerFunctionforapicall = (getBillerSplitdata:any, userId:any) => {
        setTimeout(async () => {
          const apiBodyForSplitBill = {
            creator_id: userId,
            name: eventName,
            description: description,
            total_amount: amount,
            contributors: getBillerSplitdata,
          };
      
          console.log("hello i am timer ", apiBodyForSplitBill);
      
          try {
            const response = await fetch(`${API_URL}/api/bills`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(apiBodyForSplitBill),
            });
            const data = await response.json();
            Alert.alert("Bill created successfully");

            // Clear form fields on success
            setEventName('');
            setDescription('');
            setAmount('');
            setgetBillerDynamicFormDataFromChildData([]);
            setconditionFortrigerringdatacollector(0);
          } catch (error) {
            console.error("Error creating bill", error);
          }
        }, 1000);
      };
    return (
        <>
            <View style={styles.container}>
                <Text style={styles.header}>Create Bill Split</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Event Name"
                    value={eventName}
                    onChangeText={setEventName}
                    placeholderTextColor="#666"

                />
                <TextInput
                    style={styles.input}
                    placeholder="Description"
                    onChangeText={setDescription}
                    value={description}
                    placeholderTextColor="#666"

                />
                <TextInput
                    style={styles.input}
                    placeholder="Amount "
                    value={amount}
                    onChangeText={setAmount}
                    placeholderTextColor="#666"

                />
                <DynamicBillerForm 
                getBillerDynamicFormDataFromChild={getBillerDynamicFormDataFromChild}
                conditionFortrigerringdatacollector={conditionFortrigerringdatacollector}
                />



                <Button title="Create Bill" onPress={() => { 
                    handleCreateReq({ eventName: eventName, description: description, amount: amount }); 
                    setconditionFortrigerringdatacollector(1)
                    
                    }} />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    header: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#1E2A78",
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: "#000000",
        borderRadius: 10,
        paddingHorizontal: 12,
        backgroundColor: "#f9f9f9",
        fontSize: 16,
        color: "#000", // ✅ Ensuring input text is visible
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
    },
    picker: {
        height: 50,
        backgroundColor: "#F5F5F5",
        marginBottom: 15,
        color: "#000", // ✅ Ensuring picker text is visible

    },
    imagePicker: {
        backgroundColor: "#1E2A78",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        marginBottom: 15,
    },
    imagePickerText: {
        color: "#fff",
        fontSize: 16,
    },
    previewImage: {
        width: "100%",
        height: 200,
        borderRadius: 10,
        marginBottom: 15,
    },
});
