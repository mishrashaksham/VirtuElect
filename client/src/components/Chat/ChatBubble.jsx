import React from 'react';

// ── Markdown-like bold renderer (handles **text**)
function renderContent(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

// ── Individual message line renderer (handles numbered lists & bullets)
function MessageContent({ content }) {
  const lines = content.split('\n').filter(Boolean);
  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        const numberedMatch = line.match(/^(\d+)\.\s+(.*)/);
        const bulletMatch = line.match(/^[-•]\s+(.*)/);
        if (numberedMatch) {
          return (
            <p key={i} className="flex gap-2">
              <span className="shrink-0 font-bold text-[var(--color-primary)]">{numberedMatch[1]}.</span>
              <span>{renderContent(numberedMatch[2])}</span>
            </p>
          );
        }
        if (bulletMatch) {
          return (
            <p key={i} className="flex gap-2">
              <span className="shrink-0 text-[var(--color-primary)]">•</span>
              <span>{renderContent(bulletMatch[1])}</span>
            </p>
          );
        }
        return <p key={i}>{renderContent(line)}</p>;
      })}
    </div>
  );
}

// ── Typing indicator bubble
export function TypingBubble() {
  return (
    <div className="flex items-end gap-3">
      <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/30 flex items-center justify-center text-base shrink-0">
        🤖
      </div>
      <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}

// ── Main ChatBubble component
const ChatBubble = ({ message }) => {
  const isUser = message.role === 'user';
  const time = message.timestamp instanceof Date
    ? message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  if (isUser) {
    return (
      <div className="flex flex-col items-end gap-1">
        <div className="bg-[var(--color-primary)] text-white px-5 py-3 rounded-2xl rounded-br-sm max-w-[80%] text-sm leading-relaxed shadow-[0_4px_20px_rgba(124,58,237,0.3)]">
          <MessageContent content={message.content} />
        </div>
        {time && <span className="text-[10px] text-gray-600 pr-1">{time}</span>}
      </div>
    );
  }

  return (
    <div className="flex items-end gap-3">
      <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/30 flex items-center justify-center text-base shrink-0">
        🤖
      </div>
      <div className="flex flex-col gap-1 max-w-[82%]">
        <div className="bg-[#1a1a1a] border border-white/5 text-gray-200 px-5 py-3 rounded-2xl rounded-bl-sm text-sm leading-relaxed">
          <MessageContent content={message.content} />

          {/* Structured polling locations */}
          {message.structuredData?.pollingLocations?.length > 0 && (
            <div className="mt-4 space-y-2">
              {message.structuredData.pollingLocations.map((loc, i) => (
                <div key={i} className="bg-[#0d0d0d] border border-white/10 rounded-xl p-3 text-xs">
                  <p className="font-bold text-white mb-0.5">📍 {loc.name}</p>
                  <p className="text-gray-400">{loc.address}</p>
                  {loc.hours && <p className="text-gray-500 mt-1">⏰ {loc.hours}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Structured links */}
          {message.structuredData?.links?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {message.structuredData.links.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-3 py-1.5 rounded-full border border-[var(--color-primary)]/40 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors"
                >
                  🔗 {link.title}
                </a>
              ))}
            </div>
          )}
        </div>
        {time && <span className="text-[10px] text-gray-600 pl-1">{time}</span>}
      </div>
    </div>
  );
};

export default ChatBubble;
