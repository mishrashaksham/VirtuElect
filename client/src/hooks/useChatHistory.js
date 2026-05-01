import { useState, useEffect } from 'react';

const STORAGE_KEY = 'gyani-chats';

export function useChatHistory() {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored).map((s) => {
          const uniqueIds = new Set();
          return {
            ...s,
            messages: s.messages
              .filter((m) => {
                if (uniqueIds.has(m.id)) return false;
                uniqueIds.add(m.id);
                return true;
              })
              .map((m) => ({ ...m, timestamp: new Date(m.timestamp) })),
          };
        });
        setSessions(parsed);
        if (parsed.length > 0) setActiveSessionId(parsed[0].id);
      }
    } catch (e) {
      console.error('Failed to load chat history', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Persist to localStorage whenever sessions change
  useEffect(() => {
    if (isLoaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions, isLoaded]);

  const createSession = () => {
    // Don't create a new session if the current one is already empty
    const currentActive = sessions.find((s) => s.id === activeSessionId);
    if (currentActive && currentActive.messages.length <= 1) return currentActive;

    const newSession = {
      id: crypto.randomUUID(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    return newSession;
  };

  const addMessage = (sessionId, message) => {
    setSessions((prev) =>
      prev
        .map((s) => {
          if (s.id !== sessionId) return s;
          if (s.messages.some((m) => m.id === message.id)) return s; // deduplicate
          const updatedMessages = [...s.messages, message];
          const updated = { ...s, messages: updatedMessages, updatedAt: Date.now() };
          // Auto-title from first user message
          if (s.title === 'New Chat' && message.role === 'user') {
            updated.title = message.content.slice(0, 32) + (message.content.length > 32 ? '...' : '');
          }
          return updated;
        })
        .sort((a, b) => b.updatedAt - a.updatedAt)
    );
  };

  const deleteSession = (id) => {
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      if (activeSessionId === id) {
        setActiveSessionId(filtered.length > 0 ? filtered[0].id : null);
      }
      return filtered;
    });
  };

  const clearAll = () => {
    setSessions([]);
    setActiveSessionId(null);
  };

  const activeSession = sessions.find((s) => s.id === activeSessionId) || null;

  return {
    sessions,
    activeSession,
    activeSessionId,
    setActiveSessionId,
    createSession,
    addMessage,
    deleteSession,
    clearAll,
    isLoaded,
  };
}
