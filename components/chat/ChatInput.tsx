'use client';

import React, { useState, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const exampleActions = [
    'Delete customer John Doe',
    'Send refund of $500',
    'Export CRM data',
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Quick action suggestions */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-[#71717a]">Try:</span>
        {exampleActions.map((example) => (
          <button
            key={example}
            onClick={() => setMessage(example)}
            disabled={disabled}
            className="rounded-full border border-[#27272a] bg-[#18181b] px-3 py-1 text-xs text-[#a1a1aa] transition-colors hover:border-[#6366f1] hover:text-[#a78bfa] disabled:opacity-50"
          >
            {example}
          </button>
        ))}
      </div>

      {/* Input area */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the action you want to perform..."
            disabled={disabled}
            className="h-11 bg-[#18181b] border-[#27272a] text-[#fafafa] placeholder:text-[#71717a] focus:border-[#6366f1] focus:ring-[#6366f1]/20 pr-12"
          />
        </div>
        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          size="icon"
          className={cn(
            'h-11 w-11 rounded-lg transition-all',
            message.trim() && !disabled && 'shadow-lg shadow-[#6366f1]/25'
          )}
        >
          {disabled ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          )}
        </Button>
      </div>
    </div>
  );
}