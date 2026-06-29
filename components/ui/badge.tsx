import * as React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
        {
          'bg-[#6366f1]/20 text-[#a78bfa]': variant === 'default',
          'bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30': variant === 'success',
          'bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30': variant === 'warning',
          'bg-[#ef4444]/15 text-[#ef4444] border border-[#ef4444]/30': variant === 'danger',
          'bg-[#3b82f6]/15 text-[#3b82f6] border border-[#3b82f6]/30': variant === 'info',
        },
        className
      )}
      {...props}
    />
  );
}