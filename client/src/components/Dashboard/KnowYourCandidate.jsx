import React, { useState, useEffect } from 'react';
import { useTranslate } from '../../context/TranslationContext';
import useAppStore from '../../store/appStore';

const MOCK_STATES = ['Delhi', 'Maharashtra', 'Karnataka'];
const MOCK_CONSTITUENCIES = {
  'Delhi': ['New Delhi', 'Chandni Chowk'],
  'Maharashtra': ['Mumbai South', 'Pune'],
  'Karnataka': ['Bangalore South', 'Mysore']
};

const MOCK_CANDIDATES = [
  { 
    id: 'c1', 
    name: 'Bansuri Swaraj', 
    party: 'Bharatiya Janata Party', 
    partyAbbr: 'BJP',
    assets_total: '₹19 Cr', 
    criminal_cases: '0 Pending', 
    attendance: 'New',
    colorTheme: 'primary',
    partySymbolEmoji: <span className="material-symbols-outlined text-orange-500 text-3xl">local_florist</span>
  },
  { 
    id: 'c2', 
    name: 'Somnath Bharti', 
    party: 'Aam Aadmi Party', 
    partyAbbr: 'AAP',
    assets_total: '₹3 Cr', 
    criminal_cases: '2 Pending', 
    attendance: '85%',
    colorTheme: 'tertiary',
    partySymbolEmoji: <span className="material-symbols-outlined text-blue-500 text-3xl">cleaning_services</span>
  },
  { 
    id: 'c3', 
    name: 'NOTA', 
    party: 'None of the Above', 
    partyAbbr: 'NOTA',
    assets_total: 'N/A', 
    criminal_cases: 'N/A', 
    attendance: 'N/A',
    colorTheme: 'secondary',
    partySymbolEmoji: <span className="material-symbols-outlined text-red-500 text-3xl">block</span>
  }
];

const KnowYourCandidate = () => {
  const { t } = useTranslate();
  const setConstituencyData = useAppStore(state => state.setConstituencyData);
  
  const [selectedState, setSelectedState] = useState('Delhi');
  const [selectedConstituency, setSelectedConstituency] = useState('New Delhi');
  const [selectedCandidateForSummary, setSelectedCandidateForSummary] = useState(null);

  // Update global store whenever selection changes so EVM receives the candidates
  useEffect(() => {
    setConstituencyData({
      constituency: { name: selectedConstituency, state: selectedState },
      scenario: 'current',
      candidates: MOCK_CANDIDATES
    });
  }, [selectedState, selectedConstituency, setConstituencyData]);

  const handleStateChange = (e) => {
    const newState = e.target.value;
    setSelectedState(newState);
    setSelectedConstituency(MOCK_CONSTITUENCIES[newState][0]);
  };

  return (
    <section className="w-full max-w-6xl mx-auto py-16 px-10 scroll-animate">
      <div className="text-center mb-12">
        <h2 className="font-[var(--font-display-xl)] text-[40px] text-gray-900 dark:text-gray-100 mb-4">
          {t('Know Your Candidate')}
        </h2>
        <p className="font-[var(--font-body-lg)] text-gray-600 dark:text-gray-400">
          {t('Explore verified candidate data and AI-summarized affidavits before casting your vote.')}
        </p>
      </div>

      {/* Dropdowns */}
      <div className="flex flex-wrap justify-center gap-6 mb-12">
        <div className="neu-raised bg-gray-200 dark:bg-[#151515] rounded-2xl px-6 py-3 flex items-center gap-4 border border-black/5 dark:border-white/5 relative w-64">
          <span className="text-gray-500 dark:text-gray-400 font-[var(--font-label-caps)] text-xs tracking-widest absolute left-6">{t('ELECTION TYPE')}</span>
          <select className="appearance-none bg-transparent outline-none w-full cursor-pointer text-gray-900 dark:text-gray-100 font-semibold pl-32 pr-6 z-10">
            <option className="text-black dark:text-white bg-white dark:bg-black">General Assembly</option>
          </select>
          <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 absolute right-4 pointer-events-none">expand_more</span>
        </div>

        <div className="neu-raised bg-gray-200 dark:bg-[#151515] rounded-2xl px-6 py-3 flex items-center gap-4 border border-black/5 dark:border-white/5 relative w-64">
          <span className="text-gray-500 dark:text-gray-400 font-[var(--font-label-caps)] text-xs tracking-widest absolute left-6">{t('STATE')}</span>
          <select 
            value={selectedState} 
            onChange={handleStateChange}
            className="appearance-none bg-transparent outline-none w-full cursor-pointer text-gray-900 dark:text-gray-100 font-semibold pl-20 pr-6 z-10"
          >
            {MOCK_STATES.map(s => <option key={s} value={s} className="text-black dark:text-white bg-white dark:bg-black">{s}</option>)}
          </select>
          <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 absolute right-4 pointer-events-none">expand_more</span>
        </div>

        <div className="neu-raised bg-gray-200 dark:bg-[#151515] rounded-2xl px-6 py-3 flex items-center gap-4 border border-black/5 dark:border-white/5 relative w-72">
          <span className="text-gray-500 dark:text-gray-400 font-[var(--font-label-caps)] text-xs tracking-widest absolute left-6">{t('CONSTITUENCY')}</span>
          <select 
            value={selectedConstituency}
            onChange={(e) => setSelectedConstituency(e.target.value)}
            className="appearance-none bg-transparent outline-none w-full cursor-pointer text-gray-900 dark:text-gray-100 font-semibold pl-36 pr-6 z-10"
          >
            {MOCK_CONSTITUENCIES[selectedState].map(c => <option key={c} value={c} className="text-black dark:text-white bg-white dark:bg-black">{c}</option>)}
          </select>
          <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 absolute right-4 pointer-events-none">expand_more</span>
        </div>
      </div>

      {/* Candidate Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {MOCK_CANDIDATES.map((candidate, index) => {
          const numberObj = {
            primary: "text-[var(--color-primary)] bg-[var(--color-primary)]",
            tertiary: "text-[var(--color-tertiary)] bg-[var(--color-tertiary)]",
            secondary: "text-[var(--color-secondary)] bg-[var(--color-secondary)]"
          };
          const textColor = `text-[var(--color-${candidate.colorTheme})]`;
          const hoverColor = `hover:text-[var(--color-${candidate.colorTheme}-fixed)]`;
          const isExpanded = selectedCandidateForSummary === candidate.id;

          return (
            <div key={candidate.id} className="glass-panel rounded-3xl p-6 flex flex-col gap-4 transition-all duration-300">
              <div className="flex items-center gap-4 border-b border-black/10 dark:border-white/10 pb-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl ${numberObj[candidate.colorTheme].split(' ')[1]}/20 ${numberObj[candidate.colorTheme].split(' ')[0]}`}>
                  0{index + 1}
                </div>
                <div>
                  <h3 className="font-[var(--font-headline-md)] text-gray-900 dark:text-gray-100 text-xl">{candidate.name}</h3>
                  <p className={`${textColor} text-sm`}>{candidate.party}</p>
                </div>
              </div>

              {isExpanded && (
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2 py-2">
                  <p className="flex justify-between">
                    <span>{t('Declared Assets:')}</span> 
                    <span className="text-gray-900 dark:text-gray-100">{candidate.assets_total}</span>
                  </p>
                  <p className="flex justify-between">
                    <span>{t('Criminal Records:')}</span> 
                    <span className={candidate.criminal_cases.includes('0') ? 'text-emerald-500' : 'text-red-500'}>
                      {candidate.criminal_cases}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span>{t('Attendance:')}</span> 
                    <span className="text-gray-900 dark:text-gray-100">{candidate.attendance}</span>
                  </p>
                </div>
              )}

              <button 
                onClick={() => setSelectedCandidateForSummary(isExpanded ? null : candidate.id)}
                className={`mt-auto w-full py-3 neu-inset bg-gray-200 dark:bg-[#151515] rounded-xl ${textColor} ${hoverColor} transition-colors flex items-center justify-center gap-2 text-sm font-semibold cursor-pointer`}
              >
                {isExpanded ? t('Hide Details') : t('View Basic Details')}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default KnowYourCandidate;
