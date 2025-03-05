import { Alert } from "react-native";
import { API_URL } from "../../constants";

// Fetch user's loans
// export const getUserLoans = async (userId) => {
//   try {
//     console.log('trying to fetch from '+`${API_URL}/api/loans/user-loans` )
//     const response = await fetch(`${API_URL}/api/loans/user-loans`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ userId }),
//     });
//     // console.log('response was inside utils '+response.body.)

//     if (!response.ok) throw new Error("Failed to fetch loans");
//     return await response.json();
//   } catch (error) {
//     Alert.alert("Error", error.message);
//     return [];
//   }
// };
export const getUserLoans = async (userId) => {
    try {
      console.log('Fetching loans for userId:', userId);
      
      const response = await fetch(`${API_URL}/api/loans/user-loans`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
  
      console.log('Response status:', response.status);
  
      const responseData = await response.json();
      console.log('Response Data:', responseData); // Log response
  
      if (!response.ok) {
        throw new Error(responseData.message || "Failed to fetch loans");
      }
  
      return responseData;
    } catch (error) {
      console.error("Error fetching loans:", error.message);
      Alert.alert("Error", error.message);
      return [];
    }
  };
  

// Repay a loan
export const repayLoan = async (transactionId) => {
  debugger;
  try {
    console.log('inside the loan utils')
    const response = await fetch(`${API_URL}/api/loans/repay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transactionId }),
    });
    console.log('outside the get post function for the loan utils')


    // if (!response.ok) throw new Error("Failed to repay loan");
    return await response.json();
  } catch (error) {
    Alert.alert("Error", error.message);
    return null;
  }
};

