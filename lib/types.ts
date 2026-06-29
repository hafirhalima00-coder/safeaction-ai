// Core type definitions for SafeAction AI

export type DecisionType = 'ALLOW' | 'DENY' | 'REQUIRE_HUMAN_APPROVAL';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type Severity = 'low' | 'medium' | 'high' | 'critical';

export type ActionType =
  | 'DELETE_CUSTOMER'
  | 'SEND_REFUND'
  | 'SEND_MARKETING_EMAIL'
  | 'SEND_EMAIL'
  | 'EXPORT_DATA'
  | 'CHANGE_SUBSCRIPTION'
  | 'CREATE_USER'
  | 'UPDATE_USER'
  | 'DELETE_USER'
  | 'EXPORT_CRM'
  | 'MODIFY_PRICING'
  | 'ACCESS_SENSITIVE_DATA'
  | 'UNKNOWN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'support' | 'developer' | 'viewer';
  permissions: string[];
}

export interface Policy {
  id: string;
  name: string;
  description: string;
  actionTypes: ActionType[];
  severity: Severity;
  threshold?: number;
  conditions?: PolicyCondition[];
}

export interface PolicyCondition {
  field: string;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  value: number;
}

export interface IntentResult {
  actionType: ActionType;
  target: string | null;
  parameters: Record<string, unknown>;
  rawInput: string;
  confidence: number;
}

export interface PolicyResult {
  violatedPolicies: Policy[];
  passedPolicies: Policy[];
  requiresApproval: boolean;
}

export interface PermissionResult {
  hasPermission: boolean;
  missingPermissions: string[];
  role: string;
  details: string;
}

export interface RiskResult {
  score: number;
  level: RiskLevel;
  factors: RiskFactor[];
}

export interface RiskFactor {
  name: string;
  impact: number;
  description: string;
}

export interface ConfidenceResult {
  score: number;
  factors: ConfidenceFactor[];
}

export interface ConfidenceFactor {
  name: string;
  weight: number;
  score: number;
  contribution: number;
}

export interface DecisionResult {
  decision: DecisionType;
  reasoning: string;
  requiresHumanApproval: boolean;
}

export interface DecisionReport {
  id: string;
  timestamp: Date;
  userId: string;
  intent: IntentResult;
  policy: PolicyResult;
  permission: PermissionResult;
  risk: RiskResult;
  confidence: ConfidenceResult;
  final: DecisionResult;
}

export interface DecisionRecord {
  id: string;
  userId: string;
  userName: string;
  rawInput: string;
  actionType: string;
  target: string;
  decision: DecisionType;
  confidence: number;
  riskScore: number;
  violatedPolicies: string[];
  createdAt: Date;
}

export interface DashboardStats {
  totalDecisions: number;
  decisionsToday: number;
  allowCount: number;
  denyCount: number;
  approvalRequiredCount: number;
  avgConfidence: number;
  avgRiskScore: number;
  complianceRate: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  decisionReport?: DecisionReport;
}