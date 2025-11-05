import { ReactNode } from 'react';
import { cn } from '@/styles/theme';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
}

export default function Modal({ 
  isOpen, 
  onClose, 
  children, 
  className = '',
  maxWidth = '4xl'
}: ModalProps) {
  if (!isOpen) return null;

  const maxWidths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className={cn(
          'bg-purple-900 border-4 border-yellow-400 rounded-lg w-full my-8',
          maxWidths[maxWidth],
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn(
      'bg-gradient-to-r from-purple-800 to-purple-900 p-4 border-b-2 border-yellow-400/50 sticky top-0 z-10',
      className
    )}>
      {children}
    </div>
  );
}

export function ModalBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto', className)}>
      {children}
    </div>
  );
}

export function ModalFooter({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('p-4 border-t-2 border-purple-500/30', className)}>
      {children}
    </div>
  );
}
