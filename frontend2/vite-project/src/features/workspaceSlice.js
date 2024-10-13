// workspaceSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../api/axios.js';

export const fetchWorkspaces = createAsyncThunk(
    'workspace/fetchWorkspaces',
    async(_,{rejectWithValue})=>{
        try{
            const response = await api.get('/workspace/');
            console.log(response.data);
            return response.data.workspaces;
        }catch(error){
            return rejectWithValue(error.response.data);
        }
    }
);

export const createWorkspace = createAsyncThunk(
    'workspace/createWorkspace',
    async(workspaceData,{rejectWithValue})=>{
        try{
            const response = await api.post('/workspace/',workspaceData);
            return response.data;
        }catch(error){
            return rejectWithValue(error.response.data);
        }
    }
);

const workspaceSlice = createSlice({
    name:'workspace',
    initialState:{
        workspaces:[],
        currentWorkspace:null,
        isLoading:false,
        error:null,
    },
    reducers:{
        setCurrentWorkspace:(state,action)=>{
            state.currentWorkspace=action.payload;
        },
    },
    extraReducers:(builder)=>{
        builder
        .addCase(fetchWorkspaces.pending,(state)=>{
            state.isLoading=true;
        })
        .addCase(fetchWorkspaces.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.workspaces=action.payload;
        })
        .addCase(fetchWorkspaces.rejected,(state,action)=>{
            state.isLoading=false;
            state.workspaces=action.payload?.message || 'Failed to fetch workspaces';
        })
        .addCase(createWorkspace.fulfilled,(state,action)=>{
            state.workspaces.push(action.payload);
        });
    },
});

export const {setCurrentWorkspace} = workspaceSlice.actions;
export default workspaceSlice.reducer;