import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { ReportBuilder } from './components/ReportBuilder';
import { MatchesHub } from './components/MatchesHub';
import { RightsExplainer } from './components/RightsExplainer';
import { ReviewerConsole } from './components/ReviewerConsole';
import { DisguiseOverlay } from './components/DisguiseOverlay';
import { AawazLogo } from './components/AawazLogo';
import { Shield, HeartHandshake, Lock } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { view, setView } = useApp();

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navigation header with safety controls */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        {view === 'dashboard' && <Dashboard />}
        {view === 'report_builder' && <ReportBuilder />}
        {view === 'matches' && <MatchesHub />}
        {view === 'rights' && <RightsExplainer />}
        {view === 'reviewer' && <ReviewerConsole />}
      </main>

      {/* Gentle, Grounded Footer */}
      <footer className="border-t border-rose-100/80 bg-white/60 backdrop-blur-sm py-8 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <AawazLogo size="sm" withEcho={false} />
            <span className="font-serif font-semibold text-slate-800">Aawaz</span>
            <span>— You speak when you are ready.</span>
          </div>

          <div className="flex items-center space-x-6 text-[11px]">
            <button onClick={() => setView('rights')} className="hover:text-rose-700 transition-colors">
              POSH Act 2013 Guide
            </button>
            <button onClick={() => setView('reviewer')} className="hover:text-rose-700 transition-colors">
              IC Reviewer Portal
            </button>
            <span className="text-slate-400">Zero-Knowledge Private Vault Architecture</span>
          </div>
        </div>
      </footer>

      {/* Overlays */}
      <DisguiseOverlay />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
