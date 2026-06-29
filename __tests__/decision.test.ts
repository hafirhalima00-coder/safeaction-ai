/**
 * SafeAction AI - Decision Engine Unit Tests
 * Tests for all 6 decision modules
 */

import { analyzeIntent, getActionTypeLabel } from '@/lib/decision/intentAnalyzer';
import { evaluatePolicies } from '@/lib/decision/policyEngine';
import { checkPermissions, MOCK_USERS } from '@/lib/decision/permissionChecker';
import { calculateRisk, getRiskLevelLabel } from '@/lib/decision/riskScoring';
import { calculateConfidence } from '@/lib/decision/confidenceCalculator';
import { makeFinalDecision, getDecisionLabel } from '@/lib/decision/finalDecision';
import { IntentResult, ActionType, RiskLevel, Policy, Severity } from '@/lib/types';

// ============================================
// INTENT ANALYZER TESTS
// ============================================

describe('Intent Analyzer', () => {
  describe('analyzeIntent', () => {
    it('should detect DELETE_CUSTOMER action', () => {
      const result = analyzeIntent('Delete customer John Doe');
      expect(result.actionType).toBe('DELETE_CUSTOMER');
      expect(result.target).toBe('John Doe');
    });

    it('should detect SEND_REFUND action with amount', () => {
      const result = analyzeIntent('Send refund of $500');
      expect(result.actionType).toBe('SEND_REFUND');
      expect(result.parameters.amount).toBe(500);
    });

    it('should detect EXPORT_CRM action', () => {
      const result = analyzeIntent('Export CRM data to csv');
      expect(result.actionType).toBe('EXPORT_CRM');
    });

    it('should detect CHANGE_SUBSCRIPTION action', () => {
      const result = analyzeIntent('Change subscription plan');
      expect(result.actionType).toBe('CHANGE_SUBSCRIPTION');
    });

    it('should detect SEND_MARKETING_EMAIL action', () => {
      const result = analyzeIntent('Send marketing email to all users');
      expect(result.actionType).toBe('SEND_MARKETING_EMAIL');
    });

    it('should detect MODIFY_PRICING action', () => {
      const result = analyzeIntent('Modify pricing for all plans');
      expect(result.actionType).toBe('MODIFY_PRICING');
    });

    it('should return UNKNOWN for unrecognized actions', () => {
      const result = analyzeIntent('Do something random');
      expect(result.actionType).toBe('UNKNOWN');
      expect(result.confidence).toBeLessThan(50);
    });

    it('should extract bulk parameter', () => {
      const result = analyzeIntent('Delete all customer data');
      expect(result.parameters.bulk).toBe(true);
    });
  });

  describe('getActionTypeLabel', () => {
    it('should return correct label for DELETE_CUSTOMER', () => {
      expect(getActionTypeLabel('DELETE_CUSTOMER')).toBe('Delete Customer');
    });

    it('should return correct label for SEND_REFUND', () => {
      expect(getActionTypeLabel('SEND_REFUND')).toBe('Send Refund');
    });

    it('should return correct label for UNKNOWN', () => {
      expect(getActionTypeLabel('UNKNOWN')).toBe('Unknown Action');
    });
  });
});

// ============================================
// POLICY ENGINE TESTS
// ============================================

describe('Policy Engine', () => {
  describe('evaluatePolicies', () => {
    it('should detect critical policy violation for DELETE_CUSTOMER', () => {
      const intent: IntentResult = {
        actionType: 'DELETE_CUSTOMER',
        target: 'John Doe',
        parameters: {},
        rawInput: 'Delete customer John Doe',
        confidence: 85,
      };

      const result = evaluatePolicies(intent);

      expect(result.violatedPolicies.length).toBeGreaterThan(0);
      expect(result.violatedPolicies.some(p => p.severity === 'critical')).toBe(true);
      expect(result.requiresApproval).toBe(true);
    });

    it('should detect threshold violation for large refunds', () => {
      const intent: IntentResult = {
        actionType: 'SEND_REFUND',
        target: 'Customer',
        parameters: { amount: 5000 },
        rawInput: 'Send refund of $5000',
        confidence: 80,
      };

      const result = evaluatePolicies(intent);

      expect(result.violatedPolicies.length).toBeGreaterThan(0);
      expect(result.requiresApproval).toBe(true);
    });

    it('should pass for allowed actions like EXPORT_DATA', () => {
      const intent: IntentResult = {
        actionType: 'EXPORT_DATA',
        target: 'CRM',
        parameters: {},
        rawInput: 'Export CRM data',
        confidence: 90,
      };

      const result = evaluatePolicies(intent);

      // Should not have critical violations
      expect(result.violatedPolicies.some(p => p.severity === 'critical')).toBe(false);
    });
  });
});

