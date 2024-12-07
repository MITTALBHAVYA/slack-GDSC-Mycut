// messageSlice.js
import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import api from '../api/axios.js';

export const fetchMessages = createAsyncThunk(
    'message/fetchMessages',
    async ({workspaceId,channelId},{rejectWithValue})=>{
        try{
            const response = await api.get(`/workspace/${workspaceId}/channel/${channelId}/messages`);
            console.log("response.data ",response.data);
            return response.data.messages;
        }catch(error){
            return rejectWithValue(error.response?.data || {message : 'Failed to fetch messages'});
        }
    }
);

const messageSlice = createSlice({
    name : 'message',
    initialState:{
        messages:[],
        isLoading:false,
        error:null, 
      },
      reducers:{
        addMessage:(state,action)=>{
            state.messages.push(action.payload);
        },
        updateMessage:(state,action)=>{
            const index = state.messages.findIndex(msg=>msg._id === action.payload._id);
            if(index !== -1){
                state.messages[index]=action.payload;
            }
        },
        deleteMessage : (state,action)=>{
            state.messages = state.messages.filter(msg=>msg._id !== action.payload);
        },
      },
      extraReducers:(builder)=>{
        builder
        .addCase(fetchMessages.pending,(state)=>{
            state.isLoading=true;
            state.error = null;
        })
        .addCase(fetchMessages.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.messages=action.payload;
            state.error = null;
        })
        .addCase(fetchMessages.rejected,(state,action)=>{
            state.isLoading=false;
            state.error = action.payload?.message || 'Failed to fetch messages';
        });
      },
});

export const {addMessage,updateMessage,deleteMessage} = messageSlice.actions;
export default messageSlice.reducer;