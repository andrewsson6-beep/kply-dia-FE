import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

// Import reducers
import authReducer from './slices/authSlice.js';

// Persist configuration
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  // Only persist auth state
  whitelist: ['auth'],
  // You can blacklist certain parts if needed
  // blacklist: ['someOtherSlice']
};

// Auth persist configuration (more specific)
const authPersistConfig = {
  key: 'auth',
  storage,
  // Only persist specific fields from auth state
  whitelist: ['user', 'accessToken', 'isAuthenticated'],
};

// Root reducer
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  // Add other reducers here as needed
  // example: exampleReducer,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: import.meta.env.DEV,
});

// Create persistor
export const persistor = persistStore(store);

// Export default store
export default store;
