import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useTask } from '../../context/TaskContext';
import {
  MagnifyingGlassIcon,
  UserIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  TrashIcon,
  EyeIcon,
  EnvelopeIcon,
  ClipboardDocumentListIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

const AdminUsers = () => {
  const { getAllUsers, deleteUser } = useUser();
  const { getUserTasks } = useTask();
  
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      const userList = getAllUsers();
      const usersWithStats = userList.map(user => {
        const userTasks = getUserTasks(user.id);
        return {
          ...user,
          taskCount: userTasks.length,
          completedTasks: userTasks.filter(t => t.completed).length,
          pendingTasks: userTasks.filter(t => !t.completed).length,
          highPriorityTasks: userTasks.filter(t => t.priority === 'High' && !t.completed).length
        };
      });
      setUsers(usersWithStats);
      setFilteredUsers(usersWithStats);
      setLoading(false);
    };

    loadUsers();
  }, [getAllUsers, getUserTasks]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.company && user.company.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? All their tasks will also be deleted.')) {
      const result = deleteUser(userId);
      if (result.success) {
        setUsers(prev => prev.filter(u => u.id !== userId));
        setFilteredUsers(prev => prev.filter(u => u.id !== userId));
        if (selectedUser?.id === userId) {
          setSelectedUser(null);
          setShowUserDetails(false);
        }
      }
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const UserCard = ({ user }) => (
    <div className="card p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <div className="flex-shrink-0 w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center">
            <UserIcon className="h-5 w-5 text-white" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-text-primary">
              {user.name}
            </h3>
            <p className="text-sm text-text-muted">
              {user.email}
            </p>
            {user.company && (
              <p className="text-xs text-text-muted mt-1">
                <BuildingOfficeIcon className="h-3 w-3 inline mr-1" />
                {user.company}
              </p>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <p className="text-lg font-bold text-text-primary">{user.taskCount}</p>
          <p className="text-xs text-text-muted">Total Tasks</p>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <p className="text-lg font-bold text-success">{user.completedTasks}</p>
          <p className="text-xs text-text-muted">Completed</p>
        </div>
      </div>

      {user.highPriorityTasks > 0 && (
        <div className="mb-4 p-2 bg-error bg-opacity-10 rounded-lg">
          <p className="text-sm text-error">
            {user.highPriorityTasks} high priority task{user.highPriorityTasks > 1 ? 's' : ''} pending
          </p>
        </div>
      )}
      
      <div className="flex items-center justify-between text-sm text-text-muted">
        <span>
          <CalendarIcon className="h-3 w-3 inline mr-1" />
          Joined {new Date(user.createdAt).toLocaleDateString()}
        </span>
        <div className="flex space-x-1">
          <button
            onClick={() => handleViewUser(user)}
            className="p-1 text-brand-primary hover:text-brand-primary-dark transition-colors duration-200"
            title="View user details"
          >
            <EyeIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteUser(user.id)}
            className="p-1 text-error hover:text-red-600 transition-colors duration-200"
            title="Delete user"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

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
          User Management
        </h1>
        <div className="mt-4 sm:mt-0 text-sm text-text-muted">
          {users.length} total user{users.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Search */}
      <div className="card mb-6">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-muted" />
          <input
            type="text"
            placeholder="Search users by name, email, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* User Grid */}
      {filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map(user => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <UserIcon className="h-12 w-12 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            {searchTerm ? 'No users found' : 'No users registered yet'}
          </h3>
          <p className="text-text-muted">
            {searchTerm ? 'Try adjusting your search terms' : 'Users will appear here once they register'}
          </p>
        </div>
      )}

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border-light">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-display font-bold text-text-primary">
                  User Details
                </h2>
                <button
                  onClick={() => setShowUserDetails(false)}
                  className="text-text-muted hover:text-text-primary transition-colors duration-200"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0 w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center">
                  <UserIcon className="h-8 w-8 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-text-primary">
                    {selectedUser.name}
                  </h3>
                  <p className="text-sm text-text-muted">
                    {selectedUser.email}
                  </p>
                  {selectedUser.company && (
                    <p className="text-sm text-text-muted">
                      {selectedUser.company}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-text-primary mb-3">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <EnvelopeIcon className="h-4 w-4 text-text-muted mr-2" />
                      <span className="text-text-primary">{selectedUser.email}</span>
                    </div>
                    {selectedUser.phone && (
                      <div className="flex items-center text-sm">
                        <PhoneIcon className="h-4 w-4 text-text-muted mr-2" />
                        <span className="text-text-primary">{selectedUser.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-text-primary mb-3">Task Statistics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-text-muted">Total Tasks:</span>
                      <span className="text-text-primary font-medium">{selectedUser.taskCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-muted">Completed:</span>
                      <span className="text-success font-medium">{selectedUser.completedTasks}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-muted">Pending:</span>
                      <span className="text-warning font-medium">{selectedUser.pendingTasks}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-muted">High Priority:</span>
                      <span className="text-error font-medium">{selectedUser.highPriorityTasks}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-border-light">
                <p className="text-sm text-text-muted">
                  Member since {new Date(selectedUser.createdAt).toLocaleDateString()}
                </p>
                <div className="flex space-x-3">
                  <Link
                    to={`/admin/tasks?user=${selectedUser.id}`}
                    className="btn-secondary flex items-center"
                  >
                    <ClipboardDocumentListIcon className="h-4 w-4 mr-2" />
                    View Tasks
                  </Link>
                  <button
                    onClick={() => handleDeleteUser(selectedUser.id)}
                    className="btn-danger"
                  >
                    Delete User
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
