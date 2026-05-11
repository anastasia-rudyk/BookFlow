import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, onAuthStateChanged, signOut } from '../../../server/firebase';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [route, setRoute] = useState('library');
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // 1. Відслідковування авторизації
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Логіка темної теми (як було у твоєму script.js)
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [darkMode]);

  // 3. Логіка тост-повідомлень
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000); // Зникає через 3 секунди
  };

  // 4. Логіка виходу з акаунту
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Помилка при виході:", error);
    }
  };

  const value = {
    user,
    authLoading,
    route,
    setRoute,
    darkMode,
    setDarkMode,
    sidebarOpen,
    setSidebarOpen,
    toast,
    showToast,
    logout
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);