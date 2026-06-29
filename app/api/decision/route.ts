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
import { saveDecision } from '@/lib/db/sqlite';

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
    // Step 1: Analyze intent
    const intent = analyzeIntent(actionRequest);

    // Step 2: Evaluate policies
    const policy = evaluatePolicies(intent);

    // Step 3: Check permissions
    const permission = checkPermissions(userId, intent);

    // Step 4: Calculate risk
    const risk = calculateRisk(intent);

    // Step 5: Calculate confidence
    const confidence = calculateConfidence(intent, policy, permission, risk);

    // Step 6: Make final decision
    const final = makeFinalDecision(policy, permission, risk, confidence);

    // Create the decision report
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

    // Save to database
    const decisionRecord: DecisionRecord = {
      id: report.id,
      userId: report.userId,
      userName: 'User', // Will be populated from user lookup
      rawInput: actionRequest,
      actionType: intent.actionType,
      target: intent.target || '',
      decision: final.decision as DecisionType,
      confidence: confidence.score,
      riskScore: risk.score,
      violatedPolicies: policy.violatedPolicies.map((p) => p.name),
      createdAt: new Date(),
    };

    saveDecision(decisionRecord);

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