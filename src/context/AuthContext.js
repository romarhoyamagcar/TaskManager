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

  const login = (email, password, admin = false) => {
    // In a real app, this would be an API call
    // For demo, we'll use hardcoded credentials
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const normalizedEmail = normalizeEmail(email || '');
    const normalizedPassword = normalizeString(password || '');
    
    if (admin) {
      // Admin login (hardcoded for demo)
      if (normalizedEmail === 'admin@gmail.com' && normalizedPassword === 'admin123') {
        const adminUser = {
          id: 'admin',
          email: 'admin@gmail.com',
          name: 'Administrator',
          role: 'admin'
        };
        setCurrentUser(adminUser);
        setIsAdmin(true);
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
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
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const sanitizedUserData = {
      ...userData,
      name: normalizeString(userData.name || ''),
      email: normalizeEmail(userData.email || ''),
      phone: normalizeString(userData.phone || ''),
      password: normalizeString(userData.password || '')
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
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto login after registration
    const { password, ...userWithoutPassword } = newUser;
    setCurrentUser(userWithoutPassword);
    setIsAdmin(false);
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    localStorage.setItem('isAdmin', 'false');
    
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
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
