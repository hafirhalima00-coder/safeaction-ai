'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DecisionRecord } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { getDecisionLabel } from '@/lib/decision';

interface DecisionHistoryProps {
  decisions: DecisionRecord[];
}

export function DecisionHistory({ decisions }: DecisionHistoryProps) {
  const getDecisionVariant = (decision: string) => {
    switch (decision) {
      case 'ALLOW':
        return 'success';
      case 'DENY':
        return 'danger';
      case 'REQUIRE_HUMAN_APPROVAL':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Card className="border-[#27272a] bg-[#1a1a21]">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-[#f4f4f5]">Recent Decisions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {decisions.length === 0 ? (
            <p className="text-sm text-[#71717a]">No decisions recorded yet.</p>
          ) : (
            decisions.map((decision) => (
              <div
                key={decision.id}
                className="flex items-center justify-between rounded-lg border border-[#27272a] bg-[#121216] p-3 transition-colors hover:border-[#3f3f46]"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-[#f4f4f5]">
                    {decision.actionType.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs text-[#71717a]">
                    {decision.target || 'No target'} • {formatDate(decision.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-[#71717a]">
                      Confidence: {decision.confidence}%
                    </span>
                    <span className="text-xs text-[#71717a]">
                      Risk: {decision.riskScore}
                    </span>
                  </div>
                  <Badge variant={getDecisionVariant(decision.decision)}>
                    {getDecisionLabel(decision.decision as 'ALLOW' | 'DENY' | 'REQUIRE_HUMAN_APPROVAL')}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}