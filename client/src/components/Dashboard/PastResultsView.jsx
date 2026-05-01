import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAppStore from '../../store/appStore';
import { useTranslate } from '../../context/TranslationContext';

const PastResultsView = () => {
  const { constituency } = useAppStore();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/candidates/${constituency.id}/results`);
        setResults(response.data.results || []);
      } catch (error) {
        console.error("Error fetching past results:", error);
      } finally {
        setLoading(false);
      }
    };
    if (constituency) fetchResults();
  }, [constituency]);

  if (loading) return <div className="p-8 text-center">{t('Loading past results...')}</div>;

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h2 className="text-4xl font-bold mb-2">{t('Past Results for')} {constituency.name}</h2>
      </div>
      
      <div className="space-y-6">
        {results.map((res, idx) => (
          <div key={idx} className="glass-panel p-6 border-l-8" style={{ borderLeftColor: res.partyColor || '#ccc' }}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold">{res.year} - {res.winner}</h3>
                <p className="text-xl text-text-secondary">{res.party}</p>
              </div>
              <div className="text-right">
                <p className="text-sm uppercase tracking-wide opacity-80">{t('Margin')}</p>
                <p className="font-bold text-lg">{res.margin.toLocaleString()} {t('votes')}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-glass-border grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="opacity-80">{t('Runner Up')}:</span> <span className="font-semibold">{res.runner_up} ({res.runner_up_party})</span>
              </div>
              <div className="text-right">
                <span className="opacity-80">{t('Turnout')}:</span> <span className="font-semibold">{res.turnout}</span>
              </div>
            </div>
          </div>
        ))}
        {results.length === 0 && <p className="text-center text-text-secondary">{t('No historical data available.')}</p>}
      </div>
    </div>
  );
};

export default PastResultsView;
