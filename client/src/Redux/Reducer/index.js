import { combineReducers } from "@reduxjs/toolkit";
import AuthReducer from "./AuthReducer";

const rootReducer = combineReducers({
    auth: AuthReducer,
});

export default rootReducer;