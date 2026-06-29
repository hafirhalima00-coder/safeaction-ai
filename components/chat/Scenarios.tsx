'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Scenario {
  id: string;
  title: string;
  description: string;
  action: string;
  expectedDecision: string;
  risk: string;
  tags: string[];
}

const scenarios: Scenario[] = [
  {
    id: '1',
    title: 'Customer Data Deletion',
    description: 'GDPR compliance requires approval for deleting customer data',
    action: 'Delete customer John Doe',
    expectedDecision: 'REQUIRE_HUMAN_APPROVAL',
    risk: 'CRITICAL',
    tags: ['GDPR', 'Customer Data'],
  },
  {
    id: '2',
    title: 'Large Refund Processing',
    description: 'Refunds over $1000 require manager approval',
    action: 'Send refund of $5000',
    expectedDecision: 'DENY',
    risk: 'CRITICAL',
    tags: ['Finance', 'Refund'],
  },
  {
    id: '3',
    title: 'Marketing Campaign',
    description: 'Marketing emails need customer opt-in verification',
    action: 'Send marketing email to all users',
    expectedDecision: 'REQUIRE_HUMAN_APPROVAL',
    risk: 'MEDIUM',
    tags: ['Compliance', 'Email'],
  },
  {
    id: '4',
    title: 'Data Export',
    description: 'Regular data exports are logged but allowed',
    action: 'Export CRM data to CSV',
    expectedDecision: 'ALLOW',
    risk: 'LOW',
    tags: ['Audit', 'Export'],
  },
  {
    id: '5',
    title: 'Pricing Modification',
    description: 'Price changes require finance team approval',
    action: 'Modify pricing for all plans',
    expectedDecision: 'REQUIRE_HUMAN_APPROVAL',
    risk: 'CRITICAL',
    tags: ['Finance', 'Pricing'],
  },
  {
    id: '6',
    title: 'Subscription Downgrade',
    description: 'Downgrades require user confirmation',
    action: 'Change subscription from Pro to Free',
    expectedDecision: 'ALLOW',
    risk: 'MEDIUM',
    tags: ['Subscription', 'User'],
  },
  {
    id: '7',
    title: 'Bulk User Delete',
    description: 'Bulk operations need manager approval',
    action: 'Delete all inactive users',
    expectedDecision: 'REQUIRE_HUMAN_APPROVAL',
    risk: 'HIGH',
    tags: ['Bulk', 'User'],
  },
  {
    id: '8',
    title: 'Sensitive Data Access',
    description: 'Viewing sensitive data requires elevated permissions',
    action: 'View customer credit card numbers',
    expectedDecision: 'DENY',
    risk: 'HIGH',
    tags: ['Security', 'PII'],
  },
];

interface ScenariosProps {
  onSelect: (action: string) => void;
}

export function Scenarios({ onSelect }: ScenariosProps) {
  const getDecisionVariant = (decision: string) => {
    switch (decision) {
      case 'ALLOW': return 'success';
      case 'DENY': return 'danger';
      case 'REQUIRE_HUMAN_APPROVAL': return 'warning';
      default: return 'default';
    }
  };

  const getRiskVariant = (risk: string) => {
    switch (risk) {
      case 'CRITICAL': return 'danger';
      case 'HIGH': return 'warning';
      case 'MEDIUM': return 'info';
      case 'LOW': return 'success';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--foreground)]">Sample Scenarios</h3>
        <span className="text-xs text-[var(--foreground-muted)]">{scenarios.length} scenarios</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {scenarios.map((scenario, index) => (
          <button
            key={scenario.id}
            onClick={() => onSelect(scenario.action)}
            className={cn(
              'group relative flex flex-col items-start rounded-lg border border-[var(--border)] bg-[var(--card-bg)] p-4 text-left transition-all duration-200 card-hover',
              'hover:border-[var(--accent)]/50 hover:shadow-md'
            )}
          >
            {/* Index indicator */}
            <span className="absolute right-3 top-3 text-xs font-medium text-[var(--foreground-muted)] opacity-0 group-hover:opacity-100 transition-opacity">
              #{index + 1}
            </span>

            <h4 className="text-sm font-semibold text-[var(--foreground)]">
              {scenario.title}
            </h4>
            <p className="mt-1 text-xs text-[var(--foreground-muted)] line-clamp-2">
              {scenario.description}
            </p>

            {/* Action preview */}
            <div className="mt-3 w-full rounded bg-[var(--background-tertiary)] px-2 py-1.5">
              <code className="text-xs text-[var(--accent)] font-mono">
                "{scenario.action}"
              </code>
            </div>

            {/* Tags and expected decision */}
            <div className="mt-3 flex w-full items-center justify-between">
              <div className="flex gap-1">
                {scenario.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[var(--background-tertiary)] px-1.5 py-0.5 text-[10px] text-[var(--foreground-secondary)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Badge variant={getRiskVariant(scenario.risk)} className="text-[10px]">
                  {scenario.risk}
                </Badge>
                <Badge variant={getDecisionVariant(scenario.expectedDecision)} className="text-[10px]">
                  {scenario.expectedDecision.replace(/_/g, ' ')}
                </Badge>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}