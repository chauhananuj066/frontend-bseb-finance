import { useSelector, useDispatch } from 'react-redux';
import { loginAsync, logoutAsync, clearError } from '@store/slices/authSlice';

const useAuth = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const login = async (credentials) => {
    return await dispatch(loginAsync(credentials));
  };

  const logout = async () => {
    return await dispatch(logoutAsync());
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    ...authState,
    login,
    logout,
    clearAuthError,
  };
};

export default useAuth;
