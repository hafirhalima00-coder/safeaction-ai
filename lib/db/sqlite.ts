import Database from 'better-sqlite3';
import path from 'path';
import { User, Policy, DecisionRecord, DashboardStats, ActionType, DecisionType, Severity } from '../types';

const DB_PATH = path.join(process.cwd(), 'safeaction.db');
let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    initializeDatabase();
  }
  return db;
}

function initializeDatabase(): void {
  const database = db!;

  // Create users table
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL,
      permissions TEXT NOT NULL
    )
  `);

  // Create policies table
  database.exec(`
    CREATE TABLE IF NOT EXISTS policies (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      action_types TEXT NOT NULL,
      severity TEXT NOT NULL,
      threshold INTEGER,
      conditions TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create decisions table
  database.exec(`
    CREATE TABLE IF NOT EXISTS decisions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      user_name TEXT NOT NULL,
      raw_input TEXT NOT NULL,
      action_type TEXT,
      target TEXT,
      decision TEXT NOT NULL,
      confidence INTEGER,
      risk_score INTEGER,
      violated_policies TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seed initial data if tables are empty
  const userCount = database.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (userCount.count === 0) {
    seedData(database);
  }
}

function seedData(database: Database.Database): void {
  // Seed users
  const users: User[] = [
    { id: 'u1', name: 'Sarah Chen', email: 'sarah@company.com', role: 'admin', permissions: ['*'] },
    { id: 'u2', name: 'Mike Johnson', email: 'mike@company.com', role: 'manager', permissions: ['read', 'write', 'send_email', 'refund', 'export'] },
    { id: 'u3', name: 'Alex Rivera', email: 'alex@company.com', role: 'support', permissions: ['read', 'write', 'send_email'] },
    { id: 'u4', name: 'Jordan Lee', email: 'jordan@company.com', role: 'developer', permissions: ['read', 'export', 'modify_pricing'] },
    { id: 'u5', name: 'Taylor Smith', email: 'taylor@company.com', role: 'viewer', permissions: ['read'] },
  ];

  const insertUser = database.prepare(
    'INSERT INTO users (id, name, email, role, permissions) VALUES (?, ?, ?, ?, ?)'
  );

  for (const user of users) {
    insertUser.run(user.id, user.name, user.email, user.role, JSON.stringify(user.permissions));
  }

  // Seed policies
  const policies: Omit<Policy, 'conditions'>[] = [
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

  const insertPolicy = database.prepare(
    'INSERT INTO policies (id, name, description, action_types, severity, threshold) VALUES (?, ?, ?, ?, ?, ?)'
  );

  for (const policy of policies) {
    insertPolicy.run(
      policy.id,
      policy.name,
      policy.description,
      JSON.stringify(policy.actionTypes),
      policy.severity,
      policy.threshold ?? null
    );
  }
}

// User operations
export function getUserById(id: string): User | null {
  const database = getDb();
  const row = database.prepare('SELECT * FROM users WHERE id = ?').get(id) as {
    id: string;
    name: string;
    email: string;
    role: string;
    permissions: string;
  } | undefined;

  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role as User['role'],
    permissions: JSON.parse(row.permissions),
  };
}

export function getUserByEmail(email: string): User | null {
  const database = getDb();
  const row = database.prepare('SELECT * FROM users WHERE email = ?').get(email) as {
    id: string;
    name: string;
    email: string;
    role: string;
    permissions: string;
  } | undefined;

  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role as User['role'],
    permissions: JSON.parse(row.permissions),
  };
}

export function getAllUsers(): User[] {
  const database = getDb();
  const rows = database.prepare('SELECT * FROM users').all() as Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    permissions: string;
  }>;

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role as User['role'],
    permissions: JSON.parse(row.permissions),
  }));
}

// Policy operations
export function getAllPolicies(): Policy[] {
  const database = getDb();
  const rows = database.prepare('SELECT * FROM policies').all() as Array<{
    id: string;
    name: string;
    description: string;
    action_types: string;
    severity: string;
    threshold: number | null;
    conditions: string | null;
  }>;

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    actionTypes: JSON.parse(row.action_types),
    severity: row.severity as Severity,
    threshold: row.threshold ?? undefined,
    conditions: row.conditions ? JSON.parse(row.conditions) : undefined,
  }));
}

export function getPolicyById(id: string): Policy | null {
  const database = getDb();
  const row = database.prepare('SELECT * FROM policies WHERE id = ?').get(id) as {
    id: string;
    name: string;
    description: string;
    action_types: string;
    severity: string;
    threshold: number | null;
    conditions: string | null;
  } | undefined;

  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    description: row.description,
    actionTypes: JSON.parse(row.action_types),
    severity: row.severity as Severity,
    threshold: row.threshold ?? undefined,
    conditions: row.conditions ? JSON.parse(row.conditions) : undefined,
  };
}

// Decision operations
export function saveDecision(decision: DecisionRecord): void {
  const database = getDb();
  const stmt = database.prepare(`
    INSERT INTO decisions (id, user_id, user_name, raw_input, action_type, target, decision, confidence, risk_score, violated_policies, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    decision.id,
    decision.userId,
    decision.userName,
    decision.rawInput,
    decision.actionType,
    decision.target,
    decision.decision,
    decision.confidence,
    decision.riskScore,
    JSON.stringify(decision.violatedPolicies),
    decision.createdAt.toISOString()
  );
}

export function getRecentDecisions(limit: number = 10): DecisionRecord[] {
  const database = getDb();
  const rows = database.prepare(`
    SELECT * FROM decisions ORDER BY created_at DESC LIMIT ?
  `).all(limit) as Array<{
    id: string;
    user_id: string;
    user_name: string;
    raw_input: string;
    action_type: string;
    target: string;
    decision: string;
    confidence: number;
    risk_score: number;
    violated_policies: string;
    created_at: string;
  }>;

  return rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    userName: row.user_name,
    rawInput: row.raw_input,
    actionType: row.action_type as ActionType,
    target: row.target,
    decision: row.decision as DecisionType,
    confidence: row.confidence,
    riskScore: row.risk_score,
    violatedPolicies: JSON.parse(row.violated_policies),
    createdAt: new Date(row.created_at),
  }));
}

