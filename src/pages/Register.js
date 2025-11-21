import React, { useState, useCallback, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BuildingOfficeIcon, EyeIcon, EyeSlashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const Register = memo(() => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear general error when user starts typing
    if (error) {
      setError('');
    }
  }, [fieldErrors, error]);

  const validateForm = useCallback(() => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [formData, register, navigate, validateForm]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setShowConfirmPassword(prev => !prev);
  }, []);

  const getPasswordStrength = useCallback((password) => {
    if (!password) return { strength: 0, text: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    
    const levels = [
      { strength: 0, text: 'Very Weak', color: 'text-error' },
      { strength: 1, text: 'Weak', color: 'text-error' },
      { strength: 2, text: 'Fair', color: 'text-warning' },
      { strength: 3, text: 'Good', color: 'text-brand-primary' },
      { strength: 4, text: 'Strong', color: 'text-success' },
      { strength: 5, text: 'Very Strong', color: 'text-success' }
    ];
    
    return levels[Math.min(strength, 4)];
  }, []);

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-secondary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-primary bg-opacity-20 rounded-full blur-xl"></div>
              <BuildingOfficeIcon className="relative h-16 w-16 text-brand-primary" />
            </div>
          </div>
          <h2 className="text-4xl font-display text-text-primary font-bold text-gradient">
            Task Manager
          </h2>
          <p className="mt-3 text-lg text-text-secondary font-medium">
            Task Management
          </p>
          <p className="mt-6 text-xl text-text-primary font-semibold">
            Create your account
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="card shadow-brand-lg">
            {error && (
              <div className="mb-6 p-4 bg-error bg-opacity-10 border border-error rounded-lg flex items-center animate-slide-down">
                <ExclamationTriangleIcon className="h-5 w-5 text-error mr-3 flex-shrink-0" />
                <p className="text-error text-sm font-medium">{error}</p>
              </div>
            )}
            
            <div className="space-y-5">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Full Name <span className="text-error">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className={`input ${fieldErrors.name ? 'input-error' : ''}`}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                />
                {fieldErrors.name && (
                  <p id="name-error" className="form-error" role="alert">
                    {fieldErrors.name}
                  </p>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email address <span className="text-error">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`input ${fieldErrors.email ? 'input-error' : ''}`}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  aria-describedby={fieldErrors.email ? 'email-error' : 'email-help'}
                />
                {fieldErrors.email && (
                  <p id="email-error" className="form-error" role="alert">
                    {fieldErrors.email}
                  </p>
                )}
                <p id="email-help" className="form-help">
                  We'll never share your email with anyone else.
                </p>
              </div>
              
              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="input"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  aria-describedby="phone-help"
                />
                <p id="phone-help" className="form-help">
                  Optional - for project notifications
                </p>
              </div>
              
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    className={`input pr-12 ${fieldErrors.password ? 'input-error' : ''}`}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    aria-describedby={fieldErrors.password ? 'password-error' : 'password-help password-strength'}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-muted hover:text-brand-primary transition-colors duration-250"
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    id="password-visibility"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p id="password-error" className="form-error" role="alert">
                    {fieldErrors.password}
                  </p>
                )}
                {formData.password && (
                  <div id="password-strength" className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-text-muted">Password strength:</span>
                      <span className={`text-xs font-medium ${passwordStrength.color}`}>
                        {passwordStrength.text}
                      </span>
                    </div>
                    <div className="w-full bg-bg-tertiary rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          passwordStrength.strength <= 1 ? 'bg-error' :
                          passwordStrength.strength <= 2 ? 'bg-warning' :
                          passwordStrength.strength <= 3 ? 'bg-brand-primary' :
                          'bg-success'
                        }`}
                        style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                <p id="password-help" className="form-help">
                  Use 6+ characters with mixed case, numbers, and symbols
                </p>
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    className={`input pr-12 ${fieldErrors.confirmPassword ? 'input-error' : ''}`}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    aria-describedby={fieldErrors.confirmPassword ? 'confirm-password-error' : undefined}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-muted hover:text-brand-primary transition-colors duration-250"
                    onClick={toggleConfirmPasswordVisibility}
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p id="confirm-password-error" className="form-error" role="alert">
                    {fieldErrors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
            
            <div className="mt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-primary btn-lg hover-lift"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="loading-spinner h-5 w-5 mr-3 border-2 border-white border-t-transparent"></div>
                    Creating account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </div>
        </form>
        
        <div className="text-center">
          <p className="text-sm text-text-secondary">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="font-medium text-brand-primary hover:text-brand-primary-dark transition-colors duration-250 hover-glow"
            >
              Sign in
            </Link>
          </p>
        </div>
        
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-brand-primary text-white shadow-brand hover-scale cursor-default">
            <span className="mr-2">🏗️</span>
            10% OFF New Projects
          </div>
          <p className="mt-3 text-xs text-text-muted">
            Join thousands of construction professionals managing projects efficiently
          </p>
        </div>
      </div>
    </div>
  );
});

Register.displayName = 'Register';

export default Register;
