import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { useTask } from '../../context/TaskContext';
import { useUser } from '../../context/UserContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import {
  UsersIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CheckCircleIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const StatCard = memo(({ title, value, subtitle, icon: Icon, color, trend, trendValue }) => (
  <div className="bg-glass-light backdrop-blur-xl rounded-2xl shadow-xl border-2 border-glass p-6 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-4 rounded-2xl ${color} shadow-lg`}>
        <Icon className="h-7 w-7 text-white" />
      </div>
      {trend && (
        <div className={`flex items-center text-sm font-medium ${
          trend === 'up' ? 'text-success' : 'text-error'
        }`}>
          {trend === 'up' ? (
            <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
          ) : (
            <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
          )}
          {trendValue}
        </div>
      )}
    </div>
    <div>
      <p className="text-3xl font-bold text-text-primary">{value}</p>
      <p className="text-sm font-medium text-text-muted mt-1">{title}</p>
      {subtitle && (
        <p className="text-xs text-text-muted mt-2">{subtitle}</p>
      )}
    </div>
  </div>
));

StatCard.displayName = 'StatCard';

const RecentTaskCard = memo(({ task }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return 'badge-secondary';
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-glass-light backdrop-blur-lg rounded-2xl border-2 border-glass shadow-md hover:shadow-lg transition-all duration-300">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary truncate">
          {task.title}
        </p>
        <p className="text-xs text-text-muted mt-1">
          {task.userName || 'Unknown User'}
        </p>
      </div>
      <div className="flex items-center space-x-2 ml-4">
        <span className={`badge ${getPriorityColor(task.priority)} text-xs`}>
          {task.priority}
        </span>
        {task.completed && (
          <span className="badge badge-success text-xs">
            <CheckCircleIcon className="h-3 w-3 mr-1" />
            Done
          </span>
        )}
      </div>
    </div>
  );
});

RecentTaskCard.displayName = 'RecentTaskCard';

