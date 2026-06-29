'use client';

import React from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#27272a] bg-[#09090b]/80 backdrop-blur-xl px-8">
      <div>
        <h1 className="text-lg font-semibold text-[#fafafa]">{title}</h1>
        {subtitle && <p className="text-sm text-[#71717a]">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-full bg-[#18181b] border border-[#27272a] px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-[#22c55e] animate-pulse" />
          <span className="text-xs font-medium text-[#a1a1aa]">System Online</span>
        </div>
        <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#18181b] border border-[#27272a] text-[#71717a] hover:text-[#fafafa] hover:border-[#3f3f46]">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </button>
      </div>
    </header>
  );
}