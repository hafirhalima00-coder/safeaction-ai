import * as React from 'react';
import { cn, getInitials } from '@/lib/utils';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
}

export function Avatar({ className, name, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6]',
        className
      )}
      {...props}
    >
      <span className="flex h-full w-full items-center justify-center text-sm font-medium text-white">
        {getInitials(name)}
      </span>
    </div>
  );
}