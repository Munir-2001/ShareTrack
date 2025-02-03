import { API_URL } from "../../constants";

// Functions to make API calls to the server to get relationship data
// export const getTransactionHistory = async (username) => {
//   try {
//     const response = await fetch(`${API_URL}/api/relationship/getTransactionHistory`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ username }),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.message || 'Failed to fetch transaction history');
//     }

//     return data; // Return transactions array
//   } catch (error) {
//     console.error('Error fetching transaction history:', error);
//     return [];
//   }
// };
export const getTransactionHistory = async (username) => {
    try {
      console.log("🔹 Calling API to fetch transaction history for:", username);
  
      const response = await fetch(`${API_URL}/api/relationship/getTransactionHistory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });
  
      const data = await response.json();
      console.log("✅ API Response:", data); // Debugging
  
      if (!response.ok) {
        console.error("❌ API Error:", data.message);
        throw new Error(data.message || "Failed to fetch transaction history");
      }
  
      return data; // Return transactions array
    } catch (error) {
      console.error("❌ Error fetching transaction history:", error.message);
      return [];
    }
  };
  
// Get all friends for a user
export const getFriends = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/api/relationship/friends`, {  // ✅ Changed from GET to POST
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),  // ✅ Sending userId in request body
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }

        return await response.json();
    } catch (error) {
        console.error("❌ getFriends: Error fetching friends:", error.message);
        throw error;
    }
};

// Get all friend requests received for a user
export const getFriendRequestsReceived = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/api/relationship/requests/received`, {  // ✅ Changed from GET to POST
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),  // ✅ Sending userId in request body
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }

        return await response.json();
    } catch (error) {
        console.error("❌ getFriendRequestsReceived: Error fetching requests:", error.message);
        throw error;
    }
};

// Get all friend requests sent by a user
export const getFriendRequestsSent = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/api/relationship/requests/sent`, {  // ✅ Changed from GET to POST
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),  // ✅ Sending userId in request body
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }

        return await response.json();
    } catch (error) {
        console.error("❌ getFriendRequestsSent: Error fetching requests:", error.message);
        throw error;
    }
};

// Get all blocked users for a user
export const getBlockedUsers = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/api/relationship/blocked`, {  // ✅ Changed from GET to POST
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),  // ✅ Sending userId in request body
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }

        return await response.json();
    } catch (error) {
        console.error("❌ getBlockedUsers: Error fetching blocked users:", error.message);
        throw error;
    }
};


// Make a friend request
export const requestFriend = async (userId, friendUsername) => {
    try {
        const response = await fetch(`${API_URL}/api/relationship/request`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // Include cookies for session authentication if required
            body: JSON.stringify({ requester: userId, recipeintUsername: friendUsername }),
        });
        console.log('backend response was'+response)

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
};

// Approve a friend request
export const approveFriendRequest = async (relationshipId) => {
    try {
        const response = await fetch(`${API_URL}/api/relationship/approve`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ relationshipId: relationshipId }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
};

// Delete a friend request / unfriend a friend / unblock a friend
export const deleteRelationship = async (relationshipId) => {
    try {
        const response = await fetch(`${API_URL}/api/relationship/delete`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // Include cookies for session authentication if required
            body: JSON.stringify({ relationshipId: relationshipId }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
};

// Block a friend
export const blockFriend = async (relationshipId, blockerId) => {
    try {
        const response = await fetch(`${API_URL}/api/relationship/block`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // Include cookies for session authentication if required
            body: JSON.stringify({ relationshipId: relationshipId, blockerId: blockerId }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }

        const data = await response.json();
        console.log("Blocking friend", data);  
        return data;
    } catch (error) {
        throw error;
    }
};

// export const sendMoney = async (senderUsername, receiverUsername, amount) => {
//     try {
//         const response = await fetch(`${API_URL}/api/relationship/sendMoney`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ senderUsername, receiverUsername, amount }),
//         });

//         const responseData = await response.json();

//         if (!response.ok) {
//             throw new Error(responseData.message || "Failed to send money.");
//         }

//         return responseData; // Returns { message: 'Money sent successfully' }
//     } catch (error) {
//         console.error("Error sending money:", error.message);
//         throw new Error(error.message);
//     }

    
// };
export const sendMoney = async (senderUsername, receiverUsername, amount) => {
    try {
        const response = await fetch(`${API_URL}/api/relationship/sendMoney`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ senderUsername, receiverUsername, amount }), // ✅ Send user IDs instead of usernames
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || "Failed to send money.");
        }

        return responseData; // Returns { message: 'Money sent successfully' }
    } catch (error) {
        console.error("Error sending money:", error.message);
        throw new Error(error.message);
    }
};



export const requestMoney = async (senderUsername, receiverUsername, amount) => {
    try {
        console.log('in req money relation ship utils')

        const requestData = {
            senderUsername: senderUsername,
            receiverUsername: receiverUsername,
            amount: Number(amount), // Ensure it's a number
          };
          

      const response = await fetch(`${API_URL}/api/relationship/requestMoney`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      console.log('outside the api call')
      const responseData = await response.json();
      console.log('response')
      console.log(responseData)
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to request money.');
      }
  
      return responseData; // Returns { message: 'Money request sent successfully' }
    } catch (error ) {
      console.error('Error requesting money:', error.message);
      throw new Error(error.message);
    }
  };

  export const getRequestsForLending = async (username) => {
    try {
      const response = await fetch(`${API_URL}/api/relationship/getMoneyRequests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch money requests.');
      }
  
      const data = await response.json();
      console.log('data for the getrequests for lending' + data)
      return data;
    } catch (error) {
      console.error('Error fetching money requests:', error.message);
      return [];
    }
  };
  export const respondToMoneyRequest = async (transactionId, response) => {
    try {
      const requestBody = {
        transactionId,
        response, // "approved" or "declined"
      };
  
      const fetchResponse = await fetch(`${API_URL}/api/relationship/respondToRequest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      const responseData = await fetchResponse.json();
  
      if (!fetchResponse.ok) {
        throw new Error(responseData.message || "Failed to respond to money request.");
      }
  
      return responseData;
    } catch (error) {
      console.error("Error responding to money request:", error.message);
      throw new Error(error.message);
    }
  };
  
// Function to update user details
export const updateUserDetails = async ({ username, phone, email }) => {
    const response = await fetch(`${API_URL}/api/auth/updateDetails`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            // Include any necessary authentication headers here
        },
        body: JSON.stringify({ username, phone, email }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }

    return await response.json(); // Return the updated user details
};
  