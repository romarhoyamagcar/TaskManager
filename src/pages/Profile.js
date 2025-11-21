import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserIcon, BuildingOfficeIcon, PhoneIcon, EnvelopeIcon, PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Profile = () => {
  const { currentUser, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        company: currentUser.company || ''
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const result = updateProfile(formData);
      if (result.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setIsEditing(false);
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: currentUser.name || '',
      email: currentUser.email || '',
      phone: currentUser.phone || '',
      company: currentUser.company || ''
    });
    setIsEditing(false);
    setMessage({ type: '', text: '' });
  };

  const InfoRow = ({ icon: Icon, label, value, name }) => (
    <div className="flex items-center py-3 border-b border-border-light last:border-b-0">
      <Icon className="h-5 w-5 text-text-muted mr-3 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm text-text-muted">{label}</p>
        {isEditing && name !== 'email' ? (
          <input
            type={name === 'phone' ? 'tel' : 'text'}
            name={name}
            value={formData[name] || ''}
            onChange={handleChange}
            className="mt-1 input-field"
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        ) : (
          <p className="text-text-primary font-medium">{value || 'Not provided'}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-text-primary">
          Profile Settings
        </h1>
        <p className="mt-2 text-text-muted">
          Manage your personal information and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold text-text-primary">
                Personal Information
              </h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-secondary flex items-center"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleCancel}
                    className="btn-secondary flex items-center"
                    disabled={loading}
                  >
                    <XMarkIcon className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="btn-success flex items-center"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : (
                      <>
                        <CheckIcon className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {message.text && (
              <div className={`mb-4 p-3 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-success bg-opacity-10 border border-success text-success'
                  : 'bg-error bg-opacity-10 border border-error text-error'
              }`}>
                <p className="text-sm">{message.text}</p>
              </div>
            )}

            <div className="space-y-1">
              <InfoRow
                icon={UserIcon}
                label="Full Name"
                value={currentUser?.name}
                name="name"
              />
              <InfoRow
                icon={EnvelopeIcon}
                label="Email Address"
                value={currentUser?.email}
                name="email"
              />
              <InfoRow
                icon={PhoneIcon}
                label="Phone Number"
                value={currentUser?.phone}
                name="phone"
              />
              <InfoRow
                icon={BuildingOfficeIcon}
                label="Company Name"
                value={currentUser?.company}
                name="company"
              />
            </div>

            <div className="mt-6 pt-6 border-t border-border-light">
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-text-muted">Member since</p>
                  <p className="text-text-primary font-medium">
                    {currentUser?.createdAt 
                      ? new Date(currentUser.createdAt).toLocaleDateString()
                      : 'Unknown'
                    }
                  </p>
                </div>
                <div>
                  <p className="text-text-muted">Account type</p>
                  <p className="text-text-primary font-medium">Team Member</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Company Card */}
          <div className="card bg-gradient-to-br from-brand-primary to-brand-primary-dark text-white">
            <div className="flex items-center mb-4">
              <BuildingOfficeIcon className="h-8 w-8 mr-3 text-hard-hat-yellow" />
              <div>
                <h3 className="font-display font-bold">Task Manager</h3>
                <p className="text-xs text-white opacity-80">Professional Services</p>
              </div>
            </div>
            <p className="text-sm mb-4">
              Thank you for being part of our team. Together we achieve better results.
            </p>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-warning text-white">
              <span className="mr-1">🎯</span>
              10% OFF New Projects
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card">
            <h3 className="text-lg font-display font-bold text-text-primary mb-4">
              Account Summary
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">Profile Status</span>
                <span className="badge bg-success text-white">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">Email Verified</span>
                <span className="badge bg-brand-primary text-white">Verified</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">Account Type</span>
                <span className="badge bg-warning text-white">Premium</span>
              </div>
            </div>
          </div>

          {/* Activity Stats */}
          <div className="card">
            <h3 className="text-lg font-display font-bold text-text-primary mb-4">
              Activity Overview
            </h3>
            <p className="text-sm text-text-muted mb-4">
              Your recent task management activity and performance metrics.
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg">
                <span className="text-sm font-medium text-text-primary">Tasks Created</span>
                <span className="text-lg font-bold text-brand-primary">24</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg">
                <span className="text-sm font-medium text-text-primary">Completion Rate</span>
                <span className="text-lg font-bold text-success">87%</span>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="card">
            <h3 className="text-lg font-display font-bold text-text-primary mb-4">
              Need Help?
            </h3>
            <p className="text-sm text-text-muted mb-4">
              Our support team is here to help you with any questions about your account or tasks.
            </p>
            <button className="w-full btn-primary">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
