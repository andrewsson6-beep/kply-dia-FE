// Redux hooks for typed usage
import { useDispatch, useSelector } from 'react-redux';

// Custom hooks for better DX
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

// Specific auth hooks for convenience
export const useAuth = () => {
  return useAppSelector(state => state.auth);
};

export const useUser = () => {
  return useAppSelector(state => state.auth.user);
};

export const useIsAuthenticated = () => {
  return useAppSelector(state => {
    const { isAuthenticated, tokenExpiresAt } = state.auth || {};
    if (!isAuthenticated) return false;
    if (!tokenExpiresAt) return isAuthenticated;
    // tokenExpiresAt is expected as "YYYY-MM-DD HH:mm:ss"
    const ms = Date.parse(tokenExpiresAt.replace(' ', 'T'));
    if (Number.isNaN(ms)) return isAuthenticated; // if parse fails, trust flag
    return Date.now() < ms;
  });
};

export const useAuthLoading = () => {
  return useAppSelector(state => state.auth.isLoading);
};

export const useAuthError = () => {
  return useAppSelector(state => state.auth.error);
};
