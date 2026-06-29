'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuditLog } from '@/components/dashboard/AuditLog';
import { PolicyCompliance } from '@/components/dashboard/PolicyCompliance';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { PolicyList } from '@/components/ui/PolicyCard';
import { RiskGauge } from '@/components/ui/RiskGauge';
import { DashboardStats, DecisionRecord, Policy } from '@/lib/types';
import { MOCK_POLICIES } from '@/lib/decision/policyEngine';
import { cn } from '@/lib/utils';

export default function Home() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'chat' | 'policies' | 'audit'>('dashboard');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentDecisions, setRecentDecisions] = useState<DecisionRecord[]>([]);
  const [currentUser, setCurrentUser] = useState<string>('Sarah Chen');
  const [complianceRate, setComplianceRate] = useState<number>(100);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  const loadData = async () => {
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();
      if (data.stats) {
        setStats(data.stats);
        setComplianceRate(data.stats.complianceRate);
      }
      if (data.recentDecisions) {
        setRecentDecisions(data.recentDecisions);
      }
      if (data.currentUser) {
        setCurrentUser(data.currentUser.name);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (currentView === 'dashboard' || currentView === 'audit') {
      const interval = setInterval(loadData, 5000);
      return () => clearInterval(interval);
    }
  }, [currentView]);

  const handleViewChange = (view: 'dashboard' | 'chat' | 'policies' | 'audit') => {
    setCurrentView(view);
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleQuickAction = (action: string) => {
    setCurrentView('chat');
  };

  // Update Header to include theme toggle
  const renderHeader = () => {
    const titles = {
      dashboard: { title: 'Dashboard', subtitle: `Welcome back, ${currentUser}` },
      chat: { title: 'Decision Engine', subtitle: 'Describe an action to analyze' },
      policies: { title: 'Business Policies', subtitle: 'Security and compliance rules' },
      audit: { title: 'Audit Log', subtitle: 'Decision history and compliance' },
    };

    return (
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-xl px-4 sm:px-8">
        <div>
          <h1 className="text-lg font-semibold text-[var(--foreground)]">{titles[currentView].title}</h1>
          <p className="text-sm text-[var(--foreground-muted)]">{titles[currentView].subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 rounded-full bg-[var(--background-secondary)] border border-[var(--border)] px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--success)] animate-pulse" />
            <span className="text-xs font-medium text-[var(--foreground-secondary)]">System Online</span>
          </div>
          <ThemeToggle />
        </div>
      </header>
    );
  };

  const renderDashboard = () => (
    <div className="p-4 sm:p-8">
      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="animate-fade-in stagger-1">
          <StatsCard
            title="Total Decisions"
            value={stats?.totalDecisions || 0}
            subtitle="All time"
            color="indigo"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              </svg>
            }
          />
        </div>
        <div className="animate-fade-in stagger-2">
          <StatsCard
            title="Today's Decisions"
            value={stats?.decisionsToday || 0}
            subtitle="Last 24 hours"
            color="blue"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            }
          />
        </div>
        <div className="animate-fade-in stagger-3">
          <StatsCard
            title="Approval Rate"
            value={stats?.allowCount || 0}
            subtitle="Approved actions"
            color="green"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            }
          />
        </div>
        <div className="animate-fade-in stagger-4">
          <StatsCard
            title="Avg Confidence"
            value={`${stats?.avgConfidence || 0}%`}
            subtitle="System confidence"
            color="amber"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                <path d="M5 3v4" />
                <path d="M19 17v4" />
                <path d="M3 5h4" />
                <path d="M17 19h4" />
              </svg>
            }
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h3 className="mb-4 text-sm font-medium text-[var(--foreground-secondary)]">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Delete Customer', color: 'danger' },
            { label: 'Send Refund', color: 'warning' },
            { label: 'Export CRM', color: 'info' },
            { label: 'Change Plan', color: 'default' },
          ].map((action) => (
            <button
              key={action.label}
              onClick={() => handleQuickAction(action.label)}
              className="rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] px-4 py-2 text-sm text-[var(--foreground-secondary)] transition-colors hover:border-[var(--accent)] hover:text-[var(--foreground)]"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AuditLog decisions={recentDecisions} />
        </div>
        <div className="space-y-6">
          <PolicyCompliance complianceRate={complianceRate} />
          <Card className="card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <RiskGauge score={stats?.avgRiskScore || 0} level={stats?.avgRiskScore ? (stats.avgRiskScore >= 80 ? 'CRITICAL' : stats.avgRiskScore >= 60 ? 'HIGH' : stats.avgRiskScore >= 30 ? 'MEDIUM' : 'LOW') : 'LOW'} size="lg" />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-[var(--success)]">{stats?.allowCount || 0}</p>
                  <p className="text-xs text-[var(--foreground-muted)]">Allowed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[var(--danger)]">{stats?.denyCount || 0}</p>
                  <p className="text-xs text-[var(--foreground-muted)]">Denied</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[var(--warning)]">{stats?.approvalRequiredCount || 0}</p>
                  <p className="text-xs text-[var(--foreground-muted)]">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderPolicies = () => (
    <div className="p-4 sm:p-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="mb-4 text-lg font-semibold text-[var(--foreground)]">All Policies</h3>
          <PolicyList policies={MOCK_POLICIES} maxDisplay={10} />
        </div>
        <div>
          <h3 className="mb-4 text-lg font-semibold text-[var(--foreground)]">Policy Overview</h3>
          <Card className="card">
            <CardContent className="p-6">
              <div className="mb-6">
                <PolicyCompliance complianceRate={complianceRate} />
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-[var(--foreground)]">By Severity</h4>
                {[
                  { label: 'Critical', count: MOCK_POLICIES.filter(p => p.severity === 'critical').length, color: 'bg-[var(--danger)]' },
                  { label: 'High', count: MOCK_POLICIES.filter(p => p.severity === 'high').length, color: 'bg-[var(--warning)]' },
                  { label: 'Medium', count: MOCK_POLICIES.filter(p => p.severity === 'medium').length, color: 'bg-[var(--info)]' },
                  { label: 'Low', count: MOCK_POLICIES.filter(p => p.severity === 'low').length, color: 'bg-[var(--success)]' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={cn('h-2 w-2 rounded-full', item.color)} />
                      <span className="text-sm text-[var(--foreground-secondary)]">{item.label}</span>
                    </div>
                    <span className="text-sm font-medium text-[var(--foreground)]">{item.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderAudit = () => (
    <div className="p-4 sm:p-8">
      <AuditLog decisions={recentDecisions} />
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <Sidebar
        currentView={currentView}
        onViewChange={handleViewChange}
        isOpen={sidebarOpen}
        onToggle={handleSidebarToggle}
      />

      <main className={cn(
        'flex-1 transition-all duration-300 ease-out min-h-screen',
        sidebarOpen ? 'pl-[240px]' : 'pl-3'
      )}>
        {renderHeader()}

        {currentView === 'dashboard' && renderDashboard()}
        {currentView === 'chat' && <ChatPanel />}
        {currentView === 'policies' && renderPolicies()}
        {currentView === 'audit' && renderAudit()}
      </main>
    </div>
  );
}