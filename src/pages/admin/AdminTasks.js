import React, { useState, useEffect } from 'react';
import { useTask } from '../../context/TaskContext';
import { useUser } from '../../context/UserContext';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  UserIcon,
  CalendarIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const AdminTasks = () => {
  const { getAllTasks, toggleTaskComplete, deleteTask, sortTasks, filterTasksByPriority } = useTask();
  const { getUserById } = useUser();
  
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdDate');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const allTasks = getAllTasks();
    const tasksWithUsers = allTasks.map(task => ({
      ...task,
      user: getUserById(task.userId)
    }));
    setTasks(tasksWithUsers);
    setFilteredTasks(tasksWithUsers);
    setLoading(false);
  }, [getAllTasks, getUserById]);

  useEffect(() => {
    let result = [...tasks];
    
    // Apply search filter
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      result = result.filter(task => 
        task.title.toLowerCase().includes(lowercaseSearch) ||
        task.description.toLowerCase().includes(lowercaseSearch) ||
        (task.user?.name && task.user.name.toLowerCase().includes(lowercaseSearch))
      );
    }
    
    // Apply priority filter
    result = filterTasksByPriority(result, filterPriority);
    
    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(task => 
        filterStatus === 'completed' ? task.completed : !task.completed
      );
    }
    
    // Apply sorting
    result = sortTasks(result, sortBy);
    
    setFilteredTasks(result);
  }, [tasks, searchTerm, filterPriority, filterStatus, sortBy, sortTasks, filterTasksByPriority]);

  const handleToggleComplete = async (taskId) => {
    const result = toggleTaskComplete(taskId);
    if (result.success) {
      setTasks(prev => prev.map(t => t.id === taskId ? result.task : t));
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const result = deleteTask(taskId);
      if (result.success) {
        setTasks(prev => prev.filter(t => t.id !== taskId));
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return 'bg-gray-500 text-white';
    }
  };

  const TaskCard = ({ task }) => (
    <div className={`card p-4 ${task.completed ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className={`text-lg font-medium text-text-primary ${task.completed ? 'task-complete' : ''}`}>
            {task.title}
          </h3>
          <p className={`text-sm text-text-muted mt-1 ${task.completed ? 'task-complete' : ''}`}>
            {task.description}
          </p>
          <div className="flex items-center mt-2 text-sm text-text-muted">
            <UserIcon className="h-4 w-4 mr-1" />
            <span>{task.user?.name || 'Unknown User'}</span>
            {task.user?.company && (
              <span className="ml-2">• {task.user.company}</span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <span className={`badge ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
          {task.completed && (
            <span className="badge bg-success text-white">
              Completed
            </span>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center text-sm text-text-muted">
          {task.dueDate && (
            <>
              <ClockIcon className="h-4 w-4 mr-1" />
              <span>
                Due: {new Date(task.dueDate).toLocaleDateString()} 
                {new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </>
          )}
          {!task.dueDate && (
            <span>No due date</span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleToggleComplete(task.id)}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              task.completed 
                ? 'bg-success hover:bg-green-600 text-white' 
                : 'bg-bg-secondary hover:bg-bg-tertiary text-text-primary'
            }`}
            title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            <CheckCircleIcon className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => handleDeleteTask(task.id)}
            className="p-2 bg-error hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
            title="Delete task"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const getTaskStats = () => {
    const total = filteredTasks.length;
    const completed = filteredTasks.filter(t => t.completed).length;
    const pending = filteredTasks.filter(t => !t.completed).length;
    const high = filteredTasks.filter(t => t.priority === 'High' && !t.completed).length;
    
    return { total, completed, pending, high };
  };

  const stats = getTaskStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-3xl font-display font-bold text-text-primary">
          All Tasks Management
        </h1>
        <div className="mt-4 sm:mt-0 text-sm text-text-muted">
          {stats.total} task{stats.total !== 1 ? 's' : ''} • {stats.completed} completed
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-muted">Total Tasks</p>
              <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
            </div>
            <div className="p-3 rounded-lg bg-brand-primary">
              <CalendarIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-muted">Completed</p>
              <p className="text-2xl font-bold text-success">{stats.completed}</p>
            </div>
            <div className="p-3 rounded-lg bg-success">
              <CheckCircleIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-muted">Pending</p>
              <p className="text-2xl font-bold text-warning">{stats.pending}</p>
            </div>
            <div className="p-3 rounded-lg bg-warning">
              <ClockIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-muted">High Priority</p>
              <p className="text-2xl font-bold text-error">{stats.high}</p>
            </div>
            <div className="p-3 rounded-lg bg-error">
              <ExclamationTriangleIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-muted" />
              <input
                type="text"
                placeholder="Search tasks by title, description, or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          
          {/* Filter and Sort buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center"
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filters
              {(filterPriority !== 'all' || filterStatus !== 'all' || searchTerm) && (
                <span className="ml-2 bg-warning text-white text-xs px-2 py-1 rounded-full">
                  Active
                </span>
              )}
            </button>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field"
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
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                      filterPriority === priority
                        ? priority === 'all' 
                          ? 'bg-brand-secondary text-white'
                          : getPriorityColor(priority)
                        : 'bg-bg-secondary hover:bg-bg-tertiary text-text-primary'
                    }`}
                  >
                    {priority === 'all' ? 'All' : priority}
                  </button>
                ))}
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium text-text-primary">Status:</span>
                {['all', 'completed', 'pending'].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                      filterStatus === status
                        ? status === 'all' 
                          ? 'bg-brand-secondary text-white'
                          : status === 'completed'
                            ? 'bg-success text-white'
                            : 'bg-warning text-white'
                        : 'bg-bg-secondary hover:bg-bg-tertiary text-text-primary'
                    }`}
                  >
                    {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
              
              {(searchTerm || filterPriority !== 'all' || filterStatus !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterPriority('all');
                    setFilterStatus('all');
                  }}
                  className="flex items-center text-sm text-error hover:text-red-600"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <CalendarIcon className="h-12 w-12 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            {searchTerm || filterPriority !== 'all' || filterStatus !== 'all' ? 'No tasks found' : 'No tasks created yet'}
          </h3>
          <p className="text-text-muted">
            {searchTerm || filterPriority !== 'all' || filterStatus !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Tasks will appear here once users create them'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminTasks;
