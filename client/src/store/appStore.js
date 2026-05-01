import { create } from 'zustand';

const useAppStore = create((set) => ({
  // Global App State
  darkMode: false,
  language: 'en',
  currentView: 'home', // home | select | dashboard
  
  // Gyani State
  gyaniVisible: true,
  gyaniState: 'greeting', // greeting | location_ask | location_processing | location_success | error
  
  // Election Data State
  constituency: null, // { id, name, state, type, electionDate, scenario }
  candidates: [],
  scenario: 'loading',
  
  // EVM State
  evm: { locked: false, voted: null },

  // Actions
  toggleDarkMode: () => set((state) => {
    const newMode = !state.darkMode;
    document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light');
    return { darkMode: newMode };
  }),
  setLanguage: (lang) => set({ language: lang }),
  setCurrentView: (view) => set({ currentView: view }),
  
  setGyaniVisible: (visible) => set({ gyaniVisible: visible }),
  setGyaniState: (state) => set({ gyaniState: state }),
  
  setConstituencyData: (data) => set({
    constituency: data.constituency,
    scenario: data.scenario,
    candidates: data.candidates || []
  }),
  
  setEVM: (evmState) => set({ evm: evmState }),
  resetEVM: () => set({ evm: { locked: false, voted: null } })
}));

export default useAppStore;
