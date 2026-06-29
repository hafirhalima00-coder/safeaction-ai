'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { DecisionResult } from './DecisionResult';
import { ChatMessage, DecisionReport } from '@/lib/types';
import { generateId } from '@/lib/utils';

export function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      decisionReport: undefined,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (content: string) => {
    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    const loadingMessage: ChatMessage = {
      id: 'loading',
      role: 'assistant',
      content: 'Analyzing request...',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, loadingMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'u1', actionRequest: content }),
      });

      const data = await response.json();

      if (data.report) {
        const decisionMessage: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          content: 'Analysis complete',
          timestamp: new Date(),
          decisionReport: data.report,
        };
        setMessages((prev) => [...prev.slice(0, -1), decisionMessage]);
      } else if (data.error) {
        const errorMessage: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          content: `Error: ${data.error}`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev.slice(0, -1), errorMessage]);
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: 'Failed to analyze request. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev.slice(0, -1), errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: generateId(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        decisionReport: undefined,
      },
    ]);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Chat header */}
      <div className="flex items-center justify-between border-b border-[#27272a] px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-[#fafafa]">Decision Engine</h2>
          <p className="text-sm text-[#71717a]">Describe an action to analyze</p>
        </div>
        <button
          onClick={handleClearChat}
          className="rounded-lg border border-[#27272a] bg-transparent px-3 py-1.5 text-sm text-[#71717a] transition-colors hover:border-[#3f3f46] hover:text-[#fafafa]"
        >
          Clear
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="animate-fade-in">
              <MessageBubble message={message} />
              {message.decisionReport && (
                <div className="mt-2">
                  <DecisionResult report={message.decisionReport} />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-[#27272a] p-6 bg-[#09090b]">
        <ChatInput onSend={handleSend} disabled={isLoading} />
      </div>
    </div>
  );
}