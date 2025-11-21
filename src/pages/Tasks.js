import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTask } from '../context/TaskContext';
import { useDebounce } from '../hooks/useDebounce';
import TaskForm from '../components/TaskForm';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import {
  PlusCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  ClockIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CalendarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const TaskCard = memo(({ task, onToggleComplete, onEdit, onDelete }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return 'badge-secondary';
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`card-hover bg-glass-light backdrop-blur-2xl rounded-3xl border-2 border-glass shadow-xl ${task.completed ? 'opacity-75' : ''}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className={`text-lg font-semibold text-text-primary truncate ${
            task.completed ? 'task-complete' : ''
          }`}>
            {task.title}
          </h3>
          <p className={`text-sm text-text-secondary mt-2 line-clamp-2 ${
            task.completed ? 'task-complete' : ''
          }`}>
            {task.description}
          </p>
        </div>
        <div className="flex flex-col items-end space-y-2 ml-4">
          <span className={`badge ${getPriorityColor(task.priority)} shadow-lg`}>
            {task.priority}
          </span>
          {task.completed && (
            <span className="badge badge-success shadow-lg">
              Completed
            </span>
          )}
          {isOverdue && (
            <span className="badge badge-error shadow-lg flex items-center">
              <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
              Overdue
            </span>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center text-sm text-text-muted">
          {task.dueDate && (
            <>
              <ClockIcon className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">
                {new Date(task.dueDate).toLocaleDateString()} 
                {new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </>
          )}
          {!task.dueDate && (
            <span className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2" />
              No due date
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          <motion.button
            onClick={() => onToggleComplete(task.id)}
            className={`p-2 rounded-lg transition-all duration-250 ${
              task.completed 
                ? 'bg-success hover:bg-green-600 text-white' 
                : 'bg-bg-secondary hover:bg-bg-tertiary text-text-muted hover:text-text-primary'
            }`}
            title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
            aria-label={task.completed ? 'Mark task as incomplete' : 'Mark task as complete'}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <CheckCircleIcon className="h-4 w-4" />
          </motion.button>
          
          <motion.button
            onClick={() => onEdit(task)}
            className="p-2 bg-bg-secondary hover:bg-bg-tertiary text-text-muted hover:text-text-primary rounded-lg transition-all duration-250"
            title="Edit task"
            aria-label="Edit task"
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <PencilIcon className="h-4 w-4" />
          </motion.button>
          
          <motion.button
            onClick={() => onDelete(task.id)}
            className="p-2 bg-error hover:bg-red-600 text-white rounded-lg transition-all duration-250"
            title="Delete task"
            aria-label="Delete task"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <TrashIcon className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
});

TaskCard.displayName = 'TaskCard';

const Tasks = memo(() => {
  const { currentUser } = useAuth();
  const { 
    getUserTasks, 
    toggleTaskComplete, 
    deleteTask, 
    sortTasks, 
    filterTasksByPriority,
    loading: contextLoading
  } = useTask();
  
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdDate');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Get user tasks from context
  const userTasks = getUserTasks(currentUser?.id);

  useEffect(() => {
    let result = [...userTasks];
    
    // Apply search filter
    if (debouncedSearchTerm) {
      const lowercaseSearch = debouncedSearchTerm.toLowerCase();
      result = result.filter(task => 
        task.title.toLowerCase().includes(lowercaseSearch) ||
        task.description.toLowerCase().includes(lowercaseSearch)
      );
    }
    
    // Apply priority filter
    result = filterTasksByPriority(result, filterPriority);
    
    // Apply sorting
    result = sortTasks(result, sortBy);
    
    setFilteredTasks(result);
  }, [userTasks, debouncedSearchTerm, filterPriority, sortBy, sortTasks, filterTasksByPriority]);

  const handleToggleComplete = useCallback((taskId) => {
    toggleTaskComplete(taskId);
  }, [toggleTaskComplete]);

  const handleEditTask = useCallback((task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  }, []);

  const handleDeleteTask = useCallback((taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const result = deleteTask(taskId);
      if (result.success) {
        // Context automatically updates, no need to handle local state
      }
    }
  }, [deleteTask]);

  const handleCloseTaskForm = useCallback(() => {
    setShowTaskForm(false);
    setEditingTask(null);
  }, []);

  const handleNewTask = useCallback(() => {
    setEditingTask(null);
    setShowTaskForm(true);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setFilterPriority('all');
    setSortBy('createdDate');
  }, []);

  const getTaskStats = useCallback(() => {
    const total = filteredTasks.length;
    const completed = filteredTasks.filter(t => t.completed).length;
    const pending = filteredTasks.filter(t => !t.completed).length;
    const high = filteredTasks.filter(t => t.priority === 'High' && !t.completed).length;
    const overdue = filteredTasks.filter(t => 
      t.dueDate && new Date(t.dueDate) < new Date() && !t.completed
    ).length;
    
    return { total, completed, pending, high, overdue };
  }, [filteredTasks]);

  const stats = getTaskStats();

  if (contextLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Loading your tasks..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display text-text-primary font-bold">
            My Tasks
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            {stats.total} task{stats.total !== 1 ? 's' : ''} • {stats.completed} completed
          </p>
        </div>
        <motion.button
          onClick={handleNewTask}
          className="mt-4 sm:mt-0 btn btn-primary hover-lift"
          whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(14, 165, 233, 0.4)" }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          New Task
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <div className="card-compact glass glass-light backdrop-blur-md text-center">
          <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
          <p className="text-xs text-text-muted">Total</p>
        </div>
        <div className="card-compact glass glass-light backdrop-blur-md text-center">
          <p className="text-2xl font-bold text-success">{stats.completed}</p>
          <p className="text-xs text-text-muted">Completed</p>
        </div>
        <div className="card-compact glass glass-light backdrop-blur-md text-center">
          <p className="text-2xl font-bold text-brand-primary">{stats.pending}</p>
          <p className="text-xs text-text-muted">Pending</p>
        </div>
        <div className="bg-glass-light backdrop-blur-xl rounded-2xl shadow-lg border-2 border-glass p-4 text-center hover:scale-105 transition-all duration-300">
          <p className="text-2xl font-bold text-error">{stats.high}</p>
          <p className="text-xs text-text-muted">High Priority</p>
        </div>
        <div className="bg-glass-light backdrop-blur-xl rounded-2xl shadow-lg border-2 border-glass p-4 text-center hover:scale-105 transition-all duration-300">
          <p className="text-2xl font-bold text-error">{stats.overdue}</p>
          <p className="text-xs text-text-muted">Overdue</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-glass-light backdrop-blur-2xl rounded-3xl shadow-2xl border-2 border-glass p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-muted" />
              <input
                type="text"
                placeholder="Search tasks by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          
          {/* Filter and Sort buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-ghost flex items-center"
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filters
              {(filterPriority !== 'all' || debouncedSearchTerm) && (
                <span className="ml-2 bg-brand-primary text-white text-xs px-2 py-1 rounded-full">
                  Active
                </span>
              )}
            </button>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input"
            >
              <option value="createdDate">Sort by Created</option>
              <option value="dueDate">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="completed">Sort by Status</option>
            </select>
          </div>
        </div>
        
        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-border-light">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium text-text-primary">Priority:</span>
                {['all', 'High', 'Medium', 'Low'].map(priority => (
                  <button
                    key={priority}
                    onClick={() => setFilterPriority(priority)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-250 ${
                      filterPriority === priority
                        ? priority === 'all' 
                          ? 'bg-brand-secondary text-white'
                          : priority === 'High'
                            ? 'priority-high'
                            : priority === 'Medium'
                              ? 'priority-medium'
                              : 'priority-low'
                        : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
                    }`}
                  >
                    {priority === 'all' ? 'All' : priority}
                  </button>
                ))}
              </div>
              
              {(debouncedSearchTerm || filterPriority !== 'all') && (
                <button
                  onClick={handleClearFilters}
                  className="flex items-center text-sm text-error hover:text-red-600 transition-colors duration-250"
                >
                  <XMarkIcon className="h-4 w-4 mr-1" />
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Task List */}
      {filteredTasks.length > 0 ? (
        <div className="grid-responsive">
          <AnimatePresence mode="popLayout">
            {filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <EmptyState
          type={debouncedSearchTerm ? 'search' : filterPriority !== 'all' ? 'filter' : 'tasks'}
          title={debouncedSearchTerm ? 'No tasks found' : 'No tasks created yet'}
          description={
            debouncedSearchTerm 
              ? 'Try adjusting your search terms'
              : filterPriority !== 'all'
                ? 'Try adjusting your filter criteria'
                : 'Create your first task to get started'
          }
          action={!debouncedSearchTerm && filterPriority === 'all' && (
            <button onClick={handleNewTask} className="btn btn-primary">
              Create Your First Task
            </button>
          )}
        />
      )}

      {/* Task Form Modal */}
      <AnimatePresence>
        {showTaskForm && (
          <TaskForm
            task={editingTask}
            onClose={handleCloseTaskForm}
          />
        )}
      </AnimatePresence>
    </div>
  );
});

export default Tasks;
