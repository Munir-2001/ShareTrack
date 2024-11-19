import { combineReducers } from "@reduxjs/toolkit";
import AuthReducer from "./AuthReducer";
import ItemReducer from "./ItemReducer";

const rootReducer = combineReducers({
    auth: AuthReducer,
    item: ItemReducer

});

export default rootReducer;