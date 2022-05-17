import { createSlice } from "@reduxjs/toolkit";


const messageSlice = createSlice({

    name : "message",
    initialState : {
        messages : [],
        inbox : [],
        data : [],
        chat : []
    },
    reducers : {
        SET_MESSAGES(state,action){
            return {
                ...state,
                messages : action.payload
            }
        
        },
        SET_INBOX(state,action){
            return {
                ...state,
                inbox : action.payload
            }
        
        },
        ADD(state,action){
            return {
                ...state,
                messages : [...state.messages,action.payload]
            }

        },

        SETDATA(state,action) {
            return {
                ...state,
                data : action.payload
            }
        },
        GET_CHAT(state,action){
            
            return {
                ...state,
                chat : 
                state.messages.filter(msg => 
                    (msg.senderId === action.payload.idOne && msg.receiverId === action.payload.idTwo)
                    || 
                    (msg.senderId === action.payload.idTwo && msg.receiverId === action.payload.idOne))
            }
        },
        ADD_TO_CHAT(state,action){
            return {
                ...state,
                chat : [...state.chat,action.payload]
            }
        },
        SET_CHAT(state,action){
            return {
                ...state,
                chat : action.payload
            }
        }
        
        
    }
})

export const messageActions = messageSlice.actions;
export default messageSlice.reducer;