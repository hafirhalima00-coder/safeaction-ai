import * as React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
          {
            'bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white hover:shadow-lg hover:shadow-[#6366f1]/25':
              variant === 'default',
            'border border-[#27272a] bg-transparent text-[#a1a1aa] hover:bg-[#18181b] hover:text-[#fafafa] hover:border-[#3f3f46]':
              variant === 'outline',
            'bg-transparent text-[#71717a] hover:bg-[#18181b] hover:text-[#fafafa]':
              variant === 'ghost',
            'bg-[#ef4444] text-white hover:bg-[#dc2626] hover:shadow-lg hover:shadow-[#ef4444]/25':
              variant === 'danger',
            'bg-[#22c55e] text-white hover:bg-[#16a34a] hover:shadow-lg hover:shadow-[#22c55e]/25':
              variant === 'success',
            'h-10 px-4 py-2': size === 'default',
            'h-8 rounded-md px-3 text-xs': size === 'sm',
            'h-11 rounded-lg px-6': size === 'lg',
            'h-9 w-9': size === 'icon',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';