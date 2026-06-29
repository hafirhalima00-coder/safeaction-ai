'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { RiskLevel } from '@/lib/types';

interface RiskGaugeProps {
  score: number;
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function RiskGauge({ score, level, size = 'md', showLabel = true }: RiskGaugeProps) {
  const sizes = {
    sm: { width: 60, stroke: 4, text: 'text-sm', label: 'text-xs' },
    md: { width: 100, stroke: 6, text: 'text-xl', label: 'text-xs' },
    lg: { width: 140, stroke: 8, text: 'text-3xl', label: 'text-sm' },
  };

  const { width, stroke, text, label } = sizes[size];
  const radius = (width - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getLevelColor = () => {
    switch (level) {
      case 'LOW': return 'text-[#22c55e]';
      case 'MEDIUM': return 'text-[#3b82f6]';
      case 'HIGH': return 'text-[#f59e0b]';
      case 'CRITICAL': return 'text-[#ef4444]';
      default: return 'text-[#71717a]';
    }
  };

  const getStrokeColor = () => {
    switch (level) {
      case 'LOW': return '#22c55e';
      case 'MEDIUM': return '#3b82f6';
      case 'HIGH': return '#f59e0b';
      case 'CRITICAL': return '#ef4444';
      default: return '#71717a';
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width, height: width }}>
        <svg
          className="transform -rotate-90"
          width={width}
          height={width}
          viewBox={`0 0 ${width} ${width}`}
        >
          {/* Background circle */}
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            fill="none"
            stroke="var(--border-subtle)"
            strokeWidth={stroke}
          />
          {/* Progress circle */}
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            fill="none"
            stroke={getStrokeColor()}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out animate-risk-gauge"
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn(text, 'font-bold', getLevelColor())}>
            {score}
          </span>
        </div>
      </div>
      {showLabel && (
        <span className={cn(label, 'font-medium', getLevelColor())}>
          {level}
        </span>
      )}
    </div>
  );
}