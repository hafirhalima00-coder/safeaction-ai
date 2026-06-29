'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'indigo' | 'green' | 'red' | 'amber' | 'blue';
}

const colorMap = {
  indigo: {
    bg: 'bg-gradient-to-br from-[#6366f1]/20 to-[#6366f1]/5',
    icon: 'text-[#a78bfa]',
    glow: 'shadow-[#6366f1]/10',
  },
  green: {
    bg: 'bg-gradient-to-br from-[#22c55e]/20 to-[#22c55e]/5',
    icon: 'text-[#22c55e]',
    glow: 'shadow-[#22c55e]/10',
  },
  red: {
    bg: 'bg-gradient-to-br from-[#ef4444]/20 to-[#ef4444]/5',
    icon: 'text-[#ef4444]',
    glow: 'shadow-[#ef4444]/10',
  },
  amber: {
    bg: 'bg-gradient-to-br from-[#f59e0b]/20 to-[#f59e0b]/5',
    icon: 'text-[#f59e0b]',
    glow: 'shadow-[#f59e0b]/10',
  },
  blue: {
    bg: 'bg-gradient-to-br from-[#3b82f6]/20 to-[#3b82f6]/5',
    icon: 'text-[#3b82f6]',
    glow: 'shadow-[#3b82f6]/10',
  },
};

export function StatsCard({ title, value, subtitle, icon, trend, color = 'indigo' }: StatsCardProps) {
  const colors = colorMap[color];

  return (
    <Card className={cn('border-[#27272a] bg-[#18181b]', colors.glow, 'glow-sm')}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-[#71717a]">{title}</CardTitle>
        <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', colors.bg)}>
          <span className={colors.icon}>{icon}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-[#fafafa] tracking-tight">{value}</span>
          {trend && (
            <span
              className={cn(
                'flex items-center text-sm font-medium',
                trend.isPositive ? 'text-[#22c55e]' : 'text-[#ef4444]'
              )}
            >
              {trend.isPositive ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m18 15-6-6-6 6" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              )}
              {Math.abs(trend.value)}%
            </span>
          )}
        </div>
        {subtitle && <p className="mt-1.5 text-sm text-[#71717a]">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}