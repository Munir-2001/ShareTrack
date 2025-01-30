import { API_URL } from "../../constants";

// Functions to make API calls to the server to get relationship data

// Get all friends for a user
export const getFriends = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/api/relationship/friends/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // Include cookies for session authentication if required
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

// Get all friend requests received for a user
export const getFriendRequestsReceived = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/api/relationship/requests/received/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // Include cookies for session authentication if required
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

// Get all friend requests sent by a user
export const getFriendRequestsSent = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/api/relationship/requests/sent/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // Include cookies for session authentication if required
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

// Get all blocked friends for a user
export const getBlockedUsers = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/api/relationship/blocked/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // Include cookies for session authentication if required
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }

        const data = await response.json();
        return data;
    }
    catch (error) {
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

export const sendMoney = async (senderUsername, receiverUsername, amount) => {
    try {
        const response = await fetch(`${API_URL}/api/relationship/sendMoney`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ senderUsername, receiverUsername, amount }),
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
      return data;
    } catch (error) {
      console.error('Error fetching money requests:', error.message);
      return [];
    }
  };
  