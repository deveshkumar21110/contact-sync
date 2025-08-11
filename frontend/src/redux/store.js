import {configureStore,} from '@reduxjs/toolkit'
import authReducer from './authSlice'
import contactReducer from './contactSlice'
import labelReducer from './labelSlice'


export const store = configureStore({
    reducer : {
        auth : authReducer,
        contact:contactReducer,
        label:labelReducer
    }
})