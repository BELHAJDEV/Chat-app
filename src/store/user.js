import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
    name : 'user',
    initialState : { 
        user : { displayName : '' },
        model : false
    },

    reducers : {
        SET(state,action){
            return {
                ...state,
                user : action.payload
            }
        },
        SET_MODEL(state,action){
            return{
                ...state,
                model : !state.model
            }
        }
    }
})

export const userActions = userSlice.actions;
export default userSlice.reducer;