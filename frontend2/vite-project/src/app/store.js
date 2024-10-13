// store.js
import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../features/authSlice.js';
import channelReducer from '../features/channelSlice.js';
import messageReducer from '../features/messageSlice.js';
import workspaceReducer from '../features/workspaceSlice.js';

export const store = configureStore({
    reducer:{
        auth : authReducer,
        channel:channelReducer,
        message:messageReducer,
        workspace:workspaceReducer,
    },
});

export default store;