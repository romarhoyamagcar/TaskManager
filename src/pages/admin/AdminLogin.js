import React, { useState, useCallback, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheckIcon, EyeIcon, EyeSlashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const AdminLogin = memo(() => {
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

    if (error) {
      setError('');
    }
  }, [error]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = login(formData.email, formData.password, true);
      if (result.success) {
        navigate('/admin');
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
    <div className="min-h-screen flex items-center justify-center bg-dark-slate bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-10 bg-slate-900/60 border border-slate-700 rounded-3xl p-10 shadow-2xl">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-amber-400/10 rounded-3xl border border-amber-400/40">
              <ShieldCheckIcon className="h-14 w-14 text-amber-300" />
            </div>
          </div>
          <div>
            <p className="uppercase tracking-[0.6rem] text-xs text-amber-200/70">Admin Access</p>
            <h1 className="text-4xl font-display font-extrabold text-white">Control Center</h1>
            <p className="text-slate-300 mt-2">Sign in with elevated credentials to manage the entire workspace.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {error && (
            <div className="p-4 rounded-2xl border border-red-400/60 bg-red-500/10 text-red-200 flex items-center space-x-3">
              <ExclamationTriangleIcon className="h-5 w-5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="text-sm font-semibold text-slate-200 block mb-2">
                Admin email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input input-dark"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@company.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-semibold text-slate-200 block mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="input input-dark pr-12"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter secure password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-4 flex items-center text-slate-400 hover:text-white"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-admin"
          >
            {loading ? 'Securing access...' : 'Sign in as admin'}
          </button>
        </form>

        <div className="text-center text-sm text-slate-300 space-y-2">
          <p>
            Need an admin account?{' '}
            <Link to="/admin/register" className="text-amber-300 font-semibold hover:text-white transition-colors">
              Request access
            </Link>
          </p>
          <p>
            Looking for the standard workspace?{' '}
            <Link to="/login" className="text-brand-primary font-semibold">
              Go to user login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
});

AdminLogin.displayName = 'AdminLogin';

export default AdminLogin;
