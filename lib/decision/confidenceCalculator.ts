import { ConfidenceResult, ConfidenceFactor, IntentResult, PolicyResult, PermissionResult, RiskResult } from '../types';

export function calculateConfidence(
  intent: IntentResult,
  policy: PolicyResult,
  permission: PermissionResult,
  risk: RiskResult
): ConfidenceResult {
  const factors: ConfidenceFactor[] = [];
  let totalWeight = 0;
  let weightedScore = 0;

  // Factor 1: Intent Clarity (weight: 30%)
  const intentClarityScore = intent.confidence;
  const intentClarityFactor: ConfidenceFactor = {
    name: 'Intent Clarity',
    weight: 30,
    score: intentClarityScore,
    contribution: (intentClarityScore * 30) / 100,
  };
  factors.push(intentClarityFactor);
  totalWeight += 30;
  weightedScore += intentClarityScore * 30;

  // Factor 2: Policy Compliance (weight: 25%)
  const policyScore = calculatePolicyScore(policy);
  const policyFactor: ConfidenceFactor = {
    name: 'Policy Compliance',
    weight: 25,
    score: policyScore,
    contribution: (policyScore * 25) / 100,
  };
  factors.push(policyFactor);
  totalWeight += 25;
  weightedScore += policyScore * 25;

  // Factor 3: Permission Clarity (weight: 25%)
  const permissionScore = permission.hasPermission ? 100 : 20;
  const permissionFactor: ConfidenceFactor = {
    name: 'Permission Clarity',
    weight: 25,
    score: permissionScore,
    contribution: (permissionScore * 25) / 100,
  };
  factors.push(permissionFactor);
  totalWeight += 25;
  weightedScore += permissionScore * 25;

  // Factor 4: Risk Predictability (weight: 20%)
  // Lower risk is more predictable
  const riskPredictability = 100 - risk.score;
  const riskFactor: ConfidenceFactor = {
    name: 'Risk Predictability',
    weight: 20,
    score: riskPredictability,
    contribution: (riskPredictability * 20) / 100,
  };
  factors.push(riskFactor);
  totalWeight += 20;
  weightedScore += riskPredictability * 20;

  // Calculate final score
  const finalScore = Math.round(weightedScore / totalWeight);

  // Sort factors by contribution (highest first)
  factors.sort((a, b) => b.contribution - a.contribution);

  return {
    score: finalScore,
    factors,
  };
}

function calculatePolicyScore(policy: PolicyResult): number {
  if (policy.violatedPolicies.length === 0) {
    return 100;
  }

  // Reduce score based on number and severity of violations
  let deduction = 0;

  for (const violatedPolicy of policy.violatedPolicies) {
    switch (violatedPolicy.severity) {
      case 'critical':
        deduction += 40;
        break;
      case 'high':
        deduction += 25;
        break;
      case 'medium':
        deduction += 15;
        break;
      case 'low':
        deduction += 5;
        break;
    }
  }

  return Math.max(0, 100 - deduction);
}

export function getConfidenceLevel(score: number): string {
  if (score >= 80) return 'High';
  if (score >= 50) return 'Medium';
  return 'Low';
}

export function getConfidenceColor(score: number): string {
  if (score >= 80) return '#22c55e';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
}