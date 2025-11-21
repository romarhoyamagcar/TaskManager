import React, { memo } from 'react';

const LoadingSpinner = memo(({ 
  size = 'md', 
  className = '', 
  text = 'Loading...',
  showText = true,
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const spinnerContent = (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Elegant spinner with glassmorphism */}
      <div className="relative">
        <div className={`${sizeClasses[size]} rounded-full border-4 border-glass-sky animate-spin`}
             style={{
               borderTopColor: '#0EA5E9',
               borderRightColor: '#38BDF8',
               animationDuration: '1s'
             }}
             aria-hidden="true"
        />
        <div className={`absolute inset-0 ${sizeClasses[size]} rounded-full bg-glass-sky backdrop-blur-sm opacity-20 animate-pulse`} />
      </div>
      
      {showText && (
        <div className="text-center space-y-2">
          <p className={`${textSizeClasses[size]} font-semibold text-sky-blue-darker animate-pulse`}>
            {text}
          </p>
          <div className="flex items-center justify-center space-x-1">
            <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-sky-blue-lighter via-white to-sky-blue-light flex items-center justify-center z-50">
        <div className="bg-glass-light backdrop-blur-2xl rounded-3xl shadow-2xl border-2 border-glass p-12">
          {spinnerContent}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`} role="status" aria-label="Loading">
      {spinnerContent}
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;
