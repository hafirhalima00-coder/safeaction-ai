'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Policy, Severity } from '@/lib/types';

interface PolicyCardProps {
  policy: Policy;
  isViolated?: boolean;
  onClick?: () => void;
}

export function PolicyCard({ policy, isViolated = false, onClick }: PolicyCardProps) {
  const getSeverityVariant = (severity: Severity) => {
    switch (severity) {
      case 'critical': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getSeverityColor = (severity: Severity) => {
    switch (severity) {
      case 'critical': return 'border-l-[#ef4444]';
      case 'high': return 'border-l-[#f59e0b]';
      case 'medium': return 'border-l-[#3b82f6]';
      case 'low': return 'border-l-[#22c55e]';
      default: return 'border-l-[#71717a]';
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-lg border border-l-4 bg-[var(--card-bg)] p-4 cursor-pointer transition-all duration-200 card-hover',
        getSeverityColor(policy.severity),
        isViolated ? 'ring-1 ring-[var(--danger)]/30' : ''
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-[var(--foreground)] truncate">
            {policy.name}
          </h4>
          <p className="mt-1 text-xs text-[var(--foreground-muted)] line-clamp-2">
            {policy.description}
          </p>
          {policy.threshold && (
            <p className="mt-2 text-xs font-medium text-[var(--accent)]">
              Threshold: ${policy.threshold}
            </p>
          )}
        </div>
        <Badge variant={getSeverityVariant(policy.severity)} className="shrink-0">
          {policy.severity}
        </Badge>
      </div>

      {policy.actionTypes.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {policy.actionTypes.slice(0, 3).map((type) => (
            <span
              key={type}
              className="rounded-full bg-[var(--background-tertiary)] px-2 py-0.5 text-[10px] text-[var(--foreground-secondary)]"
            >
              {type.replace(/_/g, ' ')}
            </span>
          ))}
          {policy.actionTypes.length > 3 && (
            <span className="text-[10px] text-[var(--foreground-muted)]">
              +{policy.actionTypes.length - 3} more
            </span>
          )}
        </div>
      )}

      {isViolated && (
        <div className="mt-3 flex items-center gap-1.5 text-[var(--danger)]">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <span className="text-xs font-medium">Policy Violated</span>
        </div>
      )}
    </div>
  );
}

interface PolicyListProps {
  policies: Policy[];
  violatedIds?: string[];
  maxDisplay?: number;
}

export function PolicyList({ policies, violatedIds = [], maxDisplay = 5 }: PolicyListProps) {
  const displayPolicies = policies.slice(0, maxDisplay);
  const remainingCount = policies.length - maxDisplay;

  return (
    <div className="space-y-2">
      {displayPolicies.map((policy) => (
        <PolicyCard
          key={policy.id}
          policy={policy}
          isViolated={violatedIds.includes(policy.id)}
        />
      ))}
      {remainingCount > 0 && (
        <p className="text-xs text-[var(--foreground-muted)] text-center py-2">
          +{remainingCount} more policies
        </p>
      )}
    </div>
  );
}