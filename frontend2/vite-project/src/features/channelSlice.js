// channelSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios.js";

// Fetch channels for a workspace
export const fetchChannels = createAsyncThunk(
    'channel/fetchChannels',
    async (workspaceId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/workspace/${workspaceId}/channel/`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Create a new channel
export const createChannel = createAsyncThunk(
    'channel/createChannel',
    async ({ workspaceId, channelData }, { rejectWithValue,dispatch }) => {
        try {
            const response = await api.post(`/workspace/${workspaceId}/channel/`, channelData);
            dispatch(fetchChannels(workspaceId));
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Fetch members for a specific channel
export const fetchChannelMembers = createAsyncThunk(
    'channel/fetchChannelMembers',
    async ({workspaceId,channelId}, { rejectWithValue }) => {
        try {
            const response = await api.get(`/workspace/${workspaceId}/channel/${channelId}/`);
            console.log("here is the fetch channel memeners : ",response.data.data);
            return response.data.data; // Assuming this returns the list of members
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const addChannelMembers = createAsyncThunk(
    'channel/addChannelMembers',
    async({workspaceId,channelId,emails},{rejectWithValue})=>{
        try{
            const response = await api.post(`/workspace/${workspaceId}/channel/${channelId}/`,{emails});
            return response.data;
        }catch(error){
            return rejectWithValue(error.response.data);
        }
    }
);

const channelSlice = createSlice({
    name: 'channel',
    initialState: {
        channels: {channels:[[]]},
        currentChannel: null,
        channelMembers: [], // New state to hold channel members
        isLoading: false,
        error: null,
    },
    reducers: {
        setCurrentChannel: (state, action) => {
            state.currentChannel = action.payload;
        },
        setChannelMembers: (state, action) => {
            state.channelMembers = action.payload; // Action to set channel members
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch channels
            .addCase(fetchChannels.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchChannels.fulfilled, (state, action) => {
                state.isLoading = false;
                state.channels = action.payload;
                state.error = null;
            })
            .addCase(fetchChannels.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || 'Failed to fetch channels';
            })
            // Create channel
            .addCase(createChannel.pending,(state)=>{
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createChannel.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(createChannel.rejected,(state,action)=>{
                state.isLoading = false;
                state.error = action.payload?.message || 'Failed to create channel';
            })
            // Fetch channel members
            .addCase(fetchChannelMembers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchChannelMembers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.channelMembers = action.payload; // Save fetched members
            })
            .addCase(fetchChannelMembers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || 'Failed to fetch channel members';
            });
    },
});

// Exporting actions and reducer
export const { setCurrentChannel, setChannelMembers } = channelSlice.actions;
export default channelSlice.reducer;
