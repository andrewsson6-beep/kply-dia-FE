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
import foraneReducer from './slices/foraneSlice.js';
import parishReducer from './slices/parishSlice.js';
import communityReducer from './slices/communitySlice.js';
import familyReducer from './slices/familySlice.js';
import { setTokenAccessor } from '../api/api.js';

// Persist only auth slice (selected fields)
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'accessToken', 'refreshToken', 'isAuthenticated'],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  forane: foraneReducer,
  parish: parishReducer,
  community: communityReducer,
  family: familyReducer,
});

// Configure store
export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: import.meta.env.DEV,
});

// Create persistor (only auth persisted)
export const persistor = persistStore(store);

// Provide token accessor to API layer
setTokenAccessor(() => ({
  accessToken: store.getState().auth.accessToken,
}));

// Export default store
export default store;
