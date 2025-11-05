import { InputHTMLAttributes } from 'react';
import { cn } from '@/styles/theme';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ 
  label, 
  error,
  className = '', 
  ...props 
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="font-pixel text-yellow-400 text-sm block mb-2">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full px-4 py-2 rounded-lg font-pixel text-sm',
          'bg-purple-800/50 text-yellow-400',
          'border-2 border-purple-500/50',
          'focus:border-yellow-400 outline-none',
          'transition duration-200',
          error && 'border-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="font-pixel text-red-400 text-xs mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
