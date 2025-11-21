import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTask } from '../context/TaskContext';
import {
  ClipboardDocumentListIcon,
  PlusCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { getTaskStats, getUserTasks } = useTask();
  
  const stats = getTaskStats(currentUser?.id);
  const userTasks = getUserTasks(currentUser?.id);
  
  // Get recent tasks (last 5)
  const recentTasks = userTasks
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);
  
  // Get upcoming tasks (next 3 due dates)
  const upcomingTasks = userTasks
    .filter(task => !task.completed && task.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 3);

  const StatCard = ({ title, value, icon: Icon, color, link }) => (
    <Link to={link} className="card hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-105">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-text-muted">{title}</p>
          <p className="text-3xl font-bold text-text-primary mt-2">{value}</p>
        </div>
        <div className={`p-4 rounded-2xl ${color} shadow-xl border-2 border-white border-opacity-30`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
      </div>
    </Link>
  );

  const TaskItem = ({ task }) => (
    <div className="flex items-center justify-between p-4 bg-glass-light backdrop-blur-xl rounded-2xl border-2 border-glass hover:bg-glass hover:scale-[1.02] transition-all duration-300 shadow-lg">
      <div className="flex-1">
        <h4 className={`text-sm font-semibold text-text-primary ${task.completed ? 'task-complete' : ''}`}>
          {task.title}
        </h4>
        <p className="text-xs text-text-muted mt-1">
          {task.priority} priority
        </p>
      </div>
      <div className="flex items-center space-x-2">
        {task.completed ? (
          <div className="p-2 bg-success bg-opacity-20 rounded-full">
            <CheckCircleIcon className="h-5 w-5 text-success" />
          </div>
        ) : (
          <div className="p-2 bg-warning bg-opacity-20 rounded-full">
            <ClockIcon className="h-5 w-5 text-warning" />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-text-primary">
          Welcome back, {currentUser?.name}!
        </h1>
        <p className="mt-2 text-text-muted">
          Here's what's happening with your tasks today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Tasks"
          value={stats.total}
          icon={ClipboardDocumentListIcon}
          color="bg-brand-primary"
          link="/tasks"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircleIcon}
          color="bg-success"
          link="/tasks"
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={ClockIcon}
          color="bg-warning"
          link="/tasks"
        />
        <StatCard
          title="High Priority"
          value={stats.high}
          icon={ExclamationTriangleIcon}
          color="bg-error"
          link="/tasks"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Tasks */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold text-text-primary flex items-center">
                <ClockIcon className="h-5 w-5 mr-2 text-brand-primary" />
                Recent Tasks
              </h2>
              <Link
                to="/tasks"
                className="text-sm text-brand-primary hover:text-brand-primary-dark font-medium"
              >
                View all
              </Link>
            </div>
            
            {recentTasks.length > 0 ? (
              <div className="space-y-3">
                {recentTasks.map(task => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ClipboardDocumentListIcon className="h-12 w-12 text-text-muted mx-auto mb-4" />
                <p className="text-text-muted">No tasks yet</p>
                <Link
                  to="/tasks"
                  className="mt-4 inline-flex items-center text-brand-primary hover:text-brand-primary-dark font-medium"
                >
                  <PlusCircleIcon className="h-4 w-4 mr-2" />
                  Create your first task
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-display font-bold text-text-primary mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link
                to="/tasks"
                className="w-full btn-primary flex items-center justify-center"
              >
                <PlusCircleIcon className="h-4 w-4 mr-2" />
                New Task
              </Link>
              <Link
                to="/profile"
                className="w-full btn-secondary flex items-center justify-center"
              >
                <UserIcon className="h-4 w-4 mr-2" />
                Edit Profile
              </Link>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="card">
            <h3 className="text-lg font-display font-bold text-text-primary mb-4">
              Upcoming Deadlines
            </h3>
            {upcomingTasks.length > 0 ? (
              <div className="space-y-3">
                {upcomingTasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {task.title}
                      </p>
                      <p className="text-xs text-text-muted">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`badge priority-${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-muted">
                No upcoming deadlines
              </p>
            )}
          </div>

          {/* Company Info */}
          <div className="card bg-gradient-to-br from-sky-blue-light to-sky-blue backdrop-blur-xl text-white shadow-2xl">
            <div className="flex items-center mb-4">
              <div className="bg-white p-2 rounded-2xl shadow-lg mr-3">
                <img 
                  src="/logo.png" 
                  alt="SMART PERSONAL ORGANIZE" 
                  className="h-10 w-10 rounded-xl"
                />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg">SMART PERSONAL</h3>
                <p className="text-sm font-semibold">ORGANIZE</p>
              </div>
            </div>
            <div className="text-sm">
              <p className="mb-3">Professional task management for better productivity and results.</p>
              <div className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold bg-white bg-opacity-30 backdrop-blur-sm shadow-lg">
                <span className="mr-2 text-lg">🎯</span>
                Achieve More Today
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
