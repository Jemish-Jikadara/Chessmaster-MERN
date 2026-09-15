import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await api.get('/api/me');
      setUser(res.data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
const login = async (email, password) => {
  const res = await api.post('/login', { email, password });
  if (res.data.token) localStorage.setItem('authToken', res.data.token);
  if (res.data.user) setUser(res.data.user);
  return res.data;
};

  const register = async (payload) => {
    const res = await api.post('/register', payload);
    return res.data;
  };const setupProfile = async (formData) => {
  const res = await api.post('/setup-profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  if (res.data.token) localStorage.setItem('authToken', res.data.token);
  if (res.data.user) setUser(res.data.user);
  return res.data;
};

  const updateProfile = async (formData) => {
    const res = await api.post('/profile/edit', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (res.data.user) setUser(res.data.user);
    return res.data;
  };
const logout = async () => {
  localStorage.removeItem('authToken');

  try {
    await api.post('/logout');
  } catch (err) {
    console.log("logout error:", err);
  }

  setUser(null);
};
  return (
    <AuthContext.Provider value={{ user, login, register, setupProfile, updateProfile, logout, loading, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);