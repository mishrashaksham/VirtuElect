import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAppStore from '../../store/appStore';

const ManualSelectionView = () => {
  const [states, setStates] = useState([]);
  const [constituencies, setConstituencies] = useState({});
  const [selectedState, setSelectedState] = useState('');
  const [selectedConstituency, setSelectedConstituency] = useState('');
  const { setConstituencyData, setCurrentView } = useAppStore();

  useEffect(() => {
    // Fetch all available constituencies
    const fetchConstituencies = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/geo/constituencies');
        if (res.data.success) {
          const data = res.data.constituencies;
          // Group by state
          const grouped = {};
          data.forEach(c => {
            if (!grouped[c.state]) grouped[c.state] = [];
            grouped[c.state].push(c);
          });
          setStates(Object.keys(grouped).sort());
          setConstituencies(grouped);
        }
      } catch (err) {
        console.error("Failed to load constituencies", err);
      }
    };
    fetchConstituencies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedConstituency) return;
    
    try {
      const res = await axios.get(`http://localhost:3001/api/candidates/${selectedConstituency}`);
      if (res.data.success) {
        setConstituencyData({
          constituency: res.data.constituency,
          scenario: res.data.scenario,
          candidates: res.data.candidates
        });
        setCurrentView('dashboard');
      }
    } catch (err) {
      console.error("Failed to fetch candidate data", err);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-16 px-4 relative">
      <button 
        onClick={() => setCurrentView('home')}
        className="absolute top-4 left-4 text-[var(--primary-blue)] hover:text-[var(--primary-blue-hover)] font-semibold flex items-center gap-2 transition-colors interactive"
      >
        <span>&larr;</span> Back to Home
      </button>

      <div className="glass-panel p-8 mt-6">
        <h2 className="text-3xl font-bold mb-6 text-center">Find Your Constituency</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-[var(--text-secondary)]">Election Type</label>
            <select className="bg-[var(--bg-color)] border border-[var(--glass-border)] rounded-lg p-3 outline-none" disabled>
              <option>Lok Sabha (General Election)</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-[var(--text-secondary)]">State / Union Territory</label>
            <select 
              value={selectedState} 
              onChange={(e) => { setSelectedState(e.target.value); setSelectedConstituency(''); }}
              className="bg-[var(--bg-color)] border border-[var(--glass-border)] rounded-lg p-3 outline-none focus:border-[var(--primary-blue)]"
              required
            >
              <option value="">-- Select State --</option>
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-[var(--text-secondary)]">Constituency Area</label>
            <select 
              value={selectedConstituency} 
              onChange={(e) => setSelectedConstituency(e.target.value)}
              className="bg-[var(--bg-color)] border border-[var(--glass-border)] rounded-lg p-3 outline-none focus:border-[var(--primary-blue)]"
              disabled={!selectedState}
              required
            >
              <option value="">-- Select Constituency --</option>
              {selectedState && constituencies[selectedState]?.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <button 
            type="submit" 
            className="btn-primary mt-4 py-3 text-lg font-bold"
            disabled={!selectedConstituency}
          >
            View Candidates
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManualSelectionView;
