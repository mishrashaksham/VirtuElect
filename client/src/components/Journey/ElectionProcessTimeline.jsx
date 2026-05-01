import React from 'react';
import { useTranslate } from '../../context/TranslationContext';

const ElectionProcessTimeline = () => {
  const { t } = useTranslate();

  const steps = [
    { title: "Step 1: KYC & Registration", time: "3 Weeks Before", icon: "app_registration" },
    { title: "Step 2: Campaigning", time: "1 Week Before", icon: "campaign" },
    { title: "Step 3: Polling Day", time: "Voting", icon: "how_to_vote" },
    { title: "Step 4: Result Declaration", time: "Post-Election", icon: "emoji_events" }
  ];

  return (
    <section className="w-full max-w-6xl mx-auto py-12 px-6 scroll-animate">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="w-full md:w-1/4 bg-gray-50 dark:bg-[#151515] p-6 rounded-2xl border border-gray-200 dark:border-white/5 transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:bg-white dark:hover:bg-[#1a1a1a] shadow-sm hover:shadow-[0_10px_20px_rgba(124,58,237,0.2)] dark:hover:shadow-[0_10px_20px_rgba(124,58,237,0.4)] flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full neu-raised bg-gray-200 dark:bg-[#151515] flex items-center justify-center z-10 shadow-[0_0_20px_rgba(124,58,237,0.3)] mb-4">
                <span className="material-symbols-outlined text-2xl text-[var(--color-primary)]">
                  {step.icon}
                </span>
              </div>
              <h3 className="font-[var(--font-headline-md)] text-gray-900 dark:text-[var(--color-primary)] mb-2 text-lg">
                {t(step.title)}
              </h3>
              <p className="font-[var(--font-body-md)] text-gray-600 dark:text-gray-400 text-sm">
                {t(step.time)}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className="flex items-center justify-center text-gray-400 dark:text-[var(--color-primary)] py-2 md:py-0 opacity-50">
                <span className="material-symbols-outlined text-3xl rotate-90 md:rotate-0">
                  arrow_forward
                </span>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default ElectionProcessTimeline;
