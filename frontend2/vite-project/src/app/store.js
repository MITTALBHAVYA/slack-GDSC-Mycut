// store.js
import {configureStore} from '@reduxjs/toolkit';
import {persistStore, persistReducer,FLUSH,REHYDRATE,PAUSE,PERSIST,PURGE,REGISTER} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import authReducer from '../features/authSlice.js';
import channelReducer from '../features/channelSlice.js';
import messageReducer from '../features/messageSlice.js';
import workspaceReducer from '../features/workspaceSlice.js';

const rootReducer = combineReducers({
    auth : authReducer,
    channel : channelReducer,
    message:messageReducer,
    workspace:workspaceReducer,
});

const persistConfig = {
    key:'root',
    storage,
    blacklist:['auth'],
};

const persistedReducer = persistReducer(persistConfig,rootReducer);

export const store = configureStore({
    reducer : persistedReducer,
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware({
        serializableCheck:{
            ignoreActions:[FLUSH,REHYDRATE,PAUSE,PERSIST,PURGE,REGISTER],
        },
    }),
});

export const persistor = persistStore(store);