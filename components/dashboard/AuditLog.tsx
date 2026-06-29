'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DecisionRecord } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { getDecisionLabel } from '@/lib/decision';
import { cn } from '@/lib/utils';

interface AuditLogProps {
  decisions: DecisionRecord[];
}

export function AuditLog({ decisions }: AuditLogProps) {
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDecisions = decisions.filter((d) => {
    const matchesFilter = filter === 'all' || d.decision === filter;
    const matchesSearch = d.rawInput.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.actionType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getDecisionVariant = (decision: string) => {
    switch (decision) {
      case 'ALLOW': return 'success';
      case 'DENY': return 'danger';
      case 'REQUIRE_HUMAN_APPROVAL': return 'warning';
      default: return 'default';
    }
  };

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case 'ALLOW':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--success)]">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        );
      case 'DENY':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--danger)]">
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6" />
            <path d="m9 9 6 6" />
          </svg>
        );
      case 'REQUIRE_HUMAN_APPROVAL':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--warning)]">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Audit Log</CardTitle>
          <span className="text-xs text-[var(--foreground-muted)]">
            {filteredDecisions.length} entries
          </span>
        </div>

        {/* Search and Filter */}
        <div className="mt-3 flex gap-2">
          <div className="relative flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              placeholder="Search decisions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] py-2 pl-9 pr-3 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:border-[var(--accent)] focus:outline-none"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
          >
            <option value="all">All</option>
            <option value="ALLOW">Allowed</option>
            <option value="DENY">Denied</option>
            <option value="REQUIRE_HUMAN_APPROVAL">Pending</option>
          </select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-1 max-h-[400px] overflow-y-auto">
          {filteredDecisions.length === 0 ? (
            <div className="py-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-[var(--foreground-muted)] mb-3">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
              <p className="text-sm text-[var(--foreground-muted)]">No decisions found</p>
            </div>
          ) : (
            filteredDecisions.map((decision, index) => (
              <div
                key={decision.id}
                className={cn(
                  'flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-[var(--background-tertiary)] list-item-animate',
                  index === 0 && 'bg-[var(--background-tertiary)]/50'
                )}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--background-tertiary)]">
                  {getDecisionIcon(decision.decision)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[var(--foreground)] truncate">
                      {decision.actionType.replace(/_/g, ' ')}
                    </span>
                    <Badge variant={getDecisionVariant(decision.decision)} className="shrink-0">
                      {getDecisionLabel(decision.decision as 'ALLOW' | 'DENY' | 'REQUIRE_HUMAN_APPROVAL')}
                    </Badge>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-[var(--foreground-muted)]">
                    <span>{decision.target || 'No target'}</span>
                    <span>•</span>
                    <span>{formatDate(decision.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="flex flex-col items-end">
                    <span className="text-[var(--foreground-muted)]">Confidence</span>
                    <span className={cn(
                      'font-medium',
                      decision.confidence >= 70 ? 'text-[var(--success)]' :
                      decision.confidence >= 40 ? 'text-[var(--warning)]' : 'text-[var(--danger)]'
                    )}>
                      {decision.confidence}%
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[var(--foreground-muted)]">Risk</span>
                    <span className={cn(
                      'font-medium',
                      decision.riskScore <= 30 ? 'text-[var(--success)]' :
                      decision.riskScore <= 60 ? 'text-[var(--warning)]' : 'text-[var(--danger)]'
                    )}>
                      {decision.riskScore}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}