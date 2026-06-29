export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getDashboardStats, getRecentDecisions, getUserById, getAllPolicies } from '@/lib/db/sqlite';

export async function GET() {
  try {
    const stats = getDashboardStats();
    const recentDecisions = getRecentDecisions(10);
    const policies = getAllPolicies();
    const currentUser = getUserById('u1');

    return NextResponse.json({
      stats,
      recentDecisions,
      policiesCount: policies.length,
      currentUser: currentUser ? { name: currentUser.name, role: currentUser.role } : null,
    });
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}