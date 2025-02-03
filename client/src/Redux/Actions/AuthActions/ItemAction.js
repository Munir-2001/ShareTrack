// import { Alert } from 'react-native';
// import { API_URL } from '../../../constants';

// // Get all items
// export const getAllItems = () => {
//     return async (dispatch) => {
//         try {
//             const response = await fetch(`${API_URL}/api/item/get-all`);
//             if (!response.ok) throw new Error(await response.text());
//             const items = await response.json();
//             dispatch({ type: "GET_ALL_ITEMS", payload: items });
//         } catch (error) {
//             Alert.alert("Error getting items:", error.message);
//         }
//     }
// }

// // Get user items
// export const getUserItems = (user_id) => {
//     return async (dispatch) => {
//         try {
//             const response = await fetch(`${API_URL}/api/item/owner/${user_id}`);
//             if (!response.ok) throw new Error(await response.text());
//             const items = await response.json();
//             dispatch({ type: "GET_USER_ITEMS", payload: items });
//         } catch (error) {
//             Alert.alert("Error getting items:", error.message);
//         }
//     }
// }

// // Create Item
// export const createItem = (itemData) => {
//     return async (dispatch) => {
//         try {
//             const response = await fetch(`${API_URL}/api/item/create`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(itemData),
//             });
//             if (!response.ok) throw new Error(await response.text());
//             dispatch(getAllItems()); // Refresh list after creation
//         } catch (error) {
//             Alert.alert("Error creating item:", error.message);
//         }
//     }
// };

// // Delete Item
// export const deleteItem = (item_id) => {
//     return async (dispatch) => {
//         try {
//             await fetch(`${API_URL}/api/item/${item_id}`, { method: "DELETE" });
//             dispatch(getAllItems());
//         } catch (error) {
//             Alert.alert("Error deleting item:", error.message);
//         }
//     }
// }

import { Alert } from 'react-native';
import { API_URL } from '../../../constants';

// Get all items
export const getAllItems = () => async (dispatch) => {
    try {
        const response = await fetch(`${API_URL}/api/item/get-all`);
        if (!response.ok) throw new Error(await response.text());
        const items = await response.json();
        dispatch({ type: "GET_ALL_ITEMS", payload: items });
    } catch (error) {
        Alert.alert("Error getting items:", error.message);
    }
};

// Get user items
export const getUserItems = (user_id) => async (dispatch) => {
    try {
        const response = await fetch(`${API_URL}/api/item/owner/${user_id}`);
        if (!response.ok) throw new Error(await response.text());
        const items = await response.json();
        dispatch({ type: "GET_USER_ITEMS", payload: items });
    } catch (error) {
        Alert.alert("Error getting user items:", error.message);
    }
};

// Create Item
export const createItem = (itemData) => async (dispatch) => {
    try {
        const response = await fetch(`${API_URL}/api/item/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(itemData),
        });
        if (!response.ok) throw new Error(await response.text());
        dispatch(getAllItems());
    } catch (error) {
        Alert.alert("Error creating item:", error.message);
    }
};

// Delete Item
// export const deleteItem = (item_id) => async (dispatch) => {
//     try {
//         await fetch(`${API_URL}/api/item/${item_id}`, { method: "DELETE" });
//         dispatch(getAllItems());
//     } catch (error) {
//         Alert.alert("Error deleting item:", error.message);
//     }
// };
export const deleteItem = (item_id) => {
    return async (dispatch, getState) => {
        try {
            const response = await fetch(`${API_URL}/api/item/${item_id}`, { method: "DELETE" });
            if (!response.ok) throw new Error(await response.text());

            // Remove item from Redux store
            const allItems = getState().item.all_items.filter(item => item.id !== item_id);
            const userItems = getState().item.user_items.filter(item => item.id !== item_id);

            dispatch({ type: "DELETE_ITEM", payload: item_id });
            dispatch({ type: "GET_ALL_ITEMS", payload: allItems });
            dispatch({ type: "GET_USER_ITEMS", payload: userItems });

        } catch (error) {
            Alert.alert("Error deleting item:", error.message);
        }
    }
};

