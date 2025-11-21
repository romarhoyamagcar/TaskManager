import React, { createContext, useContext, useState, useEffect } from 'react';

const TaskContext = createContext();

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load tasks from localStorage
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
    setLoading(false);
  }, []);

  const saveTasks = (updatedTasks) => {
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const createTask = (taskData) => {
    const newTask = {
      id: Date.now().toString(),
      ...taskData,
      createdAt: new Date().toISOString(),
      completed: false
    };
    
    const updatedTasks = [...tasks, newTask];
    saveTasks(updatedTasks);
    return { success: true, task: newTask };
  };

  const updateTask = (taskId, updatedData) => {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
      return { success: false, error: 'Task not found' };
    }
    
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], ...updatedData };
    saveTasks(updatedTasks);
    return { success: true, task: updatedTasks[taskIndex] };
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter(t => t.id !== taskId);
    saveTasks(updatedTasks);
    return { success: true };
  };

  const toggleTaskComplete = (taskId) => {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
      return { success: false, error: 'Task not found' };
    }
    
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex] = { 
      ...updatedTasks[taskIndex], 
      completed: !updatedTasks[taskIndex].completed,
      completedAt: !updatedTasks[taskIndex].completed ? new Date().toISOString() : null
    };
    saveTasks(updatedTasks);
    return { success: true, task: updatedTasks[taskIndex] };
  };

  const getUserTasks = (userId) => {
    return tasks.filter(task => task.userId === userId);
  };

  const getAllTasks = () => {
    return tasks;
  };

  const searchTasks = (userId, searchTerm) => {
    const userTasks = getUserTasks(userId);
    if (!searchTerm) return userTasks;
    
    const lowercaseSearch = searchTerm.toLowerCase();
    return userTasks.filter(task => 
      task.title.toLowerCase().includes(lowercaseSearch) ||
      task.description.toLowerCase().includes(lowercaseSearch)
    );
  };

  const sortTasks = (taskList, sortBy) => {
    const sortedTasks = [...taskList];
    
    switch (sortBy) {
      case 'dueDate':
        return sortedTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      case 'priority':
        const priorityOrder = { High: 0, Medium: 1, Low: 2 };
        return sortedTasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
      case 'createdDate':
        return sortedTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'completed':
        return sortedTasks.sort((a, b) => a.completed - b.completed);
      default:
        return sortedTasks;
    }
  };

  const filterTasksByPriority = (taskList, priority) => {
    if (!priority || priority === 'all') return taskList;
    return taskList.filter(task => task.priority === priority);
  };

  const getTaskStats = (userId = null) => {
    const relevantTasks = userId ? getUserTasks(userId) : tasks;
    
    return {
      total: relevantTasks.length,
      completed: relevantTasks.filter(t => t.completed).length,
      pending: relevantTasks.filter(t => !t.completed).length,
      high: relevantTasks.filter(t => t.priority === 'High').length,
      medium: relevantTasks.filter(t => t.priority === 'Medium').length,
      low: relevantTasks.filter(t => t.priority === 'Low').length
    };
  };

  const value = {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    getUserTasks,
    getAllTasks,
    searchTasks,
    sortTasks,
    filterTasksByPriority,
    getTaskStats
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};
