import { Alert } from 'react-native';
import { API_URL } from '../../../constants';

// Action to register a user with an API call
export const registerUser = (userData) => {
    return async (dispatch) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const responseData = await response.json();
            console.log("🔄 API Response from Register:", responseData); // ✅ Debugging

            if (!response.ok) {
                throw new Error(responseData.message || "Registration failed");
            }

            if (!responseData.data) {
                throw new Error("Registration successful, but no user data returned.");
            }

            dispatch({
                type: 'REGISTER',
                payload: responseData.data, // ✅ Store only user data, NOT entire response
            });

            console.log("✅ Redux Register Action:", responseData.data); // ✅ Log cleaned data
            return responseData.data; // ✅ Return user data correctly
        } catch (error) {
            Alert.alert('Error registering user:', error.message);
            throw error;
        }
    };
};


// Action to log in a user with an API call
export const loginUser = (credentials) => {
    return async (dispatch) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }

            const user = await response.json();
            dispatch({
                type: 'LOGIN',
                payload: user, // Save the user object to Redux state
            });
        } catch (error) {
            Alert.alert('Error registering user:', error.message);
            // Optionally, dispatch an error action here
        }
    };
};

// Action to log out a user
export const logoutUser = () => {
    return {
        type: 'LOGOUT',
    };
};


export const updateUser = (userData) => {
    return async (dispatch) => {
        try {
            // Ensure userData has an id
            if (!userData.id) {
                throw new Error("User ID is required for update.");
            }

            const response = await fetch(`${API_URL}/api/auth/update/${userData.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    // "Authorization": `Bearer ${userData.token}`, // Uncomment if needed
                },
                body: JSON.stringify(userData),
            });

            // Debugging: Read raw response before parsing JSON
            const textResponse = await response.text();

            if (!response.ok) {
                throw new Error(`Error: ${textResponse}`);
            }

            const user = JSON.parse(textResponse);
            dispatch({
                type: "UPDATE",
                payload: user, // ✅ Updated user from API
            });

            Alert.alert("User successfully updated");
        } catch (error) {
            Alert.alert("Error updating user:", error.message);
        }
    };
};
