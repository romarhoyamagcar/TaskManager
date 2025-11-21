import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTask } from '../context/TaskContext';
import {
  XMarkIcon,
  CalendarIcon,
  FlagIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const TaskForm = memo(({ task, onClose, onSave }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    dueTime: '',
    priority: 'Medium'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { createTask, updateTask } = useTask();

  useEffect(() => {
    if (task) {
      // Edit mode - populate form with task data
      const dueDateTime = task.dueDate ? new Date(task.dueDate) : null;
      setFormData({
        title: task.title || '',
        description: task.description || '',
        dueDate: dueDateTime ? dueDateTime.toISOString().split('T')[0] : '',
        dueTime: dueDateTime ? dueDateTime.toTimeString().slice(0, 5) : '',
        priority: task.priority || 'Medium'
      });
    }
  }, [task]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field immediately when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Task description is required';
    }
    
    if (formData.dueDate && formData.dueTime) {
      const dueDateTime = new Date(`${formData.dueDate}T${formData.dueTime}`);
      if (dueDateTime < new Date()) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Memoize task data to prevent unnecessary recalculations
  const taskData = useMemo(() => {
    const data = {
      ...formData,
      userId: task?.userId || currentUser?.id || 'default-user'
    };
    
    // Combine date and time if both are provided
    if (formData.dueDate && formData.dueTime) {
      data.dueDate = new Date(`${formData.dueDate}T${formData.dueTime}`).toISOString();
    } else if (formData.dueDate) {
      data.dueDate = new Date(formData.dueDate).toISOString();
    } else {
      delete data.dueDate;
    }
    
    delete data.dueTime; // Remove the separate time field
    return data;
  }, [formData, task?.userId, currentUser?.id]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      let result;
      if (task) {
        result = updateTask(task.id, taskData);
      } else {
        result = createTask(taskData);
      }
      
      if (result.success) {
        // Show success feedback
        setErrors({});
        setSuccess(true);
        
        // Call onSave if provided, otherwise just close the form
        if (onSave) {
          onSave(result.task);
        }
        
        // Brief delay to show success state before closing
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setErrors({ submit: result.error || 'Failed to create task. Please try again.' });
      }
    } catch (err) {
      setErrors({ submit: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  }, [task, validateForm, taskData, updateTask, createTask, onSave, onClose]);

  const priorityOptions = ['High', 'Medium', 'Low'];
  const priorityColors = {
    High: 'bg-error hover:bg-red-600',
    Medium: 'bg-warning hover:bg-orange-600',
    Low: 'bg-success hover:bg-green-600'
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div 
          className="modal-content"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
        <div className="flex items-center justify-between p-6 border-b-2 border-glass-sky rounded-t-3xl bg-glass-sky backdrop-blur-xl">
          <h2 className="text-xl font-display text-text-primary font-bold">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-2.5 text-text-muted hover:text-brand-primary rounded-2xl hover:bg-glass-sky hover:scale-110 transition-all duration-300 shadow-md"
            aria-label="Close modal"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <AnimatePresence mode="wait">
            {errors.submit && (
              <motion.div 
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="mb-4 p-4 bg-error bg-opacity-10 border-2 border-error rounded-2xl flex items-center shadow-lg"
              >
                <ExclamationTriangleIcon className="h-4 w-4 text-error mr-2 flex-shrink-0" />
                <p className="text-error text-sm">{errors.submit}</p>
              </motion.div>
            )}
            
            {success && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", damping: 15, stiffness: 300 }}
                className="mb-4 p-4 bg-success bg-opacity-10 border-2 border-success rounded-2xl flex items-center shadow-lg"
              >
                <motion.svg 
                  className="h-5 w-5 text-success mr-2 flex-shrink-0" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <motion.path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7"
                  />
                </motion.svg>
                <p className="text-success text-sm font-medium">
                  {task ? 'Task updated successfully!' : 'Task created successfully!'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="space-y-4">
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Task Title <span className="text-error">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                className={`input ${errors.title ? 'input-error' : ''}`}
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter task title"
                aria-describedby={errors.title ? 'title-error' : undefined}
              />
              {errors.title && (
                <p id="title-error" className="form-error" role="alert">
                  {errors.title}
                </p>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description <span className="text-error">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                required
                className={`input resize-none ${errors.description ? 'input-error' : ''}`}
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter task description"
                aria-describedby={errors.description ? 'description-error' : undefined}
              />
              {errors.description && (
                <p id="description-error" className="form-error" role="alert">
                  {errors.description}
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label htmlFor="dueDate" className="form-label">
                  <CalendarIcon className="h-4 w-4 inline mr-2" />
                  Due Date
                </label>
                <input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  className={`input ${errors.dueDate ? 'input-error' : ''}`}
                  value={formData.dueDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  aria-describedby={errors.dueDate ? 'date-error' : undefined}
                />
                {errors.dueDate && (
                  <p id="date-error" className="form-error" role="alert">
                    {errors.dueDate}
                  </p>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="dueTime" className="form-label">
                  Due Time
                </label>
                <input
                  id="dueTime"
                  name="dueTime"
                  type="time"
                  className="input"
                  value={formData.dueTime}
                  onChange={handleChange}
                />
                <p className="form-help">Optional - set a specific time</p>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">
                <FlagIcon className="h-4 w-4 inline mr-2" />
                Priority Level
              </label>
              <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-label="Priority level">
                {priorityOptions.map((priority) => (
                  <motion.label
                    key={priority}
                    className="cursor-pointer"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <input
                      type="radio"
                      name="priority"
                      value={priority}
                      checked={formData.priority === priority}
                      onChange={handleChange}
                      className="sr-only"
                      aria-describedby={`priority-${priority.toLowerCase()}-desc`}
                    />
                    <motion.div 
                      className={`text-center py-3 px-4 rounded-lg border-2 transition-all duration-250 cursor-pointer ${
                        formData.priority === priority
                          ? `border-brand-primary ${priorityColors[priority]} text-white shadow-brand`
                          : 'border-border-light hover:border-brand-primary hover:bg-bg-secondary text-text-secondary'
                      }`}
                      animate={{
                        borderColor: formData.priority === priority ? '#0EA5E9' : '#E5E7EB',
                        boxShadow: formData.priority === priority ? '0 4px 14px 0 rgba(14, 165, 233, 0.39)' : '0 0 0 0 rgba(0,0,0,0)'
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-sm font-semibold">
                        {priority}
                      </span>
                      <p id={`priority-${priority.toLowerCase()}-desc`} className="text-xs opacity-75 mt-1">
                        {priority === 'High' && 'Urgent attention needed'}
                        {priority === 'Medium' && 'Normal priority'}
                        {priority === 'Low' && 'Can be completed later'}
                      </p>
                    </motion.div>
                  </motion.label>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex space-x-3">
            <motion.button
              type="button"
              onClick={onClose}
              className="flex-1 btn btn-ghost"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              className="flex-1 btn btn-primary"
              disabled={loading || success}
              whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(14, 165, 233, 0.3)" }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {loading ? (
                <motion.span 
                  className="flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div 
                    className="loading-spinner h-4 w-4 mr-2 border-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  {task ? 'Updating...' : 'Creating...'}
                </motion.span>
              ) : success ? (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className="flex items-center"
                >
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  Success!
                </motion.span>
              ) : (
                <span>{task ? 'Update Task' : 'Create Task'}</span>
              )}
            </motion.button>
          </div>
        </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});

TaskForm.displayName = 'TaskForm';

export default TaskForm;
