import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for existing session
    const storedUser = localStorage.getItem('currentUser');
    const storedIsAdmin = localStorage.getItem('isAdmin') === 'true';
    
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setIsAdmin(storedIsAdmin);
    }
    setLoading(false);
  }, []);

  const normalizeEmail = (value = '') => value.trim().toLowerCase();
  const normalizeString = (value = '') => value.trim();

  const getStoredList = (key) => {
    try {
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch (error) {
      console.error(`Failed to parse ${key} from localStorage:`, error);
      return [];
    }
  };

  const saveStoredList = (key, list) => {
    localStorage.setItem(key, JSON.stringify(list));
  };

  const login = (email, password, admin = false) => {
    // In a real app, this would be an API call
    // For demo, we'll use hardcoded credentials
    const users = getStoredList('users');
    const admins = getStoredList('admins');
    const normalizedEmail = normalizeEmail(email || '');
    const normalizedPassword = normalizeString(password || '');
    
    if (admin) {
      const adminAccount = admins.find(a =>
        normalizeEmail(a.email || '') === normalizedEmail &&
        normalizeString(a.password || '') === normalizedPassword
      );

      if (adminAccount) {
        const { password, ...adminWithoutPassword } = adminAccount;
        setCurrentUser(adminWithoutPassword);
        setIsAdmin(true);
        localStorage.setItem('currentUser', JSON.stringify(adminWithoutPassword));
        localStorage.setItem('isAdmin', 'true');
        return { success: true };
      }

      return { success: false, error: 'Invalid admin credentials' };
    } else {
      // User login
      const user = users.find(u => 
        normalizeEmail(u.email || '') === normalizedEmail &&
        normalizeString(u.password || '') === normalizedPassword
      );
      if (user) {
        const { password, ...userWithoutPassword } = user;
        setCurrentUser(userWithoutPassword);
        setIsAdmin(false);
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        localStorage.setItem('isAdmin', 'false');
        return { success: true };
      }
      return { success: false, error: 'Invalid email or password' };
    }
  };

  const register = (userData) => {
    const users = getStoredList('users');
    const sanitizedUserData = {
      ...userData,
      name: normalizeString(userData.name || ''),
      email: normalizeEmail(userData.email || ''),
      phone: normalizeString(userData.phone || ''),
      password: normalizeString(userData.password || ''),
      role: 'user'
    };
    
    // Check if email already exists
    if (users.some(u => normalizeEmail(u.email || '') === sanitizedUserData.email)) {
      return { success: false, error: 'Email already registered' };
    }
    
    const newUser = {
      id: Date.now().toString(),
      ...sanitizedUserData,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveStoredList('users', users);
    
    // Auto login after registration
    const { password, ...userWithoutPassword } = newUser;
    setCurrentUser(userWithoutPassword);
    setIsAdmin(false);
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    localStorage.setItem('isAdmin', 'false');
    
    return { success: true };
  };

  const registerAdmin = (adminData) => {
    const admins = getStoredList('admins');
    const sanitizedAdminData = {
      ...adminData,
      name: normalizeString(adminData.name || ''),
      email: normalizeEmail(adminData.email || ''),
      phone: normalizeString(adminData.phone || ''),
      password: normalizeString(adminData.password || ''),
      role: 'admin'
    };

    if (admins.some(a => normalizeEmail(a.email || '') === sanitizedAdminData.email)) {
      return { success: false, error: 'Admin email already registered' };
    }

    const newAdmin = {
      id: `admin-${Date.now()}`,
      ...sanitizedAdminData,
      createdAt: new Date().toISOString()
    };

    admins.push(newAdmin);
    saveStoredList('admins', admins);

    const { password, ...adminWithoutPassword } = newAdmin;
    setCurrentUser(adminWithoutPassword);
    setIsAdmin(true);
    localStorage.setItem('currentUser', JSON.stringify(adminWithoutPassword));
    localStorage.setItem('isAdmin', 'true');

    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAdmin');
  };

  const updateProfile = (updatedData) => {
    if (!currentUser || isAdmin) return { success: false, error: 'Cannot update admin profile' };
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex === -1) return { success: false, error: 'User not found' };
    
    users[userIndex] = { ...users[userIndex], ...updatedData };
    localStorage.setItem('users', JSON.stringify(users));
    
    const { password, ...userWithoutPassword } = users[userIndex];
    setCurrentUser(userWithoutPassword);
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    
    return { success: true };
  };

  const value = {
    currentUser,
    isAdmin,
    loading,
    login,
    register,
    registerAdmin,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
