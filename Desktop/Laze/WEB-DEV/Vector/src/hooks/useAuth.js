import { useState, useCallback } from "react";
import { authAPI } from "../services/api";
import { useApp } from "../context/useApp";

export function useAuth() {
  const {
    login: contextLogin,
    logout: contextLogout,
    user,
    isAuthenticated,
  } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = useCallback(
    async (name, email, password, phone = null) => {
      setLoading(true);
      setError(null);

      try {
        const userData = await authAPI.register(name, email, password, phone);
        contextLogin(userData);
        return userData;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [contextLogin],
  );

  const login = useCallback(
    async (email, password) => {
      setLoading(true);
      setError(null);

      try {
        const userData = await authAPI.login(email, password);
        contextLogin(userData);
        return userData;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [contextLogin],
  );

  const logout = useCallback(async () => {
    setLoading(true);

    try {
      await authAPI.logout();
      contextLogout();
    } finally {
      setLoading(false);
    }
  }, [contextLogout]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    register,
    login,
    logout,
    clearError,
  };
}
