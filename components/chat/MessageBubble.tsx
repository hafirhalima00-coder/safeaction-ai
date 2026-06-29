'use client';

import React from 'react';
import { cn, formatDate } from '@/lib/utils';
import { ChatMessage } from '@/lib/types';

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex w-full', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-3',
          isUser
            ? 'bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white shadow-lg shadow-[#6366f1]/20'
            : 'bg-[#18181b] text-[#fafafa] border border-[#27272a]'
        )}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed">{message.content}</p>
        ) : (
          <div className="space-y-1">
            <p className="text-sm text-[#a1a1aa]">
              {message.decisionReport ? 'Here is my decision:' : message.content || 'How can I help you today?'}
            </p>
            <span className="text-xs text-[#71717a]">{formatDate(message.timestamp)}</span>
          </div>
        )}
      </div>
    </div>
  );
}