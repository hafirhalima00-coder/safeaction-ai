import { RiskResult, RiskFactor, RiskLevel, IntentResult, ActionType } from '../types';

// Base risk scores for each action type
const ACTION_RISK_BASE: Record<ActionType, number> = {
  DELETE_CUSTOMER: 85,
  SEND_REFUND: 60,
  SEND_MARKETING_EMAIL: 40,
  SEND_EMAIL: 25,
  EXPORT_DATA: 35,
  EXPORT_CRM: 45,
  CHANGE_SUBSCRIPTION: 30,
  CREATE_USER: 20,
  UPDATE_USER: 35,
  DELETE_USER: 70,
  ACCESS_SENSITIVE_DATA: 75,
  MODIFY_PRICING: 80,
  UNKNOWN: 50,
};

// Impact factors that increase risk
const RISK_FACTORS: Array<{
  name: string;
  check: (intent: IntentResult) => boolean;
  impact: number;
  description: string;
}> = [
  {
    name: 'Bulk Operation',
    check: (intent) => intent.parameters.bulk === true,
    impact: 25,
    description: 'Operating on multiple records increases risk',
  },
  {
    name: 'Large Amount',
    check: (intent) => typeof intent.parameters.amount === 'number' && intent.parameters.amount > 5000,
    impact: 20,
    description: 'High monetary value increases financial risk',
  },
  {
    name: 'Irreversible Action',
    check: (intent) => ['DELETE_CUSTOMER', 'DELETE_USER', 'MODIFY_PRICING'].includes(intent.actionType),
    impact: 15,
    description: 'Action cannot be easily reversed',
  },
  {
    name: 'Data Sensitivity',
    check: (intent) => intent.actionType === 'ACCESS_SENSITIVE_DATA',
    impact: 30,
    description: 'Involves access to sensitive personal data',
  },
  {
    name: 'External Communication',
    check: (intent) => ['SEND_EMAIL', 'SEND_MARKETING_EMAIL', 'SEND_REFUND'].includes(intent.actionType),
    impact: 15,
    description: 'Involves communication with external parties',
  },
  {
    name: 'Financial Impact',
    check: (intent) => ['SEND_REFUND', 'MODIFY_PRICING', 'CHANGE_SUBSCRIPTION'].includes(intent.actionType),
    impact: 20,
    description: 'Direct financial implications',
  },
  {
    name: 'Targeted Entity',
    check: (intent) => intent.target !== null && intent.target.length > 0,
    impact: -5,
    description: 'Specific target reduces scope risk',
  },
  {
    name: 'Clear Intent',
    check: (intent) => intent.confidence > 70,
    impact: -10,
    description: 'Clear understanding reduces ambiguity risk',
  },
];

export function calculateRisk(intent: IntentResult): RiskResult {
  // Start with base risk for the action type
  let riskScore = ACTION_RISK_BASE[intent.actionType] || 50;

  // Collect risk factors
  const factors: RiskFactor[] = [];

  // Add base factor for action type
  factors.push({
    name: 'Base Action Risk',
    impact: riskScore,
    description: `Base risk level for ${formatActionType(intent.actionType)} actions`,
  });

  // Evaluate each risk factor
  for (const factor of RISK_FACTORS) {
    if (factor.check(intent)) {
      riskScore += factor.impact;
      factors.push({
        name: factor.name,
        impact: factor.impact,
        description: factor.description,
      });
    }
  }

  // Clamp score between 0 and 100
  riskScore = Math.max(0, Math.min(100, riskScore));

  // Determine risk level
  const level = getRiskLevel(riskScore);

  // Sort factors by impact (highest first)
  factors.sort((a, b) => b.impact - a.impact);

  return {
    score: riskScore,
    level,
    factors,
  };
}

function getRiskLevel(score: number): RiskLevel {
  if (score >= 80) return 'CRITICAL';
  if (score >= 60) return 'HIGH';
  if (score >= 30) return 'MEDIUM';
  return 'LOW';
}

function formatActionType(actionType: ActionType): string {
  return actionType
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());
}

export function getRiskLevelColor(level: RiskLevel): string {
  const colors: Record<RiskLevel, string> = {
    LOW: '#22c55e',
    MEDIUM: '#3b82f6',
    HIGH: '#f59e0b',
    CRITICAL: '#ef4444',
  };

  return colors[level];
}

export function getRiskLevelLabel(level: RiskLevel): string {
  const labels: Record<RiskLevel, string> = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
    CRITICAL: 'Critical',
  };

  return labels[level];
}