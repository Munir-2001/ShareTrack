import { Alert } from 'react-native';
import { API_URL } from '../../../constants';

// Action to register a user with an API call
export const registerUser = (userData) => {
    return async (dispatch) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    // "Accept": "*/*",
                },
                body: JSON.stringify(userData),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }


            const user = await response.json();
            dispatch({
                type: "REGISTER",
                payload: user, // Save the user object to Redux state
            });
        } catch (error) {
            Alert.alert("Error registering user:", error.message);
            // Optionally, dispatch an error action here
        }
    };
};

// Action to log in a user with an API call
export const loginUser = (credentials) => {
    return async (dispatch) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }

            const user = await response.json();
            dispatch({
                type: "LOGIN",
                payload: user, // Save the user object to Redux state
            });
        } catch (error) {
            Alert.alert("Error registering user:", error.message);
            // Optionally, dispatch an error action here
        }
    };
};

// Action to log out a user
export const logoutUser = () => {
    return {
        type: "LOGOUT",
    };
};


export const updateUser = (userData) => {
    return async (dispatch) => {
        try {
            // const response = await fetch(`${API_URL}/api/auth/update`, {
            //     method: "PUT",
            //     headers: {
            //         "Content-Type": "application/json",
            //         Authorization: `Bearer ${userData.token}`,
            //     },
            //     body: JSON.stringify(userData),
            // });

            // if (!response.ok) {
            //     const error = await response.json();
            //     throw new Error(error.message);
            // }

            // const user = await response.json();
            dispatch({
                type: "UPDATE",
                payload: userData, // Save the user object to Redux state
            });
        } catch (error) {
            Alert.alert("Error updating user:", error.message);
            // Optionally, dispatch an error action here
        }
    };
}