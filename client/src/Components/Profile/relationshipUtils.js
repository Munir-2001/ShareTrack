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
        return data;
    } catch (error) {

        throw error;
    }
};


