// store.js
import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../features/authSlice.js';
import channelReducer from '../features/channelSlice.js';
import messageReducer from '../features/messageSlice.js';
import workspaceReducer from '../features/workspaceSlice.js';
import {persistStore, persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    auth : authReducer,
    channel : channelReducer,
    message:messageReducer,
    workspace:workspaceReducer,
});

const persistConfig = {
    key:'root',
    storage,
};

const persistedReducer = persistReducer(persistConfig,rootReducer);

export const store = configureStore({
    reducer : persistedReducer,
});

export const persistor = persistStore(store);