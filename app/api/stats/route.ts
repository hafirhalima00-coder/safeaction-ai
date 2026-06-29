export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

// In-memory storage for stats (for serverless)
const decisions: Array<{
  id: string;
  userId: string;
  userName: string;
  rawInput: string;
  actionType: string;
  target: string;
  decision: string;
  confidence: number;
  riskScore: number;
  violatedPolicies: string[];
  createdAt: Date;
}> = [];

const mockCurrentUser = { name: 'Sarah Chen', role: 'admin' };

export async function GET() {
  try {
    const totalDecisions = decisions.length;
    const todayDecisions = decisions.filter(d => {
      const today = new Date().toDateString();
      return new Date(d.createdAt).toDateString() === today;
    }).length;

    const allowCount = decisions.filter(d => d.decision === 'ALLOW').length;
    const denyCount = decisions.filter(d => d.decision === 'DENY').length;
    const approvalRequiredCount = decisions.filter(d => d.decision === 'REQUIRE_HUMAN_APPROVAL').length;

    const avgConfidence = decisions.length > 0
      ? Math.round(decisions.reduce((acc, d) => acc + d.confidence, 0) / decisions.length)
      : 75;

    const avgRiskScore = decisions.length > 0
      ? Math.round(decisions.reduce((acc, d) => acc + d.riskScore, 0) / decisions.length)
      : 45;

    const compliantCount = decisions.filter(d => d.violatedPolicies.length === 0).length;
    const complianceRate = decisions.length > 0
      ? Math.round((compliantCount / decisions.length) * 100)
      : 100;

    return NextResponse.json({
      stats: {
        totalDecisions,
        decisionsToday: todayDecisions,
        allowCount,
        denyCount,
        approvalRequiredCount,
        avgConfidence,
        avgRiskScore,
        complianceRate,
      },
      recentDecisions: decisions.slice(-10).reverse(),
      policiesCount: 8,
      currentUser: mockCurrentUser,
    });
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}