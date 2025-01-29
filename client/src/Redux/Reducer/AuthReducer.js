const initialState = {
    user: null,
    isAuth: false,
};

export default AuthReducer = (state = initialState, action) => {
    switch (action.type) {
        case "LOGIN":
            return {
                ...state,
                user: action.payload,
                isAuth: true,
                balance: action.payload.balance
            };
        case "REGISTER":
            return {
                ...state,
                user: action.payload,
                isAuth: true,
            };
        case "LOGOUT":
            return {
                ...state,
                user: null,
                isAuth: false,
            };

        case "UPDATE":
            return {
                ...state,
                user: action.payload,
            };
        default:
            return state;
    }
}