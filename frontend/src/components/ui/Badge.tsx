import { HTMLAttributes } from 'react';
import { cn } from '@/styles/theme';
import { typeColors } from '@/utils/typeColors';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'default' | 'type';
  type?: string;
  size?: 'xs' | 'sm' | 'md';
}

export default function Badge({ 
  children, 
  variant = 'default',
  type,
  size = 'sm',
  className = '',
  ...props 
}: BadgeProps) {
  const sizes = {
    xs: 'text-[7px] px-1.5 py-0.5',
    sm: 'text-[9px] px-2 py-0.5',
    md: 'text-xs px-3 py-1',
  };

  const variants = {
    default: 'bg-purple-600 text-white',
    type: type ? typeColors[type as keyof typeof typeColors] || 'bg-gray-500' : 'bg-gray-500',
  };

  return (
    <span
      className={cn(
        'font-pixel rounded uppercase shadow-lg inline-block',
        sizes[size],
        variants[variant],
        'text-white',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
