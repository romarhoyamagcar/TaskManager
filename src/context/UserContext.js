import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load users from localStorage
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
    setLoading(false);
  }, []);

  const saveUsers = (updatedUsers) => {
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const getAllUsers = () => {
    return users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  };

  const getUserById = (userId) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  };

  const deleteUser = (userId) => {
    const updatedUsers = users.filter(u => u.id !== userId);
    saveUsers(updatedUsers);
    
    // Also delete user's tasks
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const remainingTasks = tasks.filter(t => t.userId !== userId);
    localStorage.setItem('tasks', JSON.stringify(remainingTasks));
    
    return { success: true };
  };

  const getUserStats = () => {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    
    return users.map(user => {
      const userTasks = tasks.filter(t => t.userId === user.id);
      const { password, ...userWithoutPassword } = user;
      
      return {
        ...userWithoutPassword,
        taskCount: userTasks.length,
        completedTasks: userTasks.filter(t => t.completed).length,
        pendingTasks: userTasks.filter(t => !t.completed).length,
        lastActivity: userTasks.length > 0 
          ? Math.max(...userTasks.map(t => new Date(t.createdAt).getTime()))
          : new Date(user.createdAt).getTime()
      };
    });
  };

  const value = {
    users,
    loading,
    getAllUsers,
    getUserById,
    deleteUser,
    getUserStats
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
