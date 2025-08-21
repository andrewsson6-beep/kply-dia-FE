import { useEffect } from 'react';
import { useIsAuthenticated, useAppDispatch, useAuth } from './store/hooks.js';
import { getCurrentUser } from './store/slices/authSlice.js';
import LoginForm from './components/auth/LoginForm.jsx';
import Dashboard from './components/auth/Dashboard.jsx';
import './App.css';

function App() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useIsAuthenticated();
  const { accessToken, isLoading } = useAuth();

  // Check if user is still valid on app load
  useEffect(() => {
    if (accessToken && isAuthenticated) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, accessToken, isAuthenticated]);

  // Show loading spinner during authentication check
  if (isLoading && isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">{isAuthenticated ? <Dashboard /> : <LoginForm />}</div>
  );
}

export default App;
