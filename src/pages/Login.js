import React, { useState, useCallback, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { EyeIcon, EyeSlashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const Login = memo(() => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  }, [error]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = login(formData.email, formData.password);
      
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
  }, [formData, login, navigate]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-sky-blue bg-opacity-30 rounded-full blur-2xl animate-pulse-slow"></div>
              <div className="relative bg-white p-4 rounded-3xl shadow-2xl border-4 border-glass-sky">
                <img 
                  src="/logo.png" 
                  alt="SMART PERSONAL ORGANIZE" 
                  className="h-16 w-16 rounded-2xl"
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-5xl font-display text-sky-blue-darker font-bold drop-shadow-lg">
              SMART PERSONAL
            </h2>
            <p className="text-3xl font-display text-brand-primary font-semibold">
              ORGANIZE
            </p>
          </div>
          <p className="mt-8 text-xl text-text-primary font-semibold">
            Sign in to your account
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="bg-glass-light backdrop-blur-2xl rounded-3xl shadow-2xl border-2 border-glass p-8">
            {error && (
              <div className="mb-6 p-4 bg-error bg-opacity-10 border-2 border-error rounded-2xl flex items-center animate-slide-down shadow-lg">
                <ExclamationTriangleIcon className="h-5 w-5 text-error mr-3 flex-shrink-0" />
                <p className="text-error text-sm font-medium">{error}</p>
              </div>
            )}
            
            <div className="space-y-5">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="input"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  aria-describedby="email-help"
                />
                <p id="email-help" className="form-help">
                  We'll never share your email with anyone else.
                </p>
              </div>
              
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className="input pr-12"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    aria-describedby="password-visibility"
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
                    Signing in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
            
            <div className="mt-6 p-4 bg-bg-secondary rounded-lg border border-border-light text-sm text-text-secondary">
              Need elevated access?{' '}
              <Link
                to="/admin/login"
                className="font-semibold text-brand-primary hover:text-brand-primary-dark transition-colors duration-200"
              >
                Visit the admin portal
              </Link>
            </div>
          </div>
        </form>
        
        <div className="text-center">
          <p className="text-sm text-text-secondary">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="font-medium text-brand-primary hover:text-brand-primary-dark transition-colors duration-250 hover-glow"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
});

Login.displayName = 'Login';

export default Login;
