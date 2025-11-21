import React, { useState, useCallback, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheckIcon, EyeIcon, EyeSlashIcon, ExclamationTriangleIcon, KeyIcon, PhoneIcon, UserIcon } from '@heroicons/react/24/outline';

const AdminRegister = memo(() => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { registerAdmin } = useAuth();
  const navigate = useNavigate();

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (error) {
      setError('');
    }
  }, [fieldErrors, error]);

  const validateForm = useCallback(() => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[A-Z])(?=.*[0-9])/.test(formData.password)) {
      errors.password = 'Include 1 uppercase letter and 1 number';
    }
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirm your password';
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
      const result = registerAdmin({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });

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
  }, [formData, registerAdmin, navigate, validateForm]);

  const togglePasswordVisibility = useCallback(() => setShowPassword(prev => !prev), []);
  const toggleConfirmVisibility = useCallback(() => setShowConfirmPassword(prev => !prev), []);

  const InputWrapper = ({ label, children, icon: Icon, errorMessage }) => (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
        {Icon && <Icon className="h-4 w-4 text-amber-300" />}
        <span>{label}</span>
      </label>
      {children}
      {errorMessage && <p className="text-xs text-red-300" role="alert">{errorMessage}</p>}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-3xl p-10 shadow-2xl space-y-6">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-amber-400/10 rounded-3xl border border-amber-400/40">
              <ShieldCheckIcon className="h-14 w-14 text-amber-300" />
            </div>
            <div>
              <p className="uppercase tracking-[0.4rem] text-xs text-amber-200/70">Admin Suite</p>
              <h1 className="text-3xl font-display font-bold text-white">Grant Administrative Access</h1>
              <p className="text-slate-300 mt-3">
                Configure the elevated workspace used to supervise teams, tasks, and analytics across the organization.
              </p>
            </div>
          </div>
          <div className="space-y-4 text-sm text-slate-300">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-amber-400/10 border border-amber-300/40 flex items-center justify-center">
                <ShieldCheckIcon className="h-5 w-5 text-amber-300" />
              </div>
              <div>
                <p className="font-semibold text-amber-200">Tiered permissions</p>
                <p>Restricted tools become available once an admin session is active.</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center">
                <KeyIcon className="h-5 w-5 text-slate-200" />
              </div>
              <div>
                <p className="font-semibold text-slate-100">Multi-factor ready</p>
                <p>Designed for future enhancements like MFA or SSO gateways.</p>
              </div>
            </div>
            <div className="text-sm text-slate-400">
              Need a standard workspace?{' '}
              <Link to="/login" className="text-brand-primary font-semibold">
                Switch to user registration
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-10">
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl flex items-center space-x-3">
                <ExclamationTriangleIcon className="h-5 w-5" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-5">
              <InputWrapper label="Full name" icon={UserIcon} errorMessage={fieldErrors.name}>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className={`input ${fieldErrors.name ? 'input-error' : ''}`}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Jane Project Manager"
                />
              </InputWrapper>

              <InputWrapper label="Admin email" icon={ShieldCheckIcon} errorMessage={fieldErrors.email}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className={`input ${fieldErrors.email ? 'input-error' : ''}`}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@company.com"
                />
              </InputWrapper>

              <InputWrapper label="Phone" icon={PhoneIcon} errorMessage={fieldErrors.phone}>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="input"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Optional contact number"
                />
              </InputWrapper>

              <InputWrapper label="Password" icon={KeyIcon} errorMessage={fieldErrors.password}>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className={`input pr-12 ${fieldErrors.password ? 'input-error' : ''}`}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Secure admin password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 px-4 flex items-center text-text-muted"
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
              </InputWrapper>

              <InputWrapper label="Confirm password" icon={KeyIcon} errorMessage={fieldErrors.confirmPassword}>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    className={`input pr-12 ${fieldErrors.confirmPassword ? 'input-error' : ''}`}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Retype password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 px-4 flex items-center text-text-muted"
                    onClick={toggleConfirmVisibility}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
              </InputWrapper>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-admin"
            >
              {loading ? 'Generating admin profile...' : 'Create admin account'}
            </button>

            <p className="text-center text-sm text-text-secondary">
              Already have an admin seat?{' '}
              <Link to="/admin/login" className="text-brand-primary font-semibold">
                Sign in here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
});

AdminRegister.displayName = 'AdminRegister';

export default AdminRegister;
