import React from 'react';
import { useNavigate } from 'react-router-dom';

const GyaniBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-8 scroll-animate">
      {/* Outer card */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0d0d0d] border border-white/10 shadow-[0_0_60px_rgba(124,58,237,0.15)] p-8 md:p-12">

        {/* Glow blobs — positioned absolutely inside the card */}
        <div className="pointer-events-none absolute -top-20 -left-20 w-72 h-72 rounded-full bg-[var(--color-primary)]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-10 w-64 h-64 rounded-full bg-purple-700/10 blur-3xl" />

        {/* Content — full-width horizontal row */}
        <div className="relative z-10 w-full flex flex-col md:flex-row items-center md:items-start gap-8">

          {/* Bot icon */}
          <div className="shrink-0 w-20 h-20 rounded-2xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 flex items-center justify-center shadow-[0_0_30px_rgba(124,58,237,0.4)]">
            <span className="text-4xl select-none">🤖</span>
          </div>

          {/* Text block — takes all remaining space */}
          <div className="flex-1 min-w-0 text-center md:text-left">
            <p className="text-xs uppercase tracking-widest text-[var(--color-primary)] font-semibold mb-2">
              AI-Powered Election Guide
            </p>
            <h2 className="text-2xl md:text-3xl font-black text-white leading-snug mb-3">
              Confused about Voting?<br />
              <span className="text-[var(--color-primary)]">Have a talk with Gyani</span>
              <span className="text-white"> — ElectionBuddy</span>
            </h2>
            {/* paragraph is block-level inside a flex-1 div — will span full available width */}
            <p className="w-full text-gray-400 text-sm md:text-base">
              Your AI Guide to the 2026 Elections. Ask about voter registration, how EVMs work,
              election dates, NOTA, affidavit summaries, and more — Gyani has you covered.
            </p>
          </div>

          {/* CTA button */}
          <div className="shrink-0 self-center">
            <button
              id="gyani-cta-btn"
              onClick={() => navigate('/chat')}
              className="group relative px-7 py-4 rounded-2xl bg-[var(--color-primary)] text-white font-bold text-sm tracking-wide overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] cursor-pointer whitespace-nowrap"
            >
              <span className="relative z-10 flex items-center gap-2">
                Talk to Gyani-ElectionBuddy 🤖
                <span className="material-symbols-outlined text-base transition-transform duration-300 group-hover:translate-x-1">
                  arrow_forward
                </span>
              </span>
              {/* Hover shimmer overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default GyaniBanner;
