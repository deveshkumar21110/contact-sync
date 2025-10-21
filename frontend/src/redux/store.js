import {configureStore,} from '@reduxjs/toolkit'
import authReducer from './authSlice'
import contactReducer from './contactSlice'
import userReducer from './userSlice'
import labelReducer from './labelSlice'


export const store = configureStore({
    reducer : {
        auth : authReducer,
        contact:contactReducer,
        label:labelReducer,
        user: userReducer
    }
})