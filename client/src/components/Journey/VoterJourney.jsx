import React from 'react';
import { useTranslate } from '../../context/TranslationContext';

const VoterJourney = () => {
  const { t } = useTranslate();

  return (
    <section className="w-full max-w-4xl mx-auto py-24 px-10">
      <h2 className="font-[var(--font-display-xl)] text-[40px] text-center mb-20 text-gray-900 dark:text-gray-100 scroll-animate">
        {t('The Secure Voting Process')}
      </h2>
      <div className="flex flex-col relative w-full items-center">
        {/* Step 1 */}
        <div className="timeline-node relative w-full flex flex-col md:flex-row items-center md:justify-between mb-16 scroll-animate gap-6 md:gap-0" style={{ transitionDelay: '100ms' }}>
          <div className="w-full md:w-5/12 md:pr-10 flex justify-center md:justify-end order-2 md:order-1">
            <div className="bg-[#151515] p-6 rounded-2xl border border-white/5 transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:bg-[#1a1a1a] hover:shadow-[0_10px_20px_rgba(0,0,0,0.5)] cursor-pointer text-left w-full max-w-[400px]">
              <h3 className="font-[var(--font-headline-md)] text-[var(--color-primary)] mb-2">{t('Step 1: Registration')}</h3>
              <p className="font-[var(--font-body-md)] text-gray-400">
                {t('Voters establish their digital identity and eligibility within the secure electoral roll network.')}
              </p>
            </div>
          </div>
          <div className="w-16 h-16 shrink-0 rounded-full neu-raised bg-gray-200 dark:bg-[#151515] flex items-center justify-center z-10 shadow-[0_0_20px_rgba(124,58,237,0.4)] order-1 md:order-2">
            <span className="material-symbols-outlined text-2xl text-[var(--color-primary)]">app_registration</span>
          </div>
          <div className="hidden md:block w-5/12 pl-10 order-3"></div>
        </div>

        {/* Step 2 */}
        <div className="timeline-node relative w-full flex flex-col md:flex-row items-center md:justify-between mb-16 scroll-animate gap-6 md:gap-0" style={{ transitionDelay: '200ms' }}>
          <div className="hidden md:block w-5/12 pr-10 order-3 md:order-1"></div>
          <div className="w-16 h-16 shrink-0 rounded-full neu-raised bg-gray-200 dark:bg-[#151515] flex items-center justify-center z-10 shadow-[0_0_20px_rgba(137,206,255,0.4)] order-1 md:order-2">
            <span className="material-symbols-outlined text-2xl text-[var(--color-secondary)]">assignment_ind</span>
          </div>
          <div className="w-full md:w-5/12 md:pl-10 flex justify-center md:justify-start order-2 md:order-3">
            <div className="bg-[#151515] p-6 rounded-2xl border border-white/5 transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:bg-[#1a1a1a] hover:shadow-[0_10px_20px_rgba(0,0,0,0.5)] cursor-pointer text-left w-full max-w-[400px]">
              <h3 className="font-[var(--font-headline-md)] text-[var(--color-secondary)] mb-2">{t('Step 2: KYC & Affidavits')}</h3>
              <p className="font-[var(--font-body-md)] text-gray-400">
                {t('Candidates submit immutable cryptographic affidavits regarding assets, history, and background.')}
              </p>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="timeline-node relative w-full flex flex-col md:flex-row items-center md:justify-between mb-16 scroll-animate gap-6 md:gap-0" style={{ transitionDelay: '300ms' }}>
          <div className="w-full md:w-5/12 md:pr-10 flex justify-center md:justify-end order-2 md:order-1">
            <div className="bg-[#151515] p-6 rounded-2xl border border-white/5 transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:bg-[#1a1a1a] hover:shadow-[0_10px_20px_rgba(0,0,0,0.5)] cursor-pointer text-left w-full max-w-[400px]">
              <h3 className="font-[var(--font-headline-md)] text-[var(--color-tertiary)] mb-2">{t('Step 3: EVM Voting')}</h3>
              <p className="font-[var(--font-body-md)] text-gray-400">
                {t('Tactile selection interface capturing intent precisely without reliance on vulnerable networks.')}
              </p>
            </div>
          </div>
          <div className="w-16 h-16 shrink-0 rounded-full neu-raised bg-gray-200 dark:bg-[#151515] flex items-center justify-center z-10 shadow-[0_0_20px_rgba(255,183,132,0.4)] order-1 md:order-2">
            <span className="material-symbols-outlined text-2xl text-[var(--color-tertiary)]">how_to_vote</span>
          </div>
          <div className="hidden md:block w-5/12 pl-10 order-3"></div>
        </div>

        {/* Step 4 */}
        <div className="timeline-node relative w-full flex flex-col md:flex-row items-center md:justify-between scroll-animate gap-6 md:gap-0" style={{ transitionDelay: '400ms' }}>
          <div className="hidden md:block w-5/12 pr-10 order-3 md:order-1"></div>
          <div className="w-16 h-16 shrink-0 rounded-full neu-raised bg-gray-200 dark:bg-[#151515] flex items-center justify-center z-10 shadow-[0_0_20px_rgba(210,187,255,0.4)] order-1 md:order-2">
            <span className="material-symbols-outlined text-2xl text-[var(--color-primary)]">receipt_long</span>
          </div>
          <div className="w-full md:w-5/12 md:pl-10 flex justify-center md:justify-start order-2 md:order-3">
            <div className="bg-[#151515] p-6 rounded-2xl border border-white/5 transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:bg-[#1a1a1a] hover:shadow-[0_10px_20px_rgba(0,0,0,0.5)] cursor-pointer text-left w-full max-w-[400px]">
              <h3 className="font-[var(--font-headline-md)] text-[var(--color-primary)] mb-2">{t('Step 4: VVPAT Verification')}</h3>
              <p className="font-[var(--font-body-md)] text-gray-400">
                {t('Immediate physical VVPAT generation allowing voters to verify choices before finalization.')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VoterJourney;
