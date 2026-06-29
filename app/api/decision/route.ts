export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { generateId } from '@/lib/utils';
import { DecisionReport, DecisionRecord, DecisionType } from '@/lib/types';
import {
  analyzeIntent,
  evaluatePolicies,
  checkPermissions,
  calculateRisk,
  calculateConfidence,
  makeFinalDecision,
} from '@/lib/decision';

// In-memory storage for decisions (for serverless)
const decisions: DecisionRecord[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, actionRequest } = body;

    if (!userId || !actionRequest) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, actionRequest' },
        { status: 400 }
      );
    }

    // Run all decision engine modules in sequence
    const intent = analyzeIntent(actionRequest);
    const policy = evaluatePolicies(intent);
    const permission = checkPermissions(userId, intent);
    const risk = calculateRisk(intent);
    const confidence = calculateConfidence(intent, policy, permission, risk);
    const final = makeFinalDecision(policy, permission, risk, confidence);

    const report: DecisionReport = {
      id: generateId(),
      timestamp: new Date(),
      userId,
      intent,
      policy,
      permission,
      risk,
      confidence,
      final,
    };

    // Save to in-memory storage
    const decisionRecord: DecisionRecord = {
      id: report.id,
      userId: report.userId,
      userName: 'User',
      rawInput: actionRequest,
      actionType: intent.actionType,
      target: intent.target || '',
      decision: final.decision as DecisionType,
      confidence: confidence.score,
      riskScore: risk.score,
      violatedPolicies: policy.violatedPolicies.map((p) => p.name),
      createdAt: new Date(),
    };

    decisions.push(decisionRecord);

    return NextResponse.json({ report });
  } catch (error) {
    console.error('Decision API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'SafeAction AI Decision Engine API' });
}