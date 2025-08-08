import {configureStore,} from '@reduxjs/toolkit'
import authReducer from './authSlice'
import contactReducer from './ContactSlice'


export const store = configureStore({
    reducer : {
        auth : authReducer,
        contact:contactReducer,
    }
})