export function getDashboardStats(): DashboardStats {
  const database = getDb();

  const totalRow = database.prepare('SELECT COUNT(*) as count FROM decisions').get() as { count: number };
  const todayRow = database.prepare(`
    SELECT COUNT(*) as count FROM decisions WHERE DATE(created_at) = DATE('now')
  `).get() as { count: number };

  const decisions = database.prepare('SELECT * FROM decisions').all() as Array<{
    decision: string;
    confidence: number;
    risk_score: number;
    violated_policies: string;
  }>;

  const allowCount = decisions.filter((d) => d.decision === 'ALLOW').length;
  const denyCount = decisions.filter((d) => d.decision === 'DENY').length;
  const approvalRequiredCount = decisions.filter((d) => d.decision === 'REQUIRE_HUMAN_APPROVAL').length;

  const avgConfidence =
    decisions.length > 0
      ? Math.round(decisions.reduce((acc, d) => acc + d.confidence, 0) / decisions.length)
      : 0;

  const avgRiskScore =
    decisions.length > 0
      ? Math.round(decisions.reduce((acc, d) => acc + d.risk_score, 0) / decisions.length)
      : 0;

  // Compliance rate = decisions that didn't violate policies
  const compliantCount = decisions.filter((d) => {
    const violated = JSON.parse(d.violated_policies) as string[];
    return violated.length === 0;
  }).length;

  const complianceRate =
    decisions.length > 0 ? Math.round((compliantCount / decisions.length) * 100) : 100;

  return {
    totalDecisions: totalRow.count,
    decisionsToday: todayRow.count,
    allowCount,
    denyCount,
    approvalRequiredCount,
    avgConfidence,
    avgRiskScore,
    complianceRate,
  };
}