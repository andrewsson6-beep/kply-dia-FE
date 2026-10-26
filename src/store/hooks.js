// Redux hooks for typed usage
import { useDispatch, useSelector } from 'react-redux';
import { isSessionValid } from '../utils/authSession.js';

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
  return useAppSelector(state => isSessionValid(state.auth));
};

export const useAuthLoading = () => {
  return useAppSelector(state => state.auth.isLoading);
};

export const useAuthError = () => {
  return useAppSelector(state => state.auth.error);
};
