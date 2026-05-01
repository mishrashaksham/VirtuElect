import React from 'react';
import EVMSimulator from '../components/EVM/EVMSimulator';
import VoterJourney from '../components/Journey/VoterJourney';
import ElectionProcessTimeline from '../components/Journey/ElectionProcessTimeline';
import GyaniBanner from '../components/Banner/GyaniBanner';
import KnowYourCandidate from '../components/Dashboard/KnowYourCandidate';
import { useTranslate } from '../context/TranslationContext';

const Home = () => {
  const { t } = useTranslate();

  return (
    <main role="main" className="flex-1 flex flex-col items-center w-full pb-20 z-10 relative">

      {/* ── Hero Section ─────────────────────────────────────────────────── */}
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
            <span
              className="material-symbols-outlined text-5xl text-[var(--color-primary)]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              security
            </span>
          </div>
          <h3 className="font-[var(--font-headline-lg)] text-[32px] text-gray-900 dark:text-gray-100 mb-4">
            {t('High-Fidelity Simulation Protocol')}
          </h3>
          <p className="font-[var(--font-body-lg)] text-[18px] text-gray-700 dark:text-gray-200 max-w-3xl">
            {t('Explore the intricate mechanics of a secure Electronic Voting Machine through our advanced lumina tactile interface. Experience uncompromised security coupled with transparent verification.')}
          </p>
        </div>
      </section>

      {/* ── Gyani-ElectionBuddy Banner ───────────────────────────────────── */}
      <GyaniBanner />

      {/* ── Election Process Timeline ────────────────────────────────────── */}
      <ElectionProcessTimeline />

      {/* ── Know Your Candidate — dropdown + candidate cards ─────────────── */}
      <div id="know-your-candidate" className="w-full">
        <KnowYourCandidate />
      </div>



      {/* ── Voter Journey — secure process timeline steps ────────────────── */}
      <VoterJourney />

      {/* ── EVM Simulator + VVPAT ────────────────────────────────────────── */}
      <EVMSimulator />

    </main>
  );
};

export default Home;