const TopUserCard = memo(({ user, rank }) => (
  <div className="flex items-center justify-between p-4 bg-glass-light backdrop-blur-lg rounded-2xl border-2 border-glass shadow-md hover:shadow-lg transition-all duration-300">
    <div className="flex items-center space-x-3">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-lg ${
        rank === 1 ? 'bg-brand-primary text-white' :
        rank === 2 ? 'bg-brand-secondary text-white' :
        rank === 3 ? 'bg-warning text-white' :
        'bg-glass-sky text-text-primary'
      }`}>
        {rank}
      </div>
      <div>
        <p className="text-sm font-medium text-text-primary">
          {user.name}
        </p>
        <p className="text-xs text-text-muted">
          {user.email}
        </p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-lg font-bold text-brand-primary">{user.taskCount}</p>
      <p className="text-xs text-text-muted">tasks</p>
    </div>
  </div>
));

TopUserCard.displayName = 'TopUserCard';

const AdminDashboard = memo(() => {
  const { getTaskStats, getAllTasks } = useTask();
  const { getUserStats, loading } = useUser(); // Get loading state from UserContext
  
  const globalTaskStats = getTaskStats();
  const allTasks = getAllTasks();
  const userStats = getUserStats();
  
  // Calculate additional metrics
  const activeUsers = userStats.filter(user => user.taskCount > 0).length;
  const totalUsers = userStats.length;
  const completionRate = globalTaskStats.total > 0 
    ? Math.round((globalTaskStats.completed / globalTaskStats.total) * 100)
    : 0;
  
  // Get recent activity
  const recentTasks = allTasks
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);
  
  // Get top users by task count
  const topUsers = [...userStats]
    .sort((a, b) => b.taskCount - a.taskCount)
    .slice(0, 5);

  // Handle loading state properly - if loading is false but no users, show empty state
  if (loading) {
    return <LoadingSpinner size="xl" text="Loading Admin Dashboard..." fullScreen={true} />;
  }

  // If no users exist, show empty state instead of loading
  if (!loading && userStats.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card text-center py-12">
          <UsersIcon className="h-16 w-16 text-text-muted mx-auto mb-4" />
          <h2 className="text-2xl font-display text-text-primary font-bold mb-2">
            No Users Yet
          </h2>
          <p className="text-text-muted mb-6">
            Users will appear here once they register and start creating tasks.
          </p>
          <Link 
            to="/register" 
            className="btn btn-primary"
          >
            Create Test User
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 bg-glass-light backdrop-blur-xl rounded-3xl shadow-xl border-2 border-glass p-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-4 bg-gradient-to-br from-brand-primary to-sky-blue rounded-2xl shadow-lg">
            <ChartBarIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-display text-sky-blue-darker font-bold">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-base text-text-secondary font-medium">
              Overview of system activity and performance metrics
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={totalUsers}
          subtitle={`${activeUsers} active users`}
          icon={UsersIcon}
          color="bg-brand-primary"
          trend="up"
          trendValue="+12%"
        />
        
        <StatCard
          title="Total Tasks"
          value={globalTaskStats.total}
          subtitle={`${globalTaskStats.completed} completed`}
          icon={ClipboardDocumentListIcon}
          color="bg-brand-secondary"
          trend="up"
          trendValue="+8%"
        />
        
        <StatCard
          title="Completion Rate"
          value={`${completionRate}%`}
          subtitle="Overall task completion"
          icon={ChartBarIcon}
          color={completionRate >= 80 ? 'bg-success' : completionRate >= 60 ? 'bg-warning' : 'bg-error'}
          trend={completionRate >= 60 ? 'up' : 'down'}
          trendValue={completionRate >= 60 ? '+5%' : '-2%'}
        />
        
        <StatCard
          title="High Priority"
          value={globalTaskStats.high}
          subtitle="Tasks requiring attention"
          icon={ExclamationTriangleIcon}
          color="bg-error"
          trend={globalTaskStats.high <= 5 ? 'down' : 'up'}
          trendValue={globalTaskStats.high <= 5 ? '-15%' : '+3%'}
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-success bg-opacity-10 rounded-full">
              <CheckCircleIcon className="h-8 w-8 text-success" />
            </div>
          </div>
          <p className="text-3xl font-bold text-success">{globalTaskStats.completed}</p>
          <p className="text-sm text-text-muted mt-2">Completed Tasks</p>
          <p className="text-xs text-text-muted mt-1">
            {globalTaskStats.total > 0 
              ? `${Math.round((globalTaskStats.completed / globalTaskStats.total) * 100)}% of total`
              : 'No tasks yet'
            }
          </p>
        </div>
        
        <div className="card text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-brand-primary bg-opacity-10 rounded-full">
              <ClockIcon className="h-8 w-8 text-brand-primary" />
            </div>
          </div>
          <p className="text-3xl font-bold text-brand-primary">{globalTaskStats.pending}</p>
          <p className="text-sm text-text-muted mt-2">Pending Tasks</p>
          <p className="text-xs text-text-muted mt-1">
            {globalTaskStats.total > 0 
              ? `${Math.round((globalTaskStats.pending / globalTaskStats.total) * 100)}% of total`
              : 'No tasks yet'
            }
          </p>
        </div>
        
        <div className="card text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-warning bg-opacity-10 rounded-full">
              <UserIcon className="h-8 w-8 text-warning" />
            </div>
          </div>
          <p className="text-3xl font-bold text-warning">{activeUsers}</p>
          <p className="text-sm text-text-muted mt-2">Active Users</p>
          <p className="text-xs text-text-muted mt-1">
            {totalUsers > 0 
              ? `${Math.round((activeUsers / totalUsers) * 100)}% engagement`
              : 'No users yet'
            }
          </p>
      </div>
    </div>

    {/* Recent Activity and Top Users */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Recent Tasks */}
      <div className="card">
        <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-glass-sky">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-brand-primary bg-opacity-10 rounded-xl">
              <ClockIcon className="h-5 w-5 text-brand-primary" />
            </div>
            <h2 className="text-xl font-display font-bold text-sky-blue-darker">
              Recent Activity
            </h2>
          </div>
          <Link 
            to="/admin/tasks" 
            className="text-sm text-brand-primary hover:text-brand-primary-dark transition-colors duration-250"
          >
            View all →
          </Link>
        </div>
        
        {recentTasks.length > 0 ? (
          <div className="space-y-3">
            {recentTasks.map(task => (
              <RecentTaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <EmptyState
            type="tasks"
            title="No recent activity"
            description="Tasks will appear here once users start creating them"
          />
        )}
      </div>

      {/* Top Users */}
      <div className="card">
        <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-glass-sky">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-warning bg-opacity-10 rounded-xl">
              <UsersIcon className="h-5 w-5 text-warning" />
            </div>
            <h2 className="text-xl font-display font-bold text-sky-blue-darker">
              Top Performers
            </h2>
          </div>
          <Link 
            to="/admin/users" 
            className="text-sm text-brand-primary hover:text-brand-primary-dark transition-colors duration-250"
          >
            View all →
          </Link>
        </div>
        
        {topUsers.length > 0 ? (
          <div className="space-y-3">
            {topUsers.map((user, index) => (
              <TopUserCard key={user.id} user={user} rank={index + 1} />
            ))}
          </div>
        ) : (
          <EmptyState
            type="users"
            title="No users yet"
            description="Users will appear here once they register and create tasks"
          />
        )}
      </div>
    </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <div className="card">
          <h2 className="text-lg font-semibold text-text-primary mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link 
              to="/admin/users" 
              className="btn btn-ghost justify-start hover-lift"
            >
              <UsersIcon className="h-5 w-5 mr-3" />
              Manage Users
            </Link>
            <Link 
              to="/admin/tasks" 
              className="btn btn-ghost justify-start hover-lift"
            >
              <ClipboardDocumentListIcon className="h-5 w-5 mr-3" />
              View All Tasks
            </Link>
            <Link 
              to="/admin" 
              className="btn btn-ghost justify-start hover-lift"
            >
              <ChartBarIcon className="h-5 w-5 mr-3" />
              Analytics
            </Link>
            <Link 
              to="/dashboard" 
              className="btn btn-ghost justify-start hover-lift"
            >
              <BuildingOfficeIcon className="h-5 w-5 mr-3" />
              User Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
});

AdminDashboard.displayName = 'AdminDashboard';

export default AdminDashboard;
