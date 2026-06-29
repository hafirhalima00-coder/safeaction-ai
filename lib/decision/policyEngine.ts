import { Policy, PolicyResult, IntentResult, ActionType, Severity } from '../types';

// Mock policies data - in production this would come from the database
const MOCK_POLICIES: Policy[] = [
  {
    id: 'p1',
    name: 'No Customer Deletion Without Approval',
    description: 'Deleting customer data requires manager approval due to GDPR compliance',
    actionTypes: ['DELETE_CUSTOMER'],
    severity: 'critical',
  },
  {
    id: 'p2',
    name: 'Refund Limit',
    description: 'Refunds over $1000 require manager approval',
    actionTypes: ['SEND_REFUND'],
    severity: 'high',
    threshold: 1000,
  },
  {
    id: 'p3',
    name: 'Marketing Email Opt-In',
    description: 'Marketing emails require customer opt-in verification',
    actionTypes: ['SEND_MARKETING_EMAIL'],
    severity: 'medium',
  },
  {
    id: 'p4',
    name: 'Data Export Audit',
    description: 'All data exports must be logged and can be audited',
    actionTypes: ['EXPORT_DATA', 'EXPORT_CRM'],
    severity: 'low',
  },
  {
    id: 'p5',
    name: 'Subscription Change Notice',
    description: 'Subscription downgrades require user confirmation',
    actionTypes: ['CHANGE_SUBSCRIPTION'],
    severity: 'medium',
  },
  {
    id: 'p6',
    name: 'Sensitive Data Access',
    description: 'Accessing sensitive customer data requires elevated permissions',
    actionTypes: ['ACCESS_SENSITIVE_DATA'],
    severity: 'high',
  },
  {
    id: 'p7',
    name: 'Bulk Operations Require Approval',
    description: 'Bulk operations on customer data require manager approval',
    actionTypes: ['DELETE_USER'],
    severity: 'high',
  },
  {
    id: 'p8',
    name: 'Pricing Modification',
    description: 'Modifying pricing requires finance team approval',
    actionTypes: ['MODIFY_PRICING'],
    severity: 'critical',
  },
];

export function evaluatePolicies(intent: IntentResult): PolicyResult {
  const policies = MOCK_POLICIES;
  const violatedPolicies: Policy[] = [];
  const passedPolicies: Policy[] = [];
  let requiresApproval = false;

  for (const policy of policies) {
    // Check if policy applies to this action type
    if (policy.actionTypes.includes(intent.actionType) || policy.actionTypes.includes('UNKNOWN' as ActionType)) {
      // Evaluate policy conditions
      const violation = evaluatePolicyConditions(policy, intent);

      if (violation) {
        violatedPolicies.push(policy);

        // Check if this policy requires human approval
        if (policy.severity === 'critical' || policy.severity === 'high') {
          requiresApproval = true;
        }
      } else {
        passedPolicies.push(policy);
      }
    }
  }

  // If there are any violated policies, we need approval for critical ones
  const hasCriticalViolation = violatedPolicies.some((p) => p.severity === 'critical');
  if (hasCriticalViolation) {
    requiresApproval = true;
  }

  return {
    violatedPolicies,
    passedPolicies,
    requiresApproval,
  };
}

function evaluatePolicyConditions(policy: Policy, intent: IntentResult): boolean {
  // Check threshold conditions
  const amount = intent.parameters.amount;
  if (policy.threshold !== undefined && typeof amount === 'number' && amount > policy.threshold) {
    return true;
  }

  // Check for bulk operations that might violate policies
  if (intent.parameters.bulk === true) {
    const bulkPolicySeverities: Severity[] = ['high', 'critical'];
    if (bulkPolicySeverities.includes(policy.severity)) {
      return true;
    }
  }

  // Check for critical action types (default violation if policy exists for them)
  const criticalActionTypes: ActionType[] = ['DELETE_CUSTOMER', 'MODIFY_PRICING'];
  if (criticalActionTypes.includes(intent.actionType) && policy.severity === 'critical') {
    return true;
  }

  // Default: if policy applies to this action type and no clear pass conditions met, consider it a potential violation
  // This is a conservative approach - the policy exists for a reason
  return policy.severity === 'critical';
}

export function getSeverityColor(severity: Severity): string {
  const colors: Record<Severity, string> = {
    critical: '#ef4444',
    high: '#f59e0b',
    medium: '#3b82f6',
    low: '#22c55e',
  };

  return colors[severity];
}

export function getSeverityLabel(severity: Severity): string {
  const labels: Record<Severity, string> = {
    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  };

  return labels[severity];
}

export { MOCK_POLICIES };