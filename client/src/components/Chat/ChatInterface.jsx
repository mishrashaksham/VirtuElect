import React, { useState, useRef, useEffect } from 'react';
import ChatBubble, { TypingBubble } from './ChatBubble';
import API_BASE_URL from '../../config';

const QUICK_QUESTIONS = [
  'How do I register to vote in India?',
  'What is an EVM and how does it work?',
  'What is VVPAT?',
  'When is the next Lok Sabha election?',
  'What ID do I need to vote?',
  'What is NOTA?',
];

const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Namaste! 🙏 I'm **Gyani-ElectionBuddy** — your AI guide to the 2026 Elections.\n\nI can help you with:\n- Voter registration steps & EPIC card\n- How EVMs and VVPAT work\n- Lok Sabha & Vidhan Sabha election process\n- Candidate information & affidavits\n- Election results and history\n\nKya jaanna chahte ho? Ask me anything!",
  timestamp: new Date(),
  responseType: 'text',
};

// address prop removed — no longer needed
const ChatInterface = ({ messages, onAddMessage }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Inject welcome message if empty
  useEffect(() => {
    if (!messages.some((m) => m.id === 'welcome')) {
      onAddMessage(WELCOME_MESSAGE);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };
    onAddMessage(userMessage);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim(), history }),
      });

      const data = await res.json();

      onAddMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.reply || data.error || 'Sorry, I could not get a response.',
        timestamp: new Date(),
        responseType: data.responseType ?? 'text',
        structuredData: data.structuredData,
      });
    } catch (err) {
      console.error('[ChatInterface] fetch error:', err);
      onAddMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "I'm sorry, something went wrong connecting to the server. Please check your connection and try again.",
        timestamp: new Date(),
        responseType: 'text',
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
  };

  return (
    <div className="flex flex-col h-full">

      {/* ── Message list ── */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5" style={{ minHeight: 0 }}>
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        {isLoading && <TypingBubble />}
        <div ref={bottomRef} />
      </div>

      {/* ── Quick Questions ── */}
      <div className="px-4 py-3 border-t border-white/5">
        <p className="text-xs text-gray-600 mb-2 uppercase tracking-widest">Quick Questions</p>
        <div className="flex gap-2 flex-wrap">
          {QUICK_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              disabled={isLoading}
              id={`quick-${q.replace(/\s+/g, '-').toLowerCase().slice(0, 25)}`}
              className="text-xs px-3 py-1.5 rounded-full border border-[var(--color-primary)]/30 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* ── Input area ── */}
      <div className="px-4 py-4 border-t border-white/5 bg-[#0d0d0d]">
        <div className="flex items-end gap-3 rounded-2xl border border-white/10 bg-[#1a1a1a] px-4 py-3 focus-within:border-[var(--color-primary)]/50 focus-within:shadow-[0_0_20px_rgba(124,58,237,0.15)] transition-all duration-300">
          <textarea
            ref={inputRef}
            id="gyani-chat-input"
            rows={1}
            className="flex-1 resize-none bg-transparent text-gray-200 placeholder-gray-600 text-sm focus:outline-none max-h-32 leading-relaxed py-1"
            placeholder="Kuch poochho — elections, registration, EVMs..."
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            style={{ height: '36px' }}
          />
          <button
            id="gyani-send-btn"
            onClick={() => sendMessage(input)}
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
            className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--color-primary)] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 hover:shadow-[0_0_15px_rgba(124,58,237,0.5)] transition-all duration-200 cursor-pointer"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span className="material-symbols-outlined text-[18px]">send</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
