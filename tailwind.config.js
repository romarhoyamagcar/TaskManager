/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sky Blue Glassmorphism Palette
        'sky-blue': '#87CEEB', // Primary sky blue
        'sky-blue-light': '#B0E0F6', // Light sky blue
        'sky-blue-lighter': '#D4F1FF', // Lighter sky blue
        'sky-blue-dark': '#5FA8D3', // Darker sky blue
        'sky-blue-darker': '#4A90B8', // Darkest sky blue
        
        'brand-primary': '#0EA5E9', // Sky blue primary
        'brand-primary-dark': '#0284C7', // Darker sky blue
        'brand-primary-light': '#38BDF8', // Lighter sky blue
        'brand-secondary': '#64748b', // Neutral slate
        'brand-secondary-light': '#94a3b8', // Lighter slate
        
        'text-primary': '#0F172A', // Dark slate for headings
        'text-secondary': '#334155', // Medium slate for body text
        'text-muted': '#64748b', // Light slate for muted text
        
        'bg-primary': '#ffffff', // White background
        'bg-secondary': '#f0f9ff', // Very light sky blue
        'bg-tertiary': '#e0f2fe', // Light sky blue background
        
        'border-light': '#bae6fd', // Light sky blue borders
        'border-medium': '#7dd3fc', // Medium sky blue borders
        
        'success': '#10b981', // Green for success states
        'warning': '#f59e0b', // Amber for warnings
        'error': '#ef4444', // Red for errors
        'info': '#0EA5E9', // Sky blue for info
        
        // Priority colors (standard conventions)
        'priority-high': '#ef4444', // Red
        'priority-medium': '#f59e0b', // Amber  
        'priority-low': '#10b981', // Green
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Roboto', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.05em' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.025em' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      fontWeight: {
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'brand': '0 4px 14px 0 rgba(59, 130, 246, 0.15)',
        'brand-lg': '0 10px 25px -5px rgba(59, 130, 246, 0.25)',
      },
      borderRadius: {
        'none': '0',
        'sm': '0.25rem',      // 4px - Small elements
        'DEFAULT': '0.375rem', // 6px - Default
        'md': '0.5rem',       // 8px - Medium elements
        'lg': '0.75rem',      // 12px - Large elements
        'xl': '1rem',         // 16px - Extra large
        '2xl': '1.5rem',      // 24px - 2X large
        '3xl': '2rem',        // 32px - 3X large
        '4xl': '2.5rem',      // 40px - 4X large
        'full': '9999px',     // Pill shape
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-out': 'fadeOut 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
      // Glassmorphism utilities
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        'glass-gradient-dark': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
      },
      backgroundColor: {
        'glass': 'rgba(255, 255, 255, 0.15)',
        'glass-light': 'rgba(255, 255, 255, 0.25)',
        'glass-lighter': 'rgba(255, 255, 255, 0.1)',
        'glass-dark': 'rgba(135, 206, 235, 0.15)', // Sky blue tint
        'glass-darker': 'rgba(135, 206, 235, 0.25)', // Darker sky blue tint
        'glass-sky': 'rgba(135, 206, 235, 0.2)', // Sky blue glass
        'glass-sky-light': 'rgba(176, 224, 246, 0.3)', // Light sky blue glass
      },
      borderColor: {
        'glass': 'rgba(255, 255, 255, 0.3)',
        'glass-light': 'rgba(255, 255, 255, 0.2)',
        'glass-dark': 'rgba(135, 206, 235, 0.3)', // Sky blue border
        'glass-sky': 'rgba(135, 206, 235, 0.4)', // Sky blue glass border
      },
    },
  },
  plugins: [],
}
