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
import individualReducer from './slices/individualSlice.js';
import yearFilterReducer from './slices/yearFilterSlice.js';
import { setTokenAccessor, setUnauthorizedHandler } from '../api/api.js';
import { clearAuth } from './slices/authSlice.js';
import { isSessionValid, isTokenExpired } from '../utils/authSession.js';

// Persist only auth slice (selected fields)
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: [
    'user',
    'accessToken',
    'refreshToken',
    'tokenExpiresAt',
    'sessionUuid',
    'isAuthenticated',
  ],
};

const yearFilterPersistConfig = {
  key: 'yearFilter',
  storage,
  whitelist: ['selectedYear'],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  forane: foraneReducer,
  parish: parishReducer,
  community: communityReducer,
  family: familyReducer,
  individual: individualReducer,
  yearFilter: persistReducer(yearFilterPersistConfig, yearFilterReducer),
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
setTokenAccessor(() => {
  const state = store.getState();
  const { accessToken, tokenExpiresAt, sessionUuid } = state.auth || {};
  if (!accessToken || isTokenExpired(tokenExpiresAt)) {
    return { accessToken: null, sessionUuid: null };
  }
  return { accessToken, sessionUuid };
});

// Clear auth on unauthorized responses
setUnauthorizedHandler(usedToken => {
  const auth = store.getState().auth;
  const current = auth?.accessToken;
  // Ignore late 401s from requests made with a previous/absent token (e.g. before a fresh login)
  if (current && current !== usedToken && !isTokenExpired(auth.tokenExpiresAt)) {
    return;
  }
  // Dispatching directly avoids circular import issues
  store.dispatch(clearAuth());
});

// After rehydration, drop any persisted session that can no longer be used
// (expired, mock token, or inconsistent flags) so routing never gets stuck.
let rehydrationChecked = false;
persistor.subscribe(() => {
  const { bootstrapped } = persistor.getState() || {};
  if (!bootstrapped || rehydrationChecked) return;
  rehydrationChecked = true;
  const auth = store.getState()?.auth;
  const hasStaleData = Boolean(
    auth && (auth.isAuthenticated || auth.accessToken || auth.user)
  );
  if (hasStaleData && !isSessionValid(auth)) {
    store.dispatch(clearAuth());
  }
});

// Export default store
export default store;
