import './App.css';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import {
  useIsAuthenticated,
  useAppDispatch,
  useAppSelector,
} from './store/hooks.js';
import Layout from './components/layout/index';
import LoginPage from './components/auth/LoginPage.jsx';
import ForgotPassword from './components/auth/ForgotPassword.jsx';
import { useEffect } from 'react';
import { fetchForanesThunk } from './store/actions/foraneActions.js';
import { clearAuth } from './store/slices/authSlice.js';
import { parseExpiry, isTokenExpired } from './utils/authSession.js';

function App() {
  const location = useLocation();
  const authRoutes = ['/login', '/forgot-password'];
  const isAuthRoute = authRoutes.includes(location.pathname);
  const isAuthenticated = useIsAuthenticated();
  const dispatch = useAppDispatch();
  const tokenExpiresAt = useAppSelector(state => state.auth.tokenExpiresAt);
  const { loaded: foraneLoaded, loading: foraneLoading } = useAppSelector(
    state => state.forane
  );

  // Proactively end the session when the token expires so routing stays consistent
  useEffect(() => {
    if (!isAuthenticated) return undefined;
    const expiresAt = parseExpiry(tokenExpiresAt);
    if (expiresAt === null) return undefined;
    // setTimeout overflows past ~24.8 days
    const delay = Math.min(Math.max(expiresAt - Date.now(), 0), 2147483647);
    const id = setTimeout(() => {
      if (isTokenExpired(tokenExpiresAt)) dispatch(clearAuth());
    }, delay);
    return () => clearTimeout(id);
  }, [isAuthenticated, tokenExpiresAt, dispatch]);

  // Preload forane list right after login (to support mapping forane names elsewhere)
  useEffect(() => {
    if (isAuthenticated && !foraneLoaded && !foraneLoading) {
      dispatch(fetchForanesThunk());
    }
  }, [isAuthenticated, foraneLoaded, foraneLoading, dispatch]);

  // Redirect root to dashboard/login depending on session
  if (location.pathname === '/') {
    return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
  }

  if (isAuthRoute) {
    return (
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path="/forgot-password"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <ForgotPassword />
            )
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // For any non-auth route, if not authenticated redirect to login
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      {/* All non-auth routes fall under the existing layout */}
      <Route path="/*" element={<Layout />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
