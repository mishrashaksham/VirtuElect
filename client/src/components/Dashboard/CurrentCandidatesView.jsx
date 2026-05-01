import React, { useState } from 'react';
import useAppStore from '../../store/appStore';
import CandidateCard from './CandidateCard';
import AffidavitSummarizer from '../AffidavitAI/AffidavitSummarizer';
import { useTranslate } from '../../context/TranslationContext';

const CurrentCandidatesView = () => {
  const { constituency, candidates } = useAppStore();
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const { t } = useTranslate();

  if (!constituency || candidates.length === 0) {
    return <div className="p-8 text-center text-text-secondary">{t('No candidates found.')}</div>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 relative">
      <div className="mb-8 text-center">
        <h2 className="text-4xl font-bold mb-2">{t('Candidates for')} {constituency.name}</h2>
        <p className="text-xl text-text-secondary">{t('Lok Sabha Election')} {new Date(constituency.electionDate).getFullYear()}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidates.map(candidate => (
          <CandidateCard 
            key={candidate.id} 
            candidate={candidate} 
            onShowSummary={setSelectedCandidate}
          />
        ))}
      </div>

      {selectedCandidate && (
        <AffidavitSummarizer 
          candidate={selectedCandidate} 
          onClose={() => setSelectedCandidate(null)} 
        />
      )}
    </div>
  );
};

export default CurrentCandidatesView;
