import { DecisionResult, DecisionType, PolicyResult, PermissionResult, RiskResult, ConfidenceResult } from '../types';

export function makeFinalDecision(
  policy: PolicyResult,
  permission: PermissionResult,
  risk: RiskResult,
  confidence: ConfidenceResult
): DecisionResult {
  // Decision rules in order of priority

  // Rule 1: If user doesn't have permission, DENY
  if (!permission.hasPermission) {
    return {
      decision: 'DENY',
      reasoning: `Access denied: User lacks required permissions (${permission.missingPermissions.join(', ')})`,
      requiresHumanApproval: false,
    };
  }

  // Rule 2: If risk score is critical (>=80), require human approval
  if (risk.score >= 80) {
    return {
      decision: 'REQUIRE_HUMAN_APPROVAL',
      reasoning: `Critical risk level detected (${risk.score}/100). This action requires manual review by an authorized manager.`,
      requiresHumanApproval: true,
    };
  }

  // Rule 3: If critical policy violated, require human approval
  const hasCriticalViolation = policy.violatedPolicies.some((p) => p.severity === 'critical');
  if (hasCriticalViolation) {
    const criticalPolicies = policy.violatedPolicies
      .filter((p) => p.severity === 'critical')
      .map((p) => p.name)
      .join(', ');

    return {
      decision: 'REQUIRE_HUMAN_APPROVAL',
      reasoning: `Critical policy violation: ${criticalPolicies}. Manual approval required.`,
      requiresHumanApproval: true,
    };
  }

  // Rule 4: If confidence is low (<50), require human approval
  if (confidence.score < 50) {
    return {
      decision: 'REQUIRE_HUMAN_APPROVAL',
      reasoning: `Low confidence score (${confidence.score}/100). The system needs human verification to proceed safely.`,
      requiresHumanApproval: true,
    };
  }

  // Rule 5: If high risk (>=60) and policy violations exist, require human approval
  if (risk.score >= 60 && policy.violatedPolicies.length > 0) {
    const policyNames = policy.violatedPolicies.map((p) => p.name).join(', ');
    return {
      decision: 'REQUIRE_HUMAN_APPROVAL',
      reasoning: `High risk combined with policy violations: ${policyNames}. Manual review recommended.`,
      requiresHumanApproval: true,
    };
  }

  // Rule 6: If high risk without permission issues, but below threshold, DENY
  if (risk.score >= 60) {
    return {
      decision: 'DENY',
      reasoning: `High risk level (${risk.score}/100) without sufficient safeguards. Action blocked.`,
      requiresHumanApproval: false,
    };
  }

  // Rule 7: If any policy violations exist (medium severity or higher), warn but allow
  if (policy.violatedPolicies.length > 0) {
    const policyNames = policy.violatedPolicies
      .map((p) => `${p.name} (${p.severity})`)
      .join(', ');

    return {
      decision: 'ALLOW',
      reasoning: `Action allowed with warnings. Note: ${policyNames}. Proceed with caution.`,
      requiresHumanApproval: false,
    };
  }

  // Default: Allow the action
  return {
    decision: 'ALLOW',
    reasoning: `All checks passed. Action approved with confidence level ${confidence.score}/100 and risk level ${risk.level}.`,
    requiresHumanApproval: false,
  };
}

export function getDecisionColor(decision: DecisionType): string {
  const colors: Record<DecisionType, string> = {
    ALLOW: '#22c55e',
    DENY: '#ef4444',
    REQUIRE_HUMAN_APPROVAL: '#f59e0b',
  };

  return colors[decision];
}

export function getDecisionIcon(decision: DecisionType): string {
  const icons: Record<DecisionType, string> = {
    ALLOW: 'check-circle',
    DENY: 'x-circle',
    REQUIRE_HUMAN_APPROVAL: 'alert-triangle',
  };

  return icons[decision];
}

export function getDecisionLabel(decision: DecisionType): string {
  const labels: Record<DecisionType, string> = {
    ALLOW: 'Approved',
    DENY: 'Denied',
    REQUIRE_HUMAN_APPROVAL: 'Needs Review',
  };

  return labels[decision];
}