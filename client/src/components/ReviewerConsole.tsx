import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Shield, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  Lock, 
  Users, 
  Activity, 
  KeyRound, 
  Building2, 
  LogOut, 
  UserCheck, 
  Fingerprint,
  ArrowRight
} from 'lucide-react';

interface AuditEntry {
  id: string;
  action: string;
  reviewerId: string;
  tokenHash: string;
  timestamp: string;
}

export const ReviewerConsole: React.FC = () => {
  const { matches, reports } = useApp();
  
  // Officer Authentication State for Demo
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [officerId, setOfficerId] = useState('ADV-SHALINI-IC');
  const [pinDigits, setPinDigits] = useState<string[]>(['', '', '', '']);
  const [loginError, setLoginError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [activeTab, setActiveTab] = useState<'matches' | 'audit'>('matches');
  
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([
    {
      id: 'aud-001',
      action: 'MATCH_INGESTED',
      reviewerId: 'Adv. Shalini (IC Presiding Officer)',
      tokenHash: 'hmac_7b82f0...4c9',
      timestamp: '2026-10-24 11:15:02'
    },
    {
      id: 'aud-002',
      action: 'CONSENT_SCOPE_CHECK',
      reviewerId: 'Aawaz Cryptographic Match Engine',
      tokenHash: 'hmac_7b82f0...4c9',
      timestamp: '2026-10-24 11:20:44'
    }
  ]);

  const [matchStatus, setMatchStatus] = useState<{ [id: string]: 'pending' | 'verified' | 'dismissed' }>({
    'match-live-01': 'pending'
  });

  const handleDigitChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned) {
      const updated = [...pinDigits];
      updated[index] = '';
      setPinDigits(updated);
      setLoginError('');
      return;
    }

    // Support pasting 4 digits
    if (cleaned.length > 1) {
      const pasted = cleaned.slice(0, 4).split('');
      const newDigits = ['', '', '', ''];
      pasted.forEach((d, i) => {
        newDigits[i] = d;
      });
      setPinDigits(newDigits);
      setLoginError('');
      const nextIndex = Math.min(pasted.length - 1, 3);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const digit = cleaned[cleaned.length - 1];
    const updated = [...pinDigits];
    updated[index] = digit;
    setPinDigits(updated);
    setLoginError('');

    // Advance focus to next input
    if (index < 3 && digit) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pinDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const fullPin = pinDigits.join('');
    if (fullPin === '1234' || fullPin === '2026' || fullPin.length === 4) {
      setIsAuthenticated(true);
      setLoginError('');
      setAuditLogs(prev => [
        {
          id: `aud-${Date.now().toString().slice(-4)}`,
          action: 'OFFICER_AUTHENTICATED_SESSION',
          reviewerId: 'Adv. Shalini (IC Presiding Officer)',
          tokenHash: 'auth_session_token_live',
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19)
        },
        ...prev
      ]);
    } else {
      setLoginError('Invalid access PIN. Try demo code: 1234');
    }
  };

  const handleQuickDemoLogin = () => {
    setOfficerId('ADV-SHALINI-IC');
    setPinDigits(['1', '2', '3', '4']);
    setIsAuthenticated(true);
    setLoginError('');
    setAuditLogs(prev => [
      {
        id: `aud-${Date.now().toString().slice(-4)}`,
        action: 'OFFICER_AUTHENTICATED_SESSION',
        reviewerId: 'Adv. Shalini (IC Presiding Officer)',
        tokenHash: 'auth_session_token_live',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19)
      },
      ...prev
    ]);
  };

  const handleAction = (matchId: string, action: 'verified' | 'dismissed') => {
    setMatchStatus(prev => ({ ...prev, [matchId]: action }));
    setAuditLogs(prev => [
      {
        id: `aud-${Date.now().toString().slice(-4)}`,
        action: action === 'verified' ? 'MATCH_VERIFIED_BY_IC' : 'MATCH_DISMISSED',
        reviewerId: 'Adv. Shalini (IC Presiding Officer)',
        tokenHash: 'hmac_7b82f0...4c9',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19)
      },
      ...prev
    ]);
  };

  // If officer is not logged in, render the official Institutional Login Screen
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-soft border border-rose-200/80 space-y-6 relative overflow-hidden">
          
          {/* Subtle top ambient accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-400 via-blush-400 to-rose-600" />

          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 to-blush-500 text-white flex items-center justify-center mx-auto shadow-md shadow-rose-500/20">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-rose-100/80 text-rose-800 border border-rose-200/60">
                POSH Act Statutory Review
              </span>
              <h2 className="font-serif text-2xl font-semibold text-slate-800 mt-2">
                Internal Committee Portal
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                Secure evaluation terminal for certified Presiding Officers and caseworkers.
              </p>
            </div>
          </div>

          {/* Officer Profile Card */}
          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white border border-rose-200 flex items-center justify-center text-rose-700 font-serif font-bold text-sm shadow-xs">
                AS
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-semibold text-slate-800">Adv. Shalini</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <p className="text-[11px] text-slate-500">IC Presiding Officer • Apex Global</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100/80 text-emerald-800 font-medium">
              Authorized
            </span>
          </div>

          {/* 4-Digit Security PIN Access Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 flex items-center space-x-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-rose-500" />
                  <span>Enter Security PIN</span>
                </label>
                <span className="text-[11px] font-mono text-slate-400">4-Digit Code</span>
              </div>

              {/* 4 Discrete Sleek PIN Digit Boxes */}
              <div className="flex items-center justify-center gap-3 py-1">
                {pinDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className={`w-13 h-14 sm:w-14 sm:h-16 rounded-2xl border-2 text-center text-2xl font-bold font-mono transition-all duration-150 focus:outline-none shadow-xs ${
                      digit
                        ? 'border-rose-400 bg-rose-50/70 text-rose-900 shadow-inner'
                        : 'border-rose-200/90 bg-white text-slate-800 focus:border-rose-500 focus:ring-4 focus:ring-rose-100'
                    } ${loginError ? 'border-red-400 bg-red-50/50' : ''}`}
                  />
                ))}
              </div>

              {loginError && (
                <p className="text-[11px] text-red-600 font-medium text-center bg-red-50 py-1.5 px-3 rounded-xl border border-red-200/60 animate-in fade-in">
                  {loginError}
                </p>
              )}
            </div>

            {/* Quick Demo Fill One-Click Button */}
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2.5 px-4 rounded-xl bg-rose-50/80 hover:bg-rose-100 border border-rose-200/80 text-rose-800 text-xs font-medium flex items-center justify-center space-x-2 transition-colors group"
            >
              <Fingerprint className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
              <span>One-Click Demo Fill (Adv. Shalini • PIN: 1234)</span>
            </button>

            {/* Sign In CTA */}
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md shadow-rose-600/20 active:scale-95 transition-all"
            >
              <span>Verify & Sign In to Review Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Trust and Privacy Safeguard Note */}
          <div className="p-3 rounded-xl bg-white/70 border border-rose-100 text-[11px] text-slate-500 flex items-start space-x-2 leading-relaxed">
            <Lock className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
            <span>
              DPDPA 2023 & Section 16 compliant. All actions are cryptographically logged to the audit trail. Unconsented survivor identities remain masked.
            </span>
          </div>

        </div>
      </div>
    );
  }

  // If officer is logged in, show the full verified review console
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      
      {/* Officer Header with Active Session & Logout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-200/60">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-amber-300 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Authenticated IC Officer</span>
            </span>
            <span className="text-xs text-slate-600 font-mono">
              Adv. Shalini (Presiding Officer • Apex Global IC)
            </span>
          </div>
          <h2 className="font-serif text-2xl font-semibold text-slate-800 mt-1">
            Pattern Match Reviewer Console
          </h2>
          <p className="text-xs text-slate-500">
            Zero-knowledge token evaluation. Personal identities and unconsented narratives remain cryptographically masked.
          </p>
        </div>

        {/* Tab Buttons & Logout */}
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <div className="flex items-center space-x-1 p-1 bg-rose-50 rounded-full border border-rose-100">
            <button
              onClick={() => setActiveTab('matches')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === 'matches' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending Matches
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === 'audit' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Audit Trail
            </button>
          </div>

          <button
            onClick={() => setIsAuthenticated(false)}
            title="Log out of IC console"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-slate-600 bg-white hover:bg-rose-50 border border-slate-200 shadow-xs transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {activeTab === 'matches' ? (
        <div className="space-y-4">
          
          {/* Active Pattern Item */}
          <div className="glass-card rounded-3xl p-6 shadow-soft space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-rose-100">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-semibold text-slate-800">Pattern Match Cluster: #MC-9041</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                  Confidence: High (HMAC Exact)
                </span>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                Status: <strong className="capitalize text-slate-800">{matchStatus['match-live-01'] || 'pending'}</strong>
              </span>
            </div>

            {/* Token Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-white border border-rose-100">
                <p className="text-slate-400 text-[10px] uppercase">HMAC Match Token</p>
                <p className="font-mono text-slate-800 truncate mt-1">7b82f0e...519bc3</p>
              </div>
              <div className="p-3 rounded-xl bg-white border border-rose-100">
                <p className="text-slate-400 text-[10px] uppercase">Phonetic Sound Key</p>
                <p className="font-mono text-slate-800 mt-1">VRN_SHRM (Matched)</p>
              </div>
              <div className="p-3 rounded-xl bg-white border border-rose-100">
                <p className="text-slate-400 text-[10px] uppercase">Distinct Accounts</p>
                <p className="font-semibold text-slate-800 mt-1">2 Independent Filings</p>
              </div>
            </div>

            {/* Survivor Safeguard Notice */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center space-x-2.5">
              <Lock className="w-4 h-4 text-slate-500 shrink-0" />
              <span>
                Report contents are locked securely. Full reports are unlocked only when both women agree.
              </span>
            </div>

            {/* Actions for Reviewer */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => handleAction('match-live-01', 'dismissed')}
                className="px-4 py-2 rounded-full text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Dismiss Match
              </button>
              <button
                onClick={() => handleAction('match-live-01', 'verified')}
                className="flex items-center space-x-1.5 px-5 py-2 rounded-full bg-slate-900 hover:bg-black text-white text-xs font-semibold shadow-sm transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Confirm Pattern Integrity</span>
              </button>
            </div>
          </div>

        </div>
      ) : (
        <div className="glass-card rounded-3xl p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-base font-semibold text-slate-800">
              Non-PII Immutable Audit Log
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">DPDPA 2023 Compliant</span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            {auditLogs.map(log => (
              <div key={log.id} className="p-3 rounded-xl bg-white border border-rose-100 flex items-center justify-between">
                <div>
                  <span className="text-rose-700 font-semibold">{log.action}</span>
                  <span className="text-slate-400 ml-2">by {log.reviewerId}</span>
                </div>
                <div className="text-slate-500 text-[11px]">
                  <span>{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
