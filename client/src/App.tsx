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
import { Shield, Scale, Lock, ShieldCheck } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { view, setView } = useApp();

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pb-16">
        {view === 'dashboard' && <Dashboard />}
        {view === 'report_builder' && <ReportBuilder />}
        {view === 'matches' && <MatchesHub />}
        {view === 'rights' && <RightsExplainer />}
        {view === 'reviewer' && <ReviewerConsole />}
      </main>

      <footer className="bg-gradient-to-r from-stone-950 via-rose-950 to-stone-900 border-t border-white/5 text-stone-400">

        {/* Main footer body */}
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 gap-8">

          {/* Brand column */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <AawazLogo size="sm" withEcho={false} />
              <span className="font-serif font-semibold text-white text-base">Aawaz</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              A privacy-first platform for workplace harassment reporting. Your report stays on your device until you choose to share it.
            </p>
            <p className="text-[11px] text-stone-500 italic">
              You speak when you are ready.
            </p>
          </div>

          {/* Legal / trust column */}
          <div className="space-y-3">
            <p className="text-[10px] uppercase font-bold tracking-widest text-rose-400">Trust and Privacy</p>
            <div className="space-y-2.5">
              <div className="flex items-start space-x-2 text-xs text-stone-400">
                <Lock className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                <span>Zero-knowledge vault architecture. Reports never leave your device unencrypted.</span>
              </div>
              <div className="flex items-start space-x-2 text-xs text-stone-400">
                <Scale className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                <span>Compliant with POSH Act 2013 and DPDPA 2023.</span>
              </div>
              <div className="flex items-start space-x-2 text-xs text-stone-400">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                <span>Section 16 identity protection enforced throughout.</span>
              </div>
              <div className="flex items-start space-x-2 text-xs text-stone-400">
                <Shield className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                <span>No accounts, no emails, no tracking. Vault ID only.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 px-6 py-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-stone-600">
            <span>Aawaz — Private Pattern Matching for Workplace Safety</span>
            <div className="flex items-center space-x-4">
              <span>POSH Act 2013</span>
              <span className="text-stone-700">·</span>
              <span>DPDPA 2023</span>
              <span className="text-stone-700">·</span>
              <span>Section 65B, IT Act</span>
            </div>
          </div>
        </div>

      </footer>

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
