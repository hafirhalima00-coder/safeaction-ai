import { PermissionResult, IntentResult, User, ActionType } from '../types';

// Mock users data - in production this would come from the database
const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Sarah Chen', email: 'sarah@company.com', role: 'admin', permissions: ['*'] },
  { id: 'u2', name: 'Mike Johnson', email: 'mike@company.com', role: 'manager', permissions: ['read', 'write', 'send_email', 'refund', 'export'] },
  { id: 'u3', name: 'Alex Rivera', email: 'alex@company.com', role: 'support', permissions: ['read', 'write', 'send_email'] },
  { id: 'u4', name: 'Jordan Lee', email: 'jordan@company.com', role: 'developer', permissions: ['read', 'export', 'modify_pricing'] },
  { id: 'u5', name: 'Taylor Smith', email: 'taylor@company.com', role: 'viewer', permissions: ['read'] },
];

// Mapping of action types to required permissions
const ACTION_PERMISSION_MAP: Record<ActionType, string[]> = {
  DELETE_CUSTOMER: ['delete_customer', 'delete', '*'],
  SEND_REFUND: ['refund', 'write', '*'],
  SEND_MARKETING_EMAIL: ['send_marketing_email', 'send_email', '*'],
  SEND_EMAIL: ['send_email', 'write', '*'],
  EXPORT_DATA: ['export', 'export_data', '*'],
  EXPORT_CRM: ['export', 'export_crm', '*'],
  CHANGE_SUBSCRIPTION: ['change_subscription', 'write', '*'],
  CREATE_USER: ['create_user', 'write', '*'],
  UPDATE_USER: ['update_user', 'write', '*'],
  DELETE_USER: ['delete_user', 'delete', '*'],
  ACCESS_SENSITIVE_DATA: ['access_sensitive_data', 'admin', '*'],
  MODIFY_PRICING: ['modify_pricing', 'admin', '*'],
  UNKNOWN: ['*'],
};

export function checkPermissions(userId: string, intent: IntentResult): PermissionResult {
  const user = MOCK_USERS.find(u => u.id === userId);

  if (!user) {
    return {
      hasPermission: false,
      missingPermissions: ['user_not_found'],
      role: 'unknown',
      details: 'User not found in system',
    };
  }

  return evaluateUserPermissions(user, intent);
}

function evaluateUserPermissions(user: User, intent: IntentResult): PermissionResult {
  const requiredPermissions = ACTION_PERMISSION_MAP[intent.actionType] || [];

  // Admin role with wildcard permission can do anything
  if (user.role === 'admin' && user.permissions.includes('*')) {
    return {
      hasPermission: true,
      missingPermissions: [],
      role: user.role,
      details: 'Admin has full permissions',
    };
  }

  // Check each required permission
  const missingPermissions: string[] = [];

  for (const required of requiredPermissions) {
    const hasPermission = user.permissions.includes(required);

    if (!hasPermission) {
      missingPermissions.push(required);
    }
  }

  const hasPermission = missingPermissions.length === 0;

  let details: string;
  if (hasPermission) {
    details = `User has required permissions: ${requiredPermissions.join(', ')}`;
  } else {
    details = `Missing permissions: ${missingPermissions.join(', ')}`;
  }

  return {
    hasPermission,
    missingPermissions,
    role: user.role,
    details,
  };
}

export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    admin: 'Administrator',
    manager: 'Manager',
    support: 'Support Agent',
    developer: 'Developer',
    viewer: 'Viewer',
  };

  return labels[role] || role;
}

export function getRoleDescription(role: string): string {
  const descriptions: Record<string, string> = {
    admin: 'Full system access with all permissions',
    manager: 'Can manage customers, send emails, and handle refunds',
    support: 'Can read and write customer data, send emails',
    developer: 'Can read data, export, and modify pricing',
    viewer: 'Read-only access to system data',
  };

  return descriptions[role] || role;
}

export { MOCK_USERS };