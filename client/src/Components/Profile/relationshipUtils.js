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
            throw new Error(`Error fetching friends: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch friends:", error);
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
            throw new Error(`Error fetching friend requests received: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch friend requests received:", error);
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
            throw new Error(`Error fetching friend requests sent: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch friend requests sent:", error);
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
            throw new Error(`Error requesting friend: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to request friend:", error);
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
            credentials: "include", // Include cookies for session authentication if required
            body: JSON.stringify({ relationshipId }),
        });

        if (!response.ok) {
            throw new Error(`Error approving friend request: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to approve friend request:", error);
        throw error;
    }
};

// Delete a friend request / unfriend a friend / unblock a friend
export const deleteRelationship = async (userId, friendId) => {
    try {
        const response = await fetch(`${API_URL}/api/relationship/delete`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // Include cookies for session authentication if required
            body: JSON.stringify({ relationshipId }),
        });

        if (!response.ok) {
            throw new Error(`Error deleting friend request: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to delete friend request:", error);
        throw error;
    }
};

// Block a friend
export const blockFriend = async (relationshipId, userId) => {
    try {
        const response = await fetch(`${API_URL}/api/relationship/block`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // Include cookies for session authentication if required
            body: JSON.stringify({ relationshipId, userId }),
        });

        if (!response.ok) {
            throw new Error(`Error blocking friend: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to block friend:", error);
        throw error;
    }
};


