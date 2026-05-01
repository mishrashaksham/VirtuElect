import React, { useEffect, useState, useRef } from 'react';
import Header from './components/shared/Header';
import EVMSimulator from './components/EVM/EVMSimulator';
import VoterJourney from './components/Journey/VoterJourney';
import ElectionProcessTimeline from './components/Journey/ElectionProcessTimeline';
import KnowYourCandidate from './components/Dashboard/KnowYourCandidate';
import useAppStore from './store/appStore';
import { useTranslate } from './context/TranslationContext';

function App() {
  const { t } = useTranslate();
  const auraRef = useRef(null);

  // ── Theme ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add('dark');
    html.setAttribute('data-theme', 'dark');
  }, []);

  // ── Cursor Aura ────────────────────────────────────────────────────────────
  // FIX: Use requestAnimationFrame for smooth, non-jittery tracking.
  // The previous implementation set style directly in the event handler which
  // can fire faster than the browser paints, causing jitter.
  useEffect(() => {
    let rafId = null;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Cancel any pending frame before scheduling a new one
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (auraRef.current) {
          auraRef.current.style.left = `${mouseX}px`;
          auraRef.current.style.top = `${mouseY}px`;
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // ── Scroll Animations ──────────────────────────────────────────────────────
  // FIX: The previous implementation used a 500ms setTimeout which was a race
  // condition — if React renders slowly or lazily, elements weren't found.
  // Instead: observe immediately + use a MutationObserver to catch any elements
  // added after the initial render (e.g. from lazy-loaded child components).
  useEffect(() => {
    const observerOptions = {
      threshold: 0.08,       // Trigger when 8% of element is visible
      rootMargin: '0px 0px -40px 0px', // Trigger slightly before fully in view
    };

    const intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Once visible, stop observing — animation is one-shot
          intersectionObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all currently-rendered scroll-animate elements
    const observeAll = () => {
      document.querySelectorAll('.scroll-animate:not(.is-visible)').forEach((el) => {
        intersectionObserver.observe(el);
      });
    };

    // Run immediately (covers SSR hydration and fast renders)
    observeAll();

    // FIX: Also watch for new .scroll-animate elements added later (child components
    // that render asynchronously or after data fetch). MutationObserver watches
    // the entire document subtree for new nodes.
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType !== Node.ELEMENT_NODE) return;
          // Check the added node itself
          if (node.classList && node.classList.contains('scroll-animate')) {
            intersectionObserver.observe(node);
          }
          // Check its descendants
          node.querySelectorAll?.('.scroll-animate:not(.is-visible)').forEach((el) => {
            intersectionObserver.observe(el);
          });
        });
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      intersectionObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return (
        <div className="text-slate-800 dark:text-gray-100 font-[var(--font-body-md)] antialiased min-h-screen flex flex-col relative bg-[#f8fafc] dark:bg-[#0A0A0A] transition-colors duration-300">      {/*
        FIX: z-index corrected. The aura must render ABOVE the background but
        BELOW all content. Use z-[1] (not z-0 which can be overridden to -1 by
        some Tailwind resets) so it stays visible, and pointer-events-none keeps
        it non-interactive. The CSS in index.css no longer sets z-index:-1.
      */}
      <div
        ref={auraRef}
        id="cursor-aura"
        className="pointer-events-none fixed z-[1]"
        aria-hidden="true"
      />

      <Header />

      <main className="flex-1 flex flex-col items-center w-full pb-20 z-10 relative">
        {/* Hero Section */}
        <section className="min-h-[80vh] flex flex-col items-center justify-center p-10 w-full scroll-animate">
          <div className="text-center mb-10">
            <h2 className="font-[var(--font-display-xl)] text-[64px] text-gray-900 dark:text-gray-100 mb-4 font-black tracking-tight">
              {t('Next-Gen Voting')}
            </h2>
            <p className="font-[var(--font-body-lg)] text-2xl text-gray-700 dark:text-gray-200 max-w-2xl mx-auto">
              {t('The future of secure, verifiable digital democracy.')}
            </p>
          </div>
          <div className="w-full max-w-4xl glass-panel rounded-[3rem] p-12 shadow-2xl flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full neu-raised bg-gray-200 dark:bg-[#151515] flex items-center justify-center mb-8">
              <span className="material-symbols-outlined text-5xl text-[var(--color-primary)]" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
            </div>
            <h3 className="font-[var(--font-headline-lg)] text-[32px] text-gray-900 dark:text-gray-100 mb-4">
              {t('High-Fidelity Simulation Protocol')}
            </h3>
            <p className="font-[var(--font-body-lg)] text-[18px] text-gray-700 dark:text-gray-200 max-w-3xl">
              {t('Explore the intricate mechanics of a secure Electronic Voting Machine through our advanced lumina tactile interface. Experience uncompromised security coupled with transparent verification.')}
            </p>
          </div>
        </section>

        <ElectionProcessTimeline />

        <VoterJourney />

        <div id="know-your-candidate" className="w-full">
          <KnowYourCandidate />
        </div>

        <EVMSimulator />
      </main>

      <footer className="w-full py-8 px-12 flex justify-between items-center max-w-[1440px] mx-auto bg-transparent z-10 relative mt-auto border-t border-black/5 dark:border-white/5">
        <p className="font-['Inter'] text-[10px] text-gray-500 dark:text-[var(--color-outline)] uppercase tracking-widest">
          © 2024 Election Dynamics. {t('High-Fidelity Simulation Protocol')}
        </p>
        <div className="flex gap-6 font-['Inter'] text-[10px] text-gray-500 dark:text-[var(--color-outline)] uppercase tracking-widest">
          <a className="text-gray-500 dark:text-[var(--color-outline)] hover:text-[var(--color-primary)] opacity-80 hover:opacity-100 transition-opacity" href="#">{t('Privacy')}</a>
          <a className="text-gray-500 dark:text-[var(--color-outline)] hover:text-[var(--color-primary)] opacity-80 hover:opacity-100 transition-opacity" href="#">{t('Technical Manual')}</a>
          <a className="text-gray-500 dark:text-[var(--color-outline)] hover:text-[var(--color-primary)] opacity-80 hover:opacity-100 transition-opacity" href="#">{t('Source Integrity')}</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
