import React, { useEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/shared/Header';
import Home from './pages/Home';
import ChatPage from './pages/ChatPage';
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
  useEffect(() => {
    let rafId = null;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
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
  useEffect(() => {
    const observerOptions = {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px',
    };

    const intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          intersectionObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const observeAll = () => {
      document.querySelectorAll('.scroll-animate:not(.is-visible)').forEach((el) => {
        intersectionObserver.observe(el);
      });
    };

    observeAll();

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType !== Node.ELEMENT_NODE) return;
          if (node.classList && node.classList.contains('scroll-animate')) {
            intersectionObserver.observe(node);
          }
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
    <div className="text-slate-800 dark:text-gray-100 font-[var(--font-body-md)] antialiased min-h-screen flex flex-col relative bg-[#f8fafc] dark:bg-[#0A0A0A] transition-colors duration-300">
      <div
        ref={auraRef}
        id="cursor-aura"
        className="pointer-events-none fixed z-[1]"
        aria-hidden="true"
      />

      <Routes>
        {/* /chat is a full-screen takeover — no Header/Footer */}
        <Route path="/chat" element={<ChatPage />} />

        {/* All other routes share Header + Footer */}
        <Route
          path="/*"
          element={
            <>
              <Header />
              <Home />
              <footer role="contentinfo" className="w-full py-8 px-12 flex justify-between items-center max-w-[1440px] mx-auto bg-transparent z-10 relative mt-auto border-t border-black/5 dark:border-white/5">
                <p className="font-['Inter'] text-[10px] text-gray-500 dark:text-[var(--color-outline)] uppercase tracking-widest">
                  © 2024 Election Dynamics. {t('High-Fidelity Simulation Protocol')}
                </p>
                <div className="flex gap-6 font-['Inter'] text-[10px] text-gray-500 dark:text-[var(--color-outline)] uppercase tracking-widest">
                  <a className="text-gray-500 dark:text-[var(--color-outline)] hover:text-[var(--color-primary)] opacity-80 hover:opacity-100 transition-opacity" href="#">{t('Privacy')}</a>
                  <a className="text-gray-500 dark:text-[var(--color-outline)] hover:text-[var(--color-primary)] opacity-80 hover:opacity-100 transition-opacity" href="#">{t('Technical Manual')}</a>
                  <a className="text-gray-500 dark:text-[var(--color-outline)] hover:text-[var(--color-primary)] opacity-80 hover:opacity-100 transition-opacity" href="#">{t('Source Integrity')}</a>
                </div>
              </footer>
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
