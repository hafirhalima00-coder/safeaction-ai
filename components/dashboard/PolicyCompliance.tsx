'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PolicyComplianceProps {
  complianceRate: number;
  policyCounts?: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export function PolicyCompliance({ complianceRate, policyCounts }: PolicyComplianceProps) {
  // Default counts if not provided
  const counts = policyCounts || { critical: 2, high: 3, medium: 2, low: 1 };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-[#ef4444]';
      case 'high':
        return 'text-[#f59e0b]';
      case 'medium':
        return 'text-[#3b82f6]';
      case 'low':
        return 'text-[#22c55e]';
      default:
        return 'text-[#a1a1aa]';
    }
  };

  return (
    <Card className="border-[#27272a] bg-[#1a1a21]">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-[#f4f4f5]">Policy Compliance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          {/* Progress Ring */}
          <div className="relative flex h-24 w-24 items-center justify-center">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="#27272a"
                strokeWidth="10"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke={complianceRate >= 80 ? '#22c55e' : complianceRate >= 50 ? '#f59e0b' : '#ef4444'}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${(complianceRate / 100) * 264} 264`}
                className="transition-all duration-1000"
              />
            </svg>
            <span className="absolute text-2xl font-bold text-[#f4f4f5]">{complianceRate}%</span>
          </div>

          {/* Policy breakdown */}
          <div className="flex flex-1 flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#ef4444]" />
                <span className="text-sm text-[#a1a1aa]">Critical</span>
              </div>
              <span className="text-sm font-medium text-[#f4f4f5]">{counts.critical} policies</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#f59e0b]" />
                <span className="text-sm text-[#a1a1aa]">High</span>
              </div>
              <span className="text-sm font-medium text-[#f4f4f5]">{counts.high} policies</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#3b82f6]" />
                <span className="text-sm text-[#a1a1aa]">Medium</span>
              </div>
              <span className="text-sm font-medium text-[#f4f4f5]">{counts.medium} policies</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
                <span className="text-sm text-[#a1a1aa]">Low</span>
              </div>
              <span className="text-sm font-medium text-[#f4f4f5]">{counts.low} policies</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}