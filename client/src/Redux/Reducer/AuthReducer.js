const initialState = {
    user: null,
    isAuth: false,
};

export default AuthReducer = (state = initialState, action) => {
    console.log("🔥 Redux Action Triggered:", action.type);
    switch (action.type) {
        case "LOGIN":
            console.log("✅ Redux LOGIN Action:", action.payload);
            return {
                ...state,
                user: action.payload,
                isAuth: true,
                balance: action.payload.balance
            };
            case "REGISTER":
                console.log("✅ Redux REGISTER Action:", action.payload); // ✅ Debug Redux updates
                return {
                    ...state,
                    user: action.payload, // ✅ Store user data directly, not inside `data`
                    isAuth: true,
                };
        case "LOGOUT":
            return {
                ...state,
                user: null,
                isAuth: false,
            };

        case "UPDATE":
            console.log("🔄 Redux UPDATE Action:", action.payload);
            return {
                ...state,
                user: action.payload,
            };
        default:
            return state;
    }
}