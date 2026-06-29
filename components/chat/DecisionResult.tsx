'use client';

import React, { useState } from 'react';
import { DecisionReport } from '@/lib/types';
import {
  getActionTypeLabel,
  getDecisionLabel,
  getDecisionColor,
  getSeverityLabel,
  getRiskLevelLabel,
  getRiskLevelColor,
  getConfidenceLevel,
  getRoleLabel,
} from '@/lib/decision';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DecisionResultProps {
  report: DecisionReport;
}

export function DecisionResult({ report }: DecisionResultProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['overview'])
  );

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const isExpanded = (section: string) => expandedSections.has(section);
  const decisionColor = getDecisionColor(report.final.decision);

  const getDecisionBg = () => {
    switch (report.final.decision) {
      case 'ALLOW':
        return 'bg-[#22c55e]/10 border-[#22c55e]/30';
      case 'DENY':
        return 'bg-[#ef4444]/10 border-[#ef4444]/30';
      case 'REQUIRE_HUMAN_APPROVAL':
        return 'bg-[#f59e0b]/10 border-[#f59e0b]/30';
      default:
        return 'bg-[#6366f1]/10 border-[#6366f1]/30';
    }
  };

  return (
    <Card className="mt-4 border-[#27272a] bg-[#18181b]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-[#fafafa]">
            Decision Report
          </CardTitle>
          <Badge
            variant={
              report.final.decision === 'ALLOW'
                ? 'success'
                : report.final.decision === 'DENY'
                ? 'danger'
                : 'warning'
            }
            className="text-xs px-2.5 py-0.5"
          >
            {getDecisionLabel(report.final.decision)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Overview Section */}
        <div className="rounded-lg bg-[#09090b] p-4 border border-[#27272a]">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-[#71717a]">Action</span>
              <p className="text-sm font-medium text-[#fafafa]">
                {getActionTypeLabel(report.intent.actionType)}
              </p>
            </div>
            <div>
              <span className="text-xs text-[#71717a]">Target</span>
              <p className="text-sm font-medium text-[#fafafa]">
                {report.intent.target || 'None specified'}
              </p>
            </div>
            <div>
              <span className="text-xs text-[#71717a]">Confidence</span>
              <p className="text-sm font-medium text-[#fafafa]">
                {report.confidence.score}% ({getConfidenceLevel(report.confidence.score)})
              </p>
            </div>
            <div>
              <span className="text-xs text-[#71717a]">Risk Level</span>
              <p className="text-sm font-medium" style={{ color: getRiskLevelColor(report.risk.level) }}>
                {getRiskLevelLabel(report.risk.level)} ({report.risk.score})
              </p>
            </div>
          </div>
        </div>

        {/* Final Reasoning */}
        <div className={cn('rounded-lg border-l-4 p-4', getDecisionBg())}>
          <p className="text-sm text-[#a1a1aa] leading-relaxed">{report.final.reasoning}</p>
        </div>

        {/* Collapsible sections */}
        {[
          { id: 'intent', label: 'Intent Analysis' },
          { id: 'permission', label: 'Permission Check' },
          { id: 'risk', label: 'Risk Assessment' },
          { id: 'policy', label: 'Policy Evaluation' },
          { id: 'confidence', label: 'Confidence Breakdown' },
        ].map(({ id, label }) => (
          <div key={id}>
            <button
              onClick={() => toggleSection(id)}
              className="flex w-full items-center justify-between rounded-lg bg-[#09090b] p-3 text-left transition-colors hover:bg-[#18181b] border border-[#27272a]"
            >
              <span className="text-sm font-medium text-[#fafafa]">{label}</span>
              {isExpanded(id) ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#71717a]">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#71717a]">
                  <path d="m18 15-6-6-6 6" />
                </svg>
              )}
            </button>
            {isExpanded(id) && (
              <div className="mt-1 rounded-lg bg-[#09090b] p-3 text-sm border border-[#27272a] border-t-0">
                {id === 'intent' && (
                  <div className="space-y-1.5">
                    <p className="text-[#a1a1aa]">Detected: {getActionTypeLabel(report.intent.actionType)}</p>
                    {report.intent.target && <p className="text-[#a1a1aa]">Target: {report.intent.target}</p>}
                    <p className="text-[#a1a1aa]">Clarity: {report.intent.confidence}%</p>
                  </div>
                )}
                {id === 'permission' && (
                  <div className="space-y-1.5">
                    <p className="text-[#a1a1aa]">Role: {getRoleLabel(report.permission.role)}</p>
                    <p className={cn('font-medium', report.permission.hasPermission ? 'text-[#22c55e]' : 'text-[#ef4444]')}>
                      {report.permission.hasPermission ? '✓ Has permission' : '✗ Permission denied'}
                    </p>
                    {report.permission.missingPermissions.length > 0 && (
                      <p className="text-[#a1a1aa]">Missing: {report.permission.missingPermissions.join(', ')}</p>
                    )}
                  </div>
                )}
                {id === 'risk' && (
                  <div className="space-y-2">
                    <p className="text-[#fafafa]">
                      Score: <span style={{ color: getRiskLevelColor(report.risk.level) }}>{report.risk.score}/100</span>
                    </p>
                    <p className="text-[#a1a1aa]">Level: {getRiskLevelLabel(report.risk.level)}</p>
                    {report.risk.factors.map((factor, idx) => (
                      <p key={idx} className="text-xs text-[#71717a]">
                        • {factor.name}: {factor.impact > 0 ? '+' : ''}{factor.impact}
                      </p>
                    ))}
                  </div>
                )}
                {id === 'policy' && (
                  <div>
                    {report.policy.violatedPolicies.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-[#ef4444] font-medium">Violated Policies:</p>
                        {report.policy.violatedPolicies.map((policy) => (
                          <div key={policy.id} className="rounded bg-[#18181b] p-2 border border-[#27272a]">
                            <p className="text-[#fafafa] text-sm">{policy.name}</p>
                            <p className="text-xs text-[#71717a]">{policy.description}</p>
                            <Badge
                              variant={
                                policy.severity === 'critical'
                                  ? 'danger'
                                  : policy.severity === 'high'
                                  ? 'warning'
                                  : policy.severity === 'medium'
                                  ? 'info'
                                  : 'success'
                              }
                              className="mt-1 text-xs"
                            >
                              {getSeverityLabel(policy.severity)}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[#22c55e]">✓ No policy violations</p>
                    )}
                  </div>
                )}
                {id === 'confidence' && (
                  <div className="space-y-1">
                    {report.confidence.factors.map((factor, idx) => (
                      <div key={idx} className="flex items-center justify-between py-1 border-b border-[#27272a] last:border-0">
                        <span className="text-[#a1a1aa]">{factor.name}</span>
                        <span className="text-[#fafafa]">{factor.score}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}