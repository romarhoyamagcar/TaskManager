import React, { useState, useCallback, memo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Navbar = memo(() => {
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  }, [logout, navigate]);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const isActivePath = useCallback((path) => {
    return location.pathname === path;
  }, [location.pathname]);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Tasks', href: '/tasks', icon: ClipboardDocumentListIcon },
    { name: 'Profile', href: '/profile', icon: UserIcon },
  ];

  const adminNavigation = [
    { name: 'Admin Dashboard', href: '/admin', icon: ShieldCheckIcon },
    { name: 'Users', href: '/admin/users', icon: UserIcon },
    { name: 'All Tasks', href: '/admin/tasks', icon: ClipboardDocumentListIcon },
  ];

  const allNavigation = isAdmin ? [...navigation, ...adminNavigation] : navigation;

  const NavLink = memo(({ item, onClick }) => {
    const isActive = isActivePath(item.href);
    return (
      <Link
        to={item.href}
        onClick={onClick}
        className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
        aria-current={isActive ? 'page' : undefined}
      >
        <item.icon className="h-5 w-5 mr-3" />
        {item.name}
      </Link>
    );
  });

  NavLink.displayName = 'NavLink';

  return (
    <nav className="bg-glass-light backdrop-blur-2xl shadow-2xl sticky top-0 z-50 border-b-2 border-glass-sky">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              to="/dashboard" 
              className="flex-shrink-0 flex items-center hover:scale-105 transition-all duration-300"
              onClick={closeMobileMenu}
            >
              <div className="bg-white p-2 rounded-2xl shadow-lg border-2 border-glass-sky mr-3">
                <img 
                  src="/logo.png" 
                  alt="SMART PERSONAL ORGANIZE" 
                  className="h-8 w-8 rounded-xl"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg leading-tight text-sky-blue-darker">SMART PERSONAL</span>
                <span className="font-display font-semibold text-sm leading-tight text-brand-primary">ORGANIZE</span>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {allNavigation.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </div>
          
          {/* User menu and mobile menu button */}
          <div className="flex items-center space-x-4">
            {/* Task Metrics Counters */}
            <div className="hidden lg:flex items-center space-x-3">
              <div className="metric-counter">
                +0
              </div>
              <div className="metric-counter-rised border-2 border-success">
                +5
              </div>
              <div className="metric-counter-fallen border-2 border-error">
                +3
              </div>
            </div>
            
            <div className="hidden md:flex md:items-center md:space-x-3">
              <div className="flex items-center text-text-primary text-sm bg-glass-sky backdrop-blur-lg px-4 py-2.5 rounded-2xl shadow-lg border-2 border-glass-sky">
                <UserIcon className="h-4 w-4 mr-2 text-brand-primary" />
                <span className="font-medium truncate max-w-[120px]">
                  {currentUser?.name || 'User'}
                </span>
                {isAdmin && (
                  <span className="ml-2 px-2 py-1 bg-brand-primary bg-opacity-20 rounded-full text-xs text-brand-primary font-medium">
                    Admin
                  </span>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-ghost text-brand-primary hover:bg-glass-sky border-2 border-glass-sky"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
            
            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2.5 rounded-2xl text-brand-primary hover:bg-glass-sky hover:scale-110 transition-all duration-300 shadow-md"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t-2 border-glass-sky animate-slide-down bg-glass-sky backdrop-blur-2xl rounded-b-3xl shadow-2xl">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {allNavigation.map((item) => (
                <NavLink key={item.href} item={item} onClick={closeMobileMenu} />
              ))}
              
              <div className="border-t-2 border-glass-sky pt-4 mt-4">
                <div className="px-3 py-2 text-text-primary text-sm">
                  <div className="flex items-center">
                    <UserIcon className="h-4 w-4 mr-2 text-brand-primary" />
                    <span className="font-medium truncate">
                      {currentUser?.name || 'User'}
                    </span>
                    {isAdmin && (
                      <span className="ml-2 px-2 py-1 bg-brand-primary bg-opacity-20 rounded-full text-xs text-brand-primary font-medium">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full mx-3 btn btn-ghost text-brand-primary hover:bg-glass-sky border-2 border-glass-sky"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
