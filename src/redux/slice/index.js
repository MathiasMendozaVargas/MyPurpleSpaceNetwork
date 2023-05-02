import { combineReducers } from "@reduxjs/toolkit";

import userSliceReducer from './userSlice'


export const rootReducer = combineReducers({
    user: userSliceReducer
})