// ============================================
// PERMISSION CHECKER TESTS
// ============================================

describe('Permission Checker', () => {
  describe('checkPermissions', () => {
    it('should allow admin to perform any action', () => {
      const intent: IntentResult = {
        actionType: 'DELETE_CUSTOMER',
        target: 'Test',
        parameters: {},
        rawInput: 'Delete customer Test',
        confidence: 80,
      };

      const result = checkPermissions('u1', intent);

      expect(result.hasPermission).toBe(true);
      expect(result.role).toBe('admin');
    });

    it('should deny support user permission for DELETE_CUSTOMER', () => {
      const intent: IntentResult = {
        actionType: 'DELETE_CUSTOMER',
        target: 'Test',
        parameters: {},
        rawInput: 'Delete customer Test',
        confidence: 80,
      };

      const result = checkPermissions('u3', intent);

      expect(result.hasPermission).toBe(false);
      expect(result.missingPermissions.length).toBeGreaterThan(0);
    });

    it('should allow manager to send refunds', () => {
      const intent: IntentResult = {
        actionType: 'SEND_REFUND',
        target: 'Customer',
        parameters: { amount: 100 },
        rawInput: 'Send refund of $100',
        confidence: 80,
      };

      const result = checkPermissions('u2', intent);

      expect(result.hasPermission).toBe(true);
    });

    it('should return user not found for invalid ID', () => {
      const intent: IntentResult = {
        actionType: 'EXPORT_DATA',
        target: 'Test',
        parameters: {},
        rawInput: 'Export data',
        confidence: 80,
      };

      const result = checkPermissions('invalid-id', intent);

      expect(result.hasPermission).toBe(false);
      expect(result.details).toContain('not found');
    });

    it('should correctly identify viewer role limitations', () => {
      const intent: IntentResult = {
        actionType: 'CREATE_USER',
        target: 'Test',
        parameters: {},
        rawInput: 'Create new user',
        confidence: 80,
      };

      const result = checkPermissions('u5', intent);

      expect(result.hasPermission).toBe(false);
      expect(result.role).toBe('viewer');
    });
  });
});

// ============================================
// RISK SCORING TESTS
// ============================================

describe('Risk Scoring', () => {
  describe('calculateRisk', () => {
    it('should return CRITICAL risk for DELETE_CUSTOMER', () => {
      const intent: IntentResult = {
        actionType: 'DELETE_CUSTOMER',
        target: 'Test',
        parameters: {},
        rawInput: 'Delete customer Test',
        confidence: 80,
      };

      const result = calculateRisk(intent);

      expect(result.level).toBe('CRITICAL');
      expect(result.score).toBeGreaterThanOrEqual(80);
    });

    it('should return HIGH risk for large refunds', () => {
      const intent: IntentResult = {
        actionType: 'SEND_REFUND',
        target: 'Customer',
        parameters: { amount: 5000 },
        rawInput: 'Send refund of $5000',
        confidence: 80,
      };

      const result = calculateRisk(intent);

      expect(result.score).toBeGreaterThan(60);
    });

    it('should return LOW risk for data export', () => {
      const intent: IntentResult = {
        actionType: 'EXPORT_DATA',
        target: 'CRM',
        parameters: {},
        rawInput: 'Export CRM data',
        confidence: 90,
      };

      const result = calculateRisk(intent);

      expect(result.level).toBe('LOW');
      expect(result.score).toBeLessThan(40);
    });

    it('should increase risk for bulk operations', () => {
      const intentBulk: IntentResult = {
        actionType: 'DELETE_USER',
        target: 'Multiple',
        parameters: { bulk: true },
        rawInput: 'Delete all inactive users',
        confidence: 80,
      };

      const result = calculateRisk(intentBulk);

      expect(result.factors.some(f => f.name === 'Bulk Operation')).toBe(true);
    });

    it('should decrease risk for specific targets', () => {
      const intentWithTarget: IntentResult = {
        actionType: 'DELETE_USER',
        target: 'John Doe',
        parameters: {},
        rawInput: 'Delete user John Doe',
        confidence: 80,
      };

      const result = calculateRisk(intentWithTarget);

      expect(result.factors.some(f => f.name === 'Targeted Entity')).toBe(true);
    });
  });

  describe('getRiskLevelLabel', () => {
    it('should return correct labels', () => {
      expect(getRiskLevelLabel('LOW')).toBe('Low');
      expect(getRiskLevelLabel('MEDIUM')).toBe('Medium');
      expect(getRiskLevelLabel('HIGH')).toBe('High');
      expect(getRiskLevelLabel('CRITICAL')).toBe('Critical');
    });
  });
});

// ============================================
// CONFIDENCE CALCULATOR TESTS
// ============================================

describe('Confidence Calculator', () => {
  describe('calculateConfidence', () => {
    it('should return high confidence for clear intent', () => {
      const intent: IntentResult = {
        actionType: 'EXPORT_DATA',
        target: 'CRM',
        parameters: {},
        rawInput: 'Export CRM data',
        confidence: 90,
      };

      const policy = evaluatePolicies(intent);
      const permission = checkPermissions('u1', intent);
      const risk = calculateRisk(intent);

      const result = calculateConfidence(intent, policy, permission, risk);

      expect(result.score).toBeGreaterThan(70);
    });

    it('should reduce confidence for policy violations', () => {
      const intent: IntentResult = {
        actionType: 'DELETE_CUSTOMER',
        target: 'Test',
        parameters: {},
        rawInput: 'Delete customer Test',
        confidence: 80,
      };

      const policy = evaluatePolicies(intent);
      const permission = checkPermissions('u1', intent);
      const risk = calculateRisk(intent);

      const result = calculateConfidence(intent, policy, permission, risk);

      // Policy violation should reduce confidence
      const policyFactor = result.factors.find(f => f.name === 'Policy Compliance');
      expect(policyFactor?.score).toBeLessThan(100);
    });

    it('should include all factor types', () => {
      const intent: IntentResult = {
        actionType: 'EXPORT_DATA',
        target: 'Test',
        parameters: {},
        rawInput: 'Export data',
        confidence: 80,
      };

      const policy = evaluatePolicies(intent);
      const permission = checkPermissions('u1', intent);
      const risk = calculateRisk(intent);

      const result = calculateConfidence(intent, policy, permission, risk);

      expect(result.factors.length).toBe(4);
      expect(result.factors.map(f => f.name)).toContain('Intent Clarity');
      expect(result.factors.map(f => f.name)).toContain('Policy Compliance');
      expect(result.factors.map(f => f.name)).toContain('Permission Clarity');
      expect(result.factors.map(f => f.name)).toContain('Risk Predictability');
    });
  });
});

// ============================================
// FINAL DECISION TESTS
// ============================================

describe('Final Decision', () => {
  describe('makeFinalDecision', () => {
    it('should DENY when user has no permission', () => {
      const intent: IntentResult = {
        actionType: 'MODIFY_PRICING',
        target: 'All',
        parameters: {},
        rawInput: 'Modify pricing',
        confidence: 90,
      };

      const policy = evaluatePolicies(intent);
      const permission = checkPermissions('u3', intent); // Support user
      const risk = calculateRisk(intent);
      const confidence = calculateConfidence(intent, policy, permission, risk);

      const result = makeFinalDecision(policy, permission, risk, confidence);

      expect(result.decision).toBe('DENY');
      expect(result.requiresHumanApproval).toBe(false);
    });

    it('should REQUIRE_HUMAN_APPROVAL for critical risk', () => {
      const intent: IntentResult = {
        actionType: 'DELETE_CUSTOMER',
        target: 'Test',
        parameters: {},
        rawInput: 'Delete customer Test',
        confidence: 80,
      };

      const policy = evaluatePolicies(intent);
      const permission = checkPermissions('u1', intent); // Admin
      const risk = calculateRisk(intent);
      const confidence = calculateConfidence(intent, policy, permission, risk);

      const result = makeFinalDecision(policy, permission, risk, confidence);

      expect(result.decision).toBe('REQUIRE_HUMAN_APPROVAL');
      expect(result.requiresHumanApproval).toBe(true);
    });

    it('should ALLOW low risk actions with no violations', () => {
      const intent: IntentResult = {
        actionType: 'EXPORT_DATA',
        target: 'CRM',
        parameters: {},
        rawInput: 'Export CRM data',
        confidence: 90,
      };

      const policy = evaluatePolicies(intent);
      const permission = checkPermissions('u1', intent);
      const risk = calculateRisk(intent);
      const confidence = calculateConfidence(intent, policy, permission, risk);

      const result = makeFinalDecision(policy, permission, risk, confidence);

      expect(result.decision).toBe('ALLOW');
    });

    it('should REQUIRE_HUMAN_APPROVAL for low confidence', () => {
      const intent: IntentResult = {
        actionType: 'UNKNOWN',
        target: null,
        parameters: {},
        rawInput: 'Do something weird',
        confidence: 20, // Low confidence
      };

      const policy = evaluatePolicies(intent);
      const permission = checkPermissions('u1', intent);
      const risk = calculateRisk(intent);
      const confidence = calculateConfidence(intent, policy, permission, risk);

      const result = makeFinalDecision(policy, permission, risk, confidence);

      expect(result.decision).toBe('REQUIRE_HUMAN_APPROVAL');
    });
  });

  describe('getDecisionLabel', () => {
    it('should return correct labels', () => {
      expect(getDecisionLabel('ALLOW')).toBe('Approved');
      expect(getDecisionLabel('DENY')).toBe('Denied');
      expect(getDecisionLabel('REQUIRE_HUMAN_APPROVAL')).toBe('Needs Review');
    });
  });
});

// ============================================
// INTEGRATION TESTS
// ============================================

describe('Decision Engine Integration', () => {
  it('should produce consistent results for the same input', () => {
    const input = 'Delete customer John Doe';

    // First run
    const intent1 = analyzeIntent(input);
    const policy1 = evaluatePolicies(intent1);
    const permission1 = checkPermissions('u1', intent1);
    const risk1 = calculateRisk(intent1);
    const confidence1 = calculateConfidence(intent1, policy1, permission1, risk1);
    const decision1 = makeFinalDecision(policy1, permission1, risk1, confidence1);

    // Second run
    const intent2 = analyzeIntent(input);
    const policy2 = evaluatePolicies(intent2);
    const permission2 = checkPermissions('u1', intent2);
    const risk2 = calculateRisk(intent2);
    const confidence2 = calculateConfidence(intent2, policy2, permission2, risk2);
    const decision2 = makeFinalDecision(policy2, permission2, risk2, confidence2);

    // Results should be identical
    expect(decision1.decision).toBe(decision2.decision);
  });

  it('should produce different decisions for different users', () => {
    const input = 'Delete customer John Doe';

    // Admin user
    const adminIntent = analyzeIntent(input);
    const adminPolicy = evaluatePolicies(adminIntent);
    const adminPermission = checkPermissions('u1', adminIntent);
    const adminRisk = calculateRisk(adminIntent);
    const adminConfidence = calculateConfidence(adminIntent, adminPolicy, adminPermission, adminRisk);
    const adminDecision = makeFinalDecision(adminPolicy, adminPermission, adminRisk, adminConfidence);

    // Support user
    const supportIntent = analyzeIntent(input);
    const supportPolicy = evaluatePolicies(supportIntent);
    const supportPermission = checkPermissions('u3', supportIntent);
    const supportRisk = calculateRisk(supportIntent);
    const supportConfidence = calculateConfidence(supportIntent, supportPolicy, supportPermission, supportRisk);
    const supportDecision = makeFinalDecision(supportPolicy, supportPermission, supportRisk, supportConfidence);

    // Decisions should differ (admin might get approval required, support should get denied)
    expect(adminDecision.decision).not.toBe(supportDecision.decision);
  });
});

// ============================================
// EDGE CASES
// ============================================

describe('Edge Cases', () => {
  it('should handle empty input', () => {
    const result = analyzeIntent('');
    expect(result.actionType).toBe('UNKNOWN');
    expect(result.confidence).toBeLessThan(50);
  });

  it('should handle very long input', () => {
    const longInput = 'Delete customer John Doe ' + ' '.repeat(100) + 'test';
    const result = analyzeIntent(longInput);
    expect(result.actionType).toBe('DELETE_CUSTOMER');
  });

  it('should handle case insensitive input', () => {
    expect(analyzeIntent('DELETE CUSTOMER John').actionType).toBe('DELETE_CUSTOMER');
    expect(analyzeIntent('delete customer John').actionType).toBe('DELETE_CUSTOMER');
    expect(analyzeIntent('Delete Customer John').actionType).toBe('DELETE_CUSTOMER');
  });

  it('should handle actions with special characters', () => {
    const result = analyzeIntent('Send refund of $1,000.50');
    expect(result.actionType).toBe('SEND_REFUND');
    expect(result.parameters.amount).toBe(1000.50);
  });
});