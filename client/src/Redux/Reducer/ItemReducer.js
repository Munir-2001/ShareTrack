const initialState = {
    user_items: [],
    all_items: [],
};

export default ItemReducer = (state = initialState, action) => {
    switch (action.type) {
        case "GET_ALL_ITEMS":
            return {
                ...state,
                all_items: action.payload
            };

        case "GET_USER_ITEMS":
            return {
                ...state,
                user_items: action.payload
            };

        case "CREATE_ITEM":
            return {
                ...state,
                user_items: [action.payload, ...state.user_items]
            };
        case "EDIT_ITEM":
            return {
                ...state,
                user_items: state.user_items.map(item => item._id === action.payload._id ? action.payload : item)
            };
        case "DELETE_ITEM":
            return {
                ...state,
                user_items: state.user_items.filter(item => item._id !== action.payload)
            };
        default:
            return state;
    }
}