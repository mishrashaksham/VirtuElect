import React, { useRef, useState, useEffect } from 'react';
import useAppStore from '../../store/appStore';
import { useTranslate } from '../../context/TranslationContext';
import gsap from 'gsap';

const EVMSimulator = () => {
  const { candidates, evm, setEVM, resetEVM } = useAppStore();
  const { t } = useTranslate();
  
  const [vvpatCandidate, setVvpatCandidate] = useState(null);
  const [vvpatVisible, setVvpatVisible] = useState(false);
  const slipRef = useRef(null);
  const dropTimerRef = useRef(null);

  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = 1500;
      
      gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 2);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 2);
    } catch (e) {
      console.log('Audio context not supported');
    }
  };

  useEffect(() => {
    if (vvpatVisible && slipRef.current) {
      gsap.fromTo(slipRef.current, 
        { y: -150, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, ease: 'power2.out' }
      );

      dropTimerRef.current = setTimeout(() => {
        if (slipRef.current) {
          gsap.to(slipRef.current, {
            y: 150,
            opacity: 0,
            duration: 0.5,
            ease: 'power2.in',
            onComplete: () => {
              setVvpatVisible(false);
              setVvpatCandidate(null);
            }
          });
        }
      }, 7000);
    }
    return () => {
      if (dropTimerRef.current) clearTimeout(dropTimerRef.current);
    };
  }, [vvpatVisible]);

  const handleVote = (candidate) => {
    if (evm.locked) return;
    setEVM({ locked: true, voted: candidate.id });
    playBeep();
    setVvpatCandidate(candidate);
    setVvpatVisible(true);
  };

  const handleReset = () => {
    if (dropTimerRef.current) clearTimeout(dropTimerRef.current);
    setVvpatVisible(false);
    setVvpatCandidate(null);
    resetEVM();
  };

  if (!candidates || candidates.length === 0) return null;

  return (
    <section className="w-full max-w-5xl mx-auto py-16 px-10 scroll-animate">
      <div className="text-center mb-12">
        <h2 className="font-[var(--font-display-xl)] text-[40px] text-gray-900 dark:text-gray-100 mb-2">{t('EVM Simulator')}</h2>
        <p className="font-[var(--font-body-lg)] text-gray-600 dark:text-gray-400">{t('Interact with the simulated hardware units below.')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Control Unit */}
        <div className="lg:col-span-4 bg-gray-200 dark:bg-[#151515] rounded-3xl p-6 neu-raised flex flex-col border border-black/5 dark:border-white/5 transition-colors duration-300">
          <div className="flex items-center justify-between mb-6">
            <span className="font-[var(--font-label-caps)] text-[12px] text-gray-500 dark:text-gray-400 tracking-widest uppercase">{t('Control Unit')}</span>
            <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"></div>
          </div>
          
          <div className="lcd-screen rounded-xl p-6 text-center mb-8 h-24 flex items-center justify-center">
            <span className="text-2xl font-bold tracking-widest uppercase">{t('SYSTEM READY')}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-auto">
            <button className="neu-raised bg-gray-200 dark:bg-[#151515] text-gray-900 dark:text-gray-100 py-4 rounded-2xl font-[var(--font-label-caps)] text-[12px] uppercase hover:bg-gray-300 dark:hover:bg-[#1a1a1a] transition-colors active:neu-inset active:shadow-none flex flex-col items-center justify-center gap-2 border border-black/5 dark:border-white/5 pointer-events-none opacity-50">
              <span className="material-symbols-outlined text-[var(--color-tertiary)]" style={{ fontVariationSettings: "'FILL' 1" }}>how_to_vote</span>
              {t('Issue Ballot')}
            </button>
            <button className="neu-raised bg-gray-200 dark:bg-[#151515] text-gray-900 dark:text-gray-100 py-4 rounded-2xl font-[var(--font-label-caps)] text-[12px] uppercase hover:bg-gray-300 dark:hover:bg-[#1a1a1a] transition-colors active:neu-inset active:shadow-none flex flex-col items-center justify-center gap-2 border border-black/5 dark:border-white/5 pointer-events-none opacity-50">
              <span className="material-symbols-outlined text-[var(--color-tertiary)]" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
              {t('Close Poll')}
            </button>
          </div>
          
          <div className="mt-4">
            <button 
              onClick={handleReset}
              className="w-full neu-raised bg-gray-200 dark:bg-[#151515] text-gray-900 dark:text-gray-100 py-4 rounded-2xl font-[var(--font-label-caps)] text-[12px] uppercase tracking-widest hover:bg-gray-300 dark:hover:bg-[#1a1a1a] transition-colors active:neu-inset active:shadow-none flex items-center justify-center gap-2 text-red-500 dark:text-[var(--color-error)] border border-black/5 dark:border-white/5 cursor-pointer"
            >
              <span className="material-symbols-outlined">power_settings_new</span>
              {t('Total Reset')}
            </button>
          </div>
        </div>

        {/* Ballot Unit */}
        <div className="lg:col-span-8 bg-gray-200 dark:bg-[#151515] rounded-3xl p-8 neu-raised border border-black/5 dark:border-white/5 flex flex-col transition-colors duration-300">
          <div className="flex items-center justify-between mb-8 border-b border-black/10 dark:border-white/10 pb-4">
            <span className="font-[var(--font-label-caps)] text-[12px] uppercase text-gray-500 dark:text-gray-400 tracking-widest">{t('Ballot Unit Interface')}</span>
            <span className="text-xs font-bold text-gray-400 dark:text-[var(--color-outline)]">ID: BU-7892-A</span>
          </div>
          
          <div className="flex-1 flex flex-col gap-4">
            {candidates.map((candidate, index) => (
              <div key={candidate.id} className="bg-white text-black rounded-2xl p-4 flex items-center justify-between border border-gray-200 shadow-sm">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-full border border-gray-300 bg-gray-50 flex items-center justify-center font-bold text-gray-700">
                    0{index + 1}
                  </div>
                  <div>
                    <h3 className="font-[var(--font-headline-md)] text-[20px] text-black">{candidate.name}</h3>
                    <p className="font-[var(--font-body-md)] text-[14px] text-gray-700">{candidate.party}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-4xl flex items-center justify-center w-10">
                    {candidate.partySymbolEmoji}
                  </div>
                  <button 
                    onClick={() => handleVote(candidate)}
                    disabled={evm.locked}
                    className={`w-24 h-12 rounded-full transition-all ${
                      evm.locked 
                        ? 'bg-blue-800 opacity-50 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.6)] hover:-translate-y-1 cursor-pointer'
                    }`}
                  >
                  </button>
                </div>
              </div>
            ))}
            
          </div>
        </div>
      </div>

      {/* VVPAT Unit */}
      <div className="w-full bg-gray-200 dark:bg-[#151515] rounded-[2.5rem] p-8 min-h-[380px] neu-raised border border-black/5 dark:border-white/5 mt-12 flex items-center gap-8 scroll-animate transition-colors duration-300">
        <div className="w-1/3 flex flex-col items-center justify-center text-center pr-8 border-r border-black/10 dark:border-white/10">
          <span className="material-symbols-outlined text-5xl text-[var(--color-primary)] mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>receipt_long</span>
          <h3 className="font-[var(--font-headline-md)] text-[24px] text-gray-900 dark:text-gray-100 mb-1">{t('VVPAT System')}</h3>
          <p className="font-[var(--font-body-md)] text-[14px] text-gray-600 dark:text-gray-400">{t('Voter Verifiable Paper Audit Trail Monitor')}</p>
        </div>
        
        <div className="w-2/3 flex justify-center">
          <div className="w-72 h-64 bg-gray-100 dark:bg-[#111111] border-4 border-gray-300 dark:border-[var(--color-outline)] rounded-lg shadow-inner overflow-hidden relative flex flex-col items-center pt-4 transition-colors duration-300">
            {/* Simulated Paper */}
            <div 
              ref={slipRef}
              style={{ opacity: vvpatVisible ? 1 : 0, visibility: vvpatVisible ? 'visible' : 'hidden' }}
              className="w-56 bg-white dark:bg-[#1c1c1c] shadow-md border border-gray-200 dark:border-[var(--color-outline-variant)] rounded-sm p-4 text-center transform translate-y-2 font-mono text-xl text-gray-900 dark:text-gray-100 transition-colors duration-300"
            >
              <div className="border-b border-dashed border-gray-300 dark:border-[var(--color-outline-variant)] pb-2 mb-2">
                <p className="text-lg">ELECTION 2024</p>
                <p className="text-lg">DISTRICT 12</p>
              </div>
              <p className="font-bold my-4 flex justify-center text-5xl">
                {vvpatCandidate?.partySymbolEmoji}
              </p>
              <p className="mb-4 font-bold">{vvpatCandidate?.name}</p>
              <div className="border-t border-dashed border-gray-300 dark:border-[var(--color-outline-variant)] pt-2">
                <p className="text-sm text-gray-500 dark:text-[var(--color-outline)]">SN: 8829-AB-11</p>
              </div>
            </div>
            
            {/* Glass cover reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/5 to-transparent dark:from-white/5 dark:to-white/10 pointer-events-none"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EVMSimulator;
