import React from 'react';
import { useTranslate } from '../../context/TranslationContext';

const CandidateCard = ({ candidate, onShowSummary }) => {
  const { t } = useTranslate();

  const getBadgeColor = (type, value) => {
    if (type === 'criminal') {
      if (value === 0) return 'bg-accent-green/20 text-accent-green border-accent-green/30';
      if (value < 3) return 'bg-accent-saffron/20 text-accent-saffron border-accent-saffron/30';
      return 'bg-accent-red/20 text-accent-red border-accent-red/30';
    }
    return 'bg-primary-blue/20 text-primary-blue border-primary-blue/30';
  };

  return (
    <div className="glass-panel p-6 w-full transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col justify-between border-t-4" style={{ borderTopColor: candidate.partyColor || 'var(--primary-blue)' }}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-bold mb-1">{candidate.name}</h3>
          <p className="text-text-secondary font-semibold flex items-center gap-2">
            <span className="text-xl">{candidate.partySymbolEmoji}</span>
            {candidate.party} ({candidate.partyAbbr})
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-surface-color flex items-center justify-center text-2xl shadow-inner font-bold border border-glass-border">
          {candidate.serialNo}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-2">
        <div className={`px-3 py-2 rounded-lg border flex flex-col ${getBadgeColor('assets', null)}`}>
          <span className="text-xs uppercase tracking-wider opacity-80">{t('Total Assets')}</span>
          <span className="font-bold">{candidate.assets_total}</span>
        </div>
        <div className={`px-3 py-2 rounded-lg border flex flex-col ${getBadgeColor('criminal', candidate.criminal_cases)}`}>
          <span className="text-xs uppercase tracking-wider opacity-80">{t('Criminal Cases')}</span>
          <span className="font-bold">{candidate.criminal_cases}</span>
        </div>
      </div>

      <div className="mt-2 text-sm text-text-secondary">
        <p><strong className="text-text-primary">{t('Education')}:</strong> {candidate.education}</p>
      </div>

      <button 
        onClick={() => onShowSummary(candidate)}
        aria-label={`View AI affidavit summary for ${candidate.name}`}
        className="btn-primary mt-auto flex items-center justify-center gap-2"
      >
        <span>✨</span> {t('View AI Summary')}
      </button>
    </div>
  );
};

export default CandidateCard;
