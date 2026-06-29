'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';

interface SidebarProps {
  currentView: 'dashboard' | 'chat' | 'policies' | 'audit';
  onViewChange: (view: 'dashboard' | 'chat' | 'policies' | 'audit') => void;
  isOpen: boolean;
  onToggle: () => void;
}

const navItems = [
  {
    id: 'dashboard' as const,
    label: 'Dashboard',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="7" height="9" x="3" y="3" rx="1" />
        <rect width="7" height="5" x="14" y="3" rx="1" />
        <rect width="7" height="9" x="14" y="12" rx="1" />
        <rect width="7" height="5" x="3" y="16" rx="1" />
      </svg>
    ),
  },
  {
    id: 'chat' as const,
    label: 'Decision Engine',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    id: 'policies' as const,
    label: 'Policies',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      </svg>
    ),
  },
  {
    id: 'audit' as const,
    label: 'Audit Log',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
];

const user = {
  name: 'Sarah Chen',
  role: 'Administrator',
};

export function Sidebar({ currentView, onViewChange, isOpen, onToggle }: SidebarProps) {
  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed left-3 top-4 z-50 flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--background-secondary)] border border-[var(--border)] text-[var(--foreground-muted)] hover:bg-[var(--background-tertiary)] hover:text-[var(--foreground)] transition-colors"
        title={isOpen ? 'Hide Sidebar' : 'Show Sidebar'}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen bg-[var(--background)] border-r border-[var(--border)] transition-all duration-300 ease-out',
          isOpen ? 'w-[240px] translate-x-0' : 'w-[240px] -translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-[var(--border)] px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] shadow-lg shadow-[var(--accent)]/25">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <div>
            <span className="text-base font-bold text-[var(--foreground)]">SafeAction</span>
            <span className="ml-1 text-xs font-medium text-[var(--accent)]">AI</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 p-3 mt-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative overflow-hidden',
                currentView === item.id
                  ? 'bg-[var(--accent)]/10 text-[var(--accent-glow)]'
                  : 'text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)] hover:text-[var(--foreground)]'
              )}
            >
              {currentView === item.id && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[var(--accent)] rounded-r-full" />
              )}
              <span className={cn(
                'transition-colors',
                currentView === item.id ? 'text-[var(--accent-glow)]' : 'text-[var(--foreground-muted)] group-hover:text-[var(--foreground-secondary)]'
              )}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Divider */}
        <div className="mx-3 my-4 h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-[var(--border)] p-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar name={user.name} />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[var(--background)] bg-[var(--success)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--foreground)] truncate">{user.name}</p>
              <p className="text-xs text-[var(--foreground-muted)]">{user.role}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}