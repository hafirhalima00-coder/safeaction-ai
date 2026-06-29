import { IntentResult, ActionType } from '../types';

const ACTION_PATTERNS: Array<{
  pattern: RegExp;
  actionType: ActionType;
  targetGroups: number[];
}> = [
  // DELETE patterns
  { pattern: /delete\s+(customer|user|account|client)\s+([a-zA-Z0-9\s]+)/i, actionType: 'DELETE_CUSTOMER', targetGroups: [2] },
  { pattern: /delete\s+([a-zA-Z0-9\s]+)\s+customer/i, actionType: 'DELETE_CUSTOMER', targetGroups: [1] },
  { pattern: /remove\s+(customer|user|account)\s+([a-zA-Z0-9\s]+)/i, actionType: 'DELETE_CUSTOMER', targetGroups: [2] },

  // REFUND patterns
  { pattern: /send\s+refund\s+(?:of\s+)?\$?(\d+(?:\.\d{2})?)/i, actionType: 'SEND_REFUND', targetGroups: [1] },
  { pattern: /refund\s+(?:of\s+)?\$?(\d+(?:\.\d{2})?)/i, actionType: 'SEND_REFUND', targetGroups: [1] },
  { pattern: /process\s+refund\s+(?:of\s+)?\$?(\d+(?:\.\d{2})?)/i, actionType: 'SEND_REFUND', targetGroups: [1] },

  // MARKETING EMAIL patterns
  { pattern: /send\s+(marketing|promotional|advertisement)\s+(email|mail)/i, actionType: 'SEND_MARKETING_EMAIL', targetGroups: [] },
  { pattern: /send\s+(bulk|mass)\s+(email|mail)/i, actionType: 'SEND_MARKETING_EMAIL', targetGroups: [] },
  { pattern: /send\s+promo(?:tion)?\s+(email|mail)/i, actionType: 'SEND_MARKETING_EMAIL', targetGroups: [] },

  // GENERAL EMAIL patterns
  { pattern: /send\s+(email|mail)\s+to\s+([a-zA-Z0-9\s@.]+)/i, actionType: 'SEND_EMAIL', targetGroups: [2] },
  { pattern: /email\s+([a-zA-Z0-9\s@.]+)/i, actionType: 'SEND_EMAIL', targetGroups: [1] },

  // EXPORT patterns
  { pattern: /export\s+(crm|data|customer|user)\s+(?:data)?/i, actionType: 'EXPORT_CRM', targetGroups: [] },
  { pattern: /export\s+(?:all\s+)?data/i, actionType: 'EXPORT_DATA', targetGroups: [] },
  { pattern: /download\s+(crm|data|customer)\s+(?:data)?/i, actionType: 'EXPORT_DATA', targetGroups: [] },
  { pattern: /export\s+to\s+(csv|excel|json|pdf)/i, actionType: 'EXPORT_DATA', targetGroups: [1] },

  // SUBSCRIPTION patterns
  { pattern: /(change|upgrade|downgrade|modify)\s+(subscription|plan|pricing)/i, actionType: 'CHANGE_SUBSCRIPTION', targetGroups: [1] },
  { pattern: /(upgrade|downgrade)\s+to\s+([a-zA-Z0-9\s]+)\s+(?:plan|tier)/i, actionType: 'CHANGE_SUBSCRIPTION', targetGroups: [2] },
  { pattern: /switch\s+(subscription|plan)/i, actionType: 'CHANGE_SUBSCRIPTION', targetGroups: [] },

  // USER management
  { pattern: /create\s+(new\s+)?(user|account|customer)/i, actionType: 'CREATE_USER', targetGroups: [2] },
  { pattern: /add\s+(new\s+)?(user|account|customer)/i, actionType: 'CREATE_USER', targetGroups: [2] },
  { pattern: /update\s+(user|account|customer)\s+([a-zA-Z0-9\s]+)/i, actionType: 'UPDATE_USER', targetGroups: [2] },
  { pattern: /modify\s+(user|account|customer)\s+([a-zA-Z0-9\s]+)/i, actionType: 'UPDATE_USER', targetGroups: [2] },
  { pattern: /delete\s+(user|account)\s+([a-zA-Z0-9\s]+)/i, actionType: 'DELETE_USER', targetGroups: [2] },

  // SENSITIVE DATA
  { pattern: /(access|view|retrieve)\s+(sensitive|confidential|private)\s+(data|information|customer\s+data)/i, actionType: 'ACCESS_SENSITIVE_DATA', targetGroups: [] },
  { pattern: /(view|show)\s+(customer|user)\s+(ssn|social\s+security|credit\s+card|password)/i, actionType: 'ACCESS_SENSITIVE_DATA', targetGroups: [] },

  // PRICING
  { pattern: /(change|modify|update)\s+pricing/i, actionType: 'MODIFY_PRICING', targetGroups: [] },
  { pattern: /(set|update)\s+(price|cost|rate)/i, actionType: 'MODIFY_PRICING', targetGroups: [] },
];

export function analyzeIntent(rawInput: string): IntentResult {
  const trimmedInput = rawInput.trim();

  // Try to match patterns
  for (const { pattern, actionType, targetGroups } of ACTION_PATTERNS) {
    const match = trimmedInput.match(pattern);
    if (match) {
      let target: string | null = null;

      if (targetGroups.length > 0) {
        const groupIndex = targetGroups[0];
        target = match[groupIndex]?.trim() || null;
      }

      // Extract additional parameters
      const parameters: Record<string, unknown> = {};

      // Check for amounts (refunds)
      const amountMatch = trimmedInput.match(/\$?(\d+(?:\.\d{2})?)/);
      if (amountMatch) {
        parameters.amount = parseFloat(amountMatch[1]);
      }

      // Check for bulk operations
      if (/\b(bulk|mass|all|multiple)\b/i.test(trimmedInput)) {
        parameters.bulk = true;
      }

      // Calculate confidence based on match quality
      const confidence = calculateIntentConfidence(trimmedInput, match, actionType);

      return {
        actionType,
        target,
        parameters,
        rawInput: trimmedInput,
        confidence,
      };
    }
  }

  // No pattern matched - return UNKNOWN with low confidence
  return {
    actionType: 'UNKNOWN',
    target: null,
    parameters: {},
    rawInput: trimmedInput,
    confidence: 20,
  };
}

function calculateIntentConfidence(
  rawInput: string,
  match: RegExpMatchArray,
  actionType: ActionType
): number {
  let confidence = 70; // Base confidence for pattern match

  // Bonus for clear, specific language
  if (match[0].length / rawInput.length > 0.5) {
    confidence += 15;
  }

  // Bonus for having a target
  if (match[1] && match[1].trim().length > 0) {
    confidence += 10;
  }

  // Check for ambiguous language that lowers confidence
  const ambiguousPhrases = ['maybe', 'perhaps', 'possibly', 'might', 'could'];
  const hasAmbiguous = ambiguousPhrases.some((phrase) =>
    rawInput.toLowerCase().includes(phrase)
  );
  if (hasAmbiguous) {
    confidence -= 15;
  }

  // Critical actions get lower confidence to require more scrutiny
  const criticalActions = ['DELETE_CUSTOMER', 'DELETE_USER', 'MODIFY_PRICING'];
  if (criticalActions.includes(actionType)) {
    confidence -= 10;
  }

  return Math.max(10, Math.min(95, confidence));
}

export function getActionTypeLabel(actionType: ActionType): string {
  const labels: Record<ActionType, string> = {
    DELETE_CUSTOMER: 'Delete Customer',
    SEND_REFUND: 'Send Refund',
    SEND_MARKETING_EMAIL: 'Send Marketing Email',
    SEND_EMAIL: 'Send Email',
    EXPORT_DATA: 'Export Data',
    EXPORT_CRM: 'Export CRM',
    CHANGE_SUBSCRIPTION: 'Change Subscription',
    CREATE_USER: 'Create User',
    UPDATE_USER: 'Update User',
    DELETE_USER: 'Delete User',
    ACCESS_SENSITIVE_DATA: 'Access Sensitive Data',
    MODIFY_PRICING: 'Modify Pricing',
    UNKNOWN: 'Unknown Action',
  };

  return labels[actionType] || actionType;
}