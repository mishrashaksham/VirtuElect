import React from 'react';
import useAppStore from '../../store/appStore';
import CurrentCandidatesView from './CurrentCandidatesView';
import PastResultsView from './PastResultsView';
import OngoingElectionView from './OngoingElectionView';
const DashboardRouter = () => {
  const { scenario, constituency } = useAppStore();

  if (scenario === 'loading') {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin text-6xl">⏳</div>
      </div>
    );
  }

  if (!constituency) {
    return null; // Don't render dashboard if no constituency is set
  }

  return (
    <div className="w-full relative z-10 pt-24 pb-20 px-4">
      <CurrentCandidatesView />
    </div>
  );
};

export default DashboardRouter;
