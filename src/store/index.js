import { configureStore } from "@reduxjs/toolkit";
import messageSlice from './message';
import userSlice from './user';



const store = configureStore({
    reducer: {
        messageReducer : messageSlice,
        userReducer : userSlice,
        
    
}})
    
export default store