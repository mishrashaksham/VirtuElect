import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatInterface from '../components/Chat/ChatInterface';
import { useChatHistory } from '../hooks/useChatHistory';

const ChatPage = () => {
  const navigate = useNavigate();
  const {
    sessions,
    activeSession,
    activeSessionId,
    setActiveSessionId,
    createSession,
    addMessage,
    deleteSession,
    isLoaded,
  } = useChatHistory();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Ensure there's always an active session
  const resolvedSession = activeSession || (isLoaded ? createSession() : null);
  const sessionId = resolvedSession?.id ?? null;

  const handleAddMessage = (msg) => {
    if (sessionId) addMessage(sessionId, msg);
  };

  const handleNewChat = () => {
    createSession();
    setSidebarOpen(false);
  };

  return (
    <div className="fixed inset-0 flex bg-[#0A0A0A] text-gray-200 overflow-hidden">

      {/* ── Sidebar ── */}
      <aside className={`shrink-0 flex flex-col border-r border-white/5 bg-[#111111] transition-all duration-300 z-20 ${sidebarOpen ? 'w-64' : 'w-0 md:w-64'} overflow-hidden`}>

        {/* Sidebar header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="text-xl">🤖</span>
            <span className="font-bold text-sm text-white">Gyani-ElectionBuddy</span>
          </div>
          <button
            onClick={handleNewChat}
            title="New Chat"
            className="w-7 h-7 rounded-lg bg-[var(--color-primary)]/20 hover:bg-[var(--color-primary)]/40 flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[var(--color-primary)] text-base">add</span>
          </button>
        </div>

        {/* Session list */}
        <div className="flex-1 overflow-y-auto py-2">
          {sessions.length === 0 && (
            <p className="text-center text-xs text-gray-600 mt-8 px-4">No chats yet. Start a conversation!</p>
          )}
          {sessions.map((s) => (
            <div
              key={s.id}
              onClick={() => { setActiveSessionId(s.id); setSidebarOpen(false); }}
              className={`group flex items-center justify-between px-3 py-2.5 mx-2 rounded-xl cursor-pointer transition-colors ${
                s.id === activeSessionId ? 'bg-[var(--color-primary)]/15 text-white' : 'hover:bg-white/5 text-gray-400'
              }`}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="material-symbols-outlined text-sm shrink-0 text-gray-500">chat</span>
                <p className="text-xs truncate">{s.title}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); deleteSession(s.id); }}
                className="opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center rounded-md hover:bg-red-500/20 hover:text-red-400 transition-all shrink-0 cursor-pointer"
              >
                <span className="material-symbols-outlined text-xs">close</span>
              </button>
            </div>
          ))}
        </div>

        {/* Back to home */}
        <div className="p-3 border-t border-white/5">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-colors text-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back to VirtuElect
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-10 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Main Chat Area ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-[#0d0d0d] shrink-0">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-gray-400">menu</span>
          </button>

          {/* Identity */}
          <div className="flex items-center gap-2">
            <span className="text-xl">🤖</span>
            <div>
              <h1 className="text-sm font-bold text-white leading-none">Gyani-ElectionBuddy</h1>
              <p className="text-[10px] text-[var(--color-primary)] mt-0.5">AI Guide to the 2026 Elections</p>
            </div>
          </div>

          {/* Status + Close */}
          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
              <span className="text-xs text-gray-500">Online</span>
            </div>
            <button
              id="gyani-close-btn"
              onClick={() => navigate('/')}
              title="Close chat"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer font-bold text-base"
            >
              ✖
            </button>
          </div>
        </div>

        {/* Chat interface */}
        <div className="flex-1 overflow-hidden">
          {resolvedSession ? (
            <ChatInterface
              messages={resolvedSession.messages}
              onAddMessage={handleAddMessage}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="w-6 h-6 border-2 border-white/20 border-t-[var(--color-primary)] rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
