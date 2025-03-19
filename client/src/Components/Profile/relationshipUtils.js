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
  
// // Get all friends for a user
// export const getFriends = async (userId) => {
//     try {
//         const response = await fetch(`${API_URL}/api/relationship/friends`, {  // ✅ Changed from GET to POST
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ userId }),  // ✅ Sending userId in request body
//         });

//         if (!response.ok) {
//             const error = await response.json();
//             throw new Error(error.message);
//         }

//         return await response.json();
//     } catch (error) {
//         console.error("❌ getFriends: Error fetching friends:", error.message);
//         throw error;
//     }
// };
export const getFriends = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/api/relationship/friends`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }

        let friends = await response.json();

        // ✅ Ensure every friend has a `relationship` field
        friends = friends.map(friend => ({
            ...friend,
            relationship: friend.relationship || { id: friend.id } // ✅ Fallback if missing
        }));

        return friends;
    } catch (error) {
        console.error("❌ getFriends: Error fetching friends:", error.message);
        throw error;
    }
};

export const getFriendRequestsReceived = async (userId) => {
    try {
        console.log("📡 Fetching received friend requests for user:", userId);

        const response = await fetch(`${API_URL}/api/relationship/requests/received`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
        });

        const data = await response.json();
        console.log("📥 Received Friend Requests API Response:", data); // ✅ Debug API response

        if (!response.ok) {
            console.error("❌ API Error:", data.message);
            throw new Error(data.message);
        }

        // ✅ Ensure all items have `relationship` field
        const formattedData = data.map(request => ({
            ...request,
            relationship: request.relationship || { id: request.id } // ✅ Fallback if missing
        }));

        console.log("📥 Processed Received Requests:", formattedData);
        return formattedData;
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

export const getBlockedUsers = async (userId) => {
    try {
        console.log("📡 Fetching blocked users for user:", userId);

        const response = await fetch(`${API_URL}/api/relationship/blocked`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
        });

        const data = await response.json();
        console.log("🚫 Blocked Users API Response:", data);

        if (!response.ok) {
            console.error("❌ API Error:", data.message);
            throw new Error(data.message);
        }

        // ✅ Ensure blocked user details are properly structured
        const formattedData = data.map(blockedUser => ({
            ...blockedUser,
            username: blockedUser.username || "Unknown User",  // ✅ Ensure username exists
            relationship: blockedUser.relationship || { id: blockedUser.id } // ✅ Fallback if missing
        }));

        console.log("🚫 Processed Blocked Users:", formattedData);
        return formattedData;
    } catch (error) {
        console.error("❌ getBlockedUsers: Error fetching blocked users:", error.message);
        throw error;
    }
};



export const requestFriend = async (userId, friendUsername) => {
    try {
        console.log("📤 Sending friend request with payload:", JSON.stringify({ 
            requesterId: userId, 
            recipientUsername: friendUsername 
        }));

        const response = await fetch(`${API_URL}/api/relationship/request`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // Include cookies for session authentication if required
            body: JSON.stringify({ requesterId: userId, recipientUsername: friendUsername }), // ✅ Fixed key names
        });

        const data = await response.json();
        console.log("Dataaaaaaaaa bohat haa",data);

        if (!response.ok) {
            console.error("❌ requestFriend API Error:", data.message);
            throw new Error(data.message);
        }

        console.log("✅ Friend request sent successfully:", data);
        return data;
    } catch (error) {
        console.error("❌ Error sending friend request:", error.message);
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



export const requestMoney = async (senderUsername, receiverUsername, amount, repaymentDate) => {
    try {
        console.log('repayment date si '+repaymentDate)

        const requestData = {
            senderUsername: senderUsername,
            receiverUsername: receiverUsername,
            amount: Number(amount),
            repaymentDate: repaymentDate, // Ensure it's a number
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
  