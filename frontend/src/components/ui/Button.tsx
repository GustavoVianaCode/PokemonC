import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn, spacing } from '@/styles/theme';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'success' | 'danger' | 'info' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export default function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '',
  disabled,
  ...props 
}: ButtonProps) {
  const baseStyles = 'font-pixel rounded-lg shadow-lg transform transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100';
  
  const variants = {
    primary: 'bg-yellow-400 hover:bg-yellow-500 text-purple-900',
    success: 'bg-green-500 hover:bg-green-600 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    info: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-purple-600 hover:bg-purple-700 text-white',
  };

  const sizes = {
    sm: spacing.button.sm,
    md: spacing.button.md,
    lg: spacing.button.lg,
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
