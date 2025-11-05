import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/styles/theme';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div 
      className={cn(
        'bg-purple-900/40 backdrop-blur-sm rounded-lg border-2 border-purple-500/50',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', ...props }: CardProps) {
  return (
    <div 
      className={cn(
        'bg-gradient-to-r from-purple-800 to-purple-900 p-4 border-b-2 border-yellow-400/50',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardBody({ children, className = '', ...props }: CardProps) {
  return (
    <div 
      className={cn('p-6', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '', ...props }: CardProps) {
  return (
    <div 
      className={cn(
        'p-4 border-t-2 border-purple-500/30',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
