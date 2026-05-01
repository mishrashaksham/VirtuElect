import React from 'react';
import useAppStore from '../../store/appStore';

const OngoingElectionView = () => {
  const { constituency } = useAppStore();

  return (
    <div className="w-full max-w-4xl mx-auto py-16 px-4 text-center">
      <div className="glass-panel p-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-saffron/10 via-transparent to-accent-green/10 pointer-events-none"></div>
        
        <div className="inline-block px-4 py-1 rounded-full bg-accent-red/20 text-accent-red font-bold text-sm mb-6 animate-pulse">
          LIVE ELECTION TODAY
        </div>
        
        <h2 className="text-5xl font-bold mb-4">Election Day in {constituency.name}</h2>
        <p className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto">
          The polls are currently open! Exercise your democratic right. 
          Experience our interactive Electronic Voting Machine (EVM) simulation to understand the voting process before you head to the booth.
        </p>

        <button 
          className="btn-primary text-xl px-8 py-4 shadow-xl shadow-primary-blue/30"
          onClick={() => alert("EVM Simulator Phase 5 to be linked here!")}
        >
          Try the EVM Simulator
        </button>
      </div>
    </div>
  );
};

export default OngoingElectionView;
