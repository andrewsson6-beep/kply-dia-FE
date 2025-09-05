import './App.css';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useIsAuthenticated } from './store/hooks.js';
import Layout from './components/layout/index';
import LoginPage from './components/auth/LoginPage.jsx';
import ForgotPassword from './components/auth/ForgotPassword.jsx';

function App() {
  const location = useLocation();
  const authRoutes = ['/login', '/forgot-password'];
  const isAuthRoute = authRoutes.includes(location.pathname);
  const isAuthenticated = useIsAuthenticated();

  // Redirect root to login page
  if (location.pathname === '/') {
    return <Navigate to="/login" replace />;
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

  return (
    <Routes>
      {/* All non-auth routes fall under the existing layout */}
      <Route path="/*" element={<Layout />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
