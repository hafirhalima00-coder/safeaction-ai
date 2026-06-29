'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { DecisionReport } from '@/lib/types';

interface TimelineStep {
  id: string;
  label: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  detail?: string;
  icon: React.ReactNode;
}

interface DecisionTimelineProps {
  report: DecisionReport;
}

export function DecisionTimeline({ report }: DecisionTimelineProps) {
  const steps: TimelineStep[] = [
    {
      id: 'intent',
      label: 'Intent Analysis',
      status: 'completed',
      detail: report.intent.actionType.replace(/_/g, ' '),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      ),
    },
    {
      id: 'policy',
      label: 'Policy Check',
      status: report.policy.violatedPolicies.length > 0 ? 'failed' : 'completed',
      detail: `${report.policy.violatedPolicies.length} violations`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        </svg>
      ),
    },
    {
      id: 'permission',
      label: 'Permissions',
      status: report.permission.hasPermission ? 'completed' : 'failed',
      detail: report.permission.role,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
    },
    {
      id: 'risk',
      label: 'Risk Assessment',
      status: 'completed',
      detail: `${report.risk.score}/100 (${report.risk.level})`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
      ),
    },
    {
      id: 'confidence',
      label: 'Confidence',
      status: report.confidence.score >= 50 ? 'completed' : 'failed',
      detail: `${report.confidence.score}%`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        </svg>
      ),
    },
    {
      id: 'decision',
      label: 'Final Decision',
      status: 'completed',
      detail: report.final.decision.replace(/_/g, ' '),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
  ];

  const getStatusStyles = (status: TimelineStep['status']) => {
    switch (status) {
      case 'completed':
        return {
          bg: 'bg-[var(--success)]',
          text: 'text-[var(--success)]',
          border: 'border-[var(--success)]',
          ring: 'ring-[var(--success)]/20',
        };
      case 'failed':
        return {
          bg: 'bg-[var(--danger)]',
          text: 'text-[var(--danger)]',
          border: 'border-[var(--danger)]',
          ring: 'ring-[var(--danger)]/20',
        };
      case 'processing':
        return {
          bg: 'bg-[var(--accent)]',
          text: 'text-[var(--accent)]',
          border: 'border-[var(--accent)]',
          ring: 'ring-[var(--accent)]/20',
        };
      default:
        return {
          bg: 'bg-[var(--foreground-muted)]',
          text: 'text-[var(--foreground-muted)]',
          border: 'border-[var(--border)]',
          ring: 'ring-transparent',
        };
    }
  };

  return (
    <div className="space-y-0">
      {steps.map((step, index) => {
        const styles = getStatusStyles(step.status);
        const isLast = index === steps.length - 1;

        return (
          <div key={step.id} className="flex gap-4">
            {/* Timeline line and dot */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'relative flex h-8 w-8 items-center justify-center rounded-full border-2 bg-[var(--background)] transition-all duration-300',
                  styles.border,
                  step.status === 'processing' && 'timeline-dot-pulse'
                )}
              >
                <span className={styles.text}>{step.icon}</span>
                {step.status === 'completed' && (
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-[var(--success)] ring-2 ring-[var(--background)]" />
                )}
                {step.status === 'failed' && (
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-[var(--danger)] ring-2 ring-[var(--background)]" />
                )}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    'w-0.5 flex-1',
                    step.status === 'completed' ? 'bg-[var(--success)]' : 'bg-[var(--border)]'
                  )}
                />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-6">
              <div className="flex items-center gap-2">
                <span className={cn('text-sm font-medium', styles.text)}>
                  {step.label}
                </span>
                {step.status === 'failed' && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--danger)]">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                )}
              </div>
              <p className="text-xs text-[var(--foreground-muted)] mt-0.5">
                {step.detail}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}