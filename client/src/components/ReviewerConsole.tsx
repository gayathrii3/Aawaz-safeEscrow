import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield,
  CheckCircle2,
  Lock,
  KeyRound,
  LogOut,
  Fingerprint,
  ArrowRight,
  FileDown,
  Clock,
  Users,
  ShieldOff,
  Film,
  Music,
  Image,
  Paperclip,
} from 'lucide-react';
import { generateComplaintPdf } from '../utils/pdfGenerator';
import { MatchRecord } from '../types';

interface AuditEntry {
  id: string;
  action: string;
  reviewerId: string;
  timestamp: string;
}

// Derive the step unlock state from a match record
function getMatchPhase(m: MatchRecord): 'locked' | 'step2_pending' | 'step3_pending' | 'unlocked' {
  const step3Both = m.myConsent === 'full' && m.peerConsent === 'full';
  const step2Both = (m.myConsent === 'timeline' || m.myConsent === 'full') &&
                    (m.peerConsent === 'timeline' || m.peerConsent === 'full');
  if (step3Both) return 'unlocked';
  if (step2Both) return 'step3_pending';
  if (m.myConsent !== 'none' || m.peerConsent !== 'none') return 'step2_pending';
  return 'locked';
}

const PHASE_LABEL: Record<string, { label: string; color: string }> = {
  locked:        { label: 'Awaiting Consent',     color: 'bg-slate-100 text-slate-600' },
  step2_pending: { label: 'Timeline Shared',       color: 'bg-amber-100 text-amber-800' },
  step3_pending: { label: 'Full Report Pending',   color: 'bg-blue-100 text-blue-800' },
  unlocked:      { label: 'Ready for Review',      color: 'bg-emerald-100 text-emerald-800' },
};

export const ReviewerConsole: React.FC = () => {
  const { matches, reports, currentUser, directComplaints, updateDirectComplaintStatus } = useApp();

  // Officer Authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinDigits, setPinDigits] = useState<string[]>(['', '', '', '']);
  const [loginError, setLoginError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [activeTab, setActiveTab] = useState<'matches' | 'direct' | 'audit'>('matches');
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  const [matchStatus, setMatchStatus] = useState<{ [id: string]: 'pending' | 'verified' | 'dismissed' }>({});

  // ── PIN handlers ──────────────────────────────────────────────────────
  const handleDigitChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned) {
      const updated = [...pinDigits];
      updated[index] = '';
      setPinDigits(updated);
      setLoginError('');
      return;
    }
    if (cleaned.length > 1) {
      const pasted = cleaned.slice(0, 4).split('');
      const newDigits = ['', '', '', ''];
      pasted.forEach((d, i) => { newDigits[i] = d; });
      setPinDigits(newDigits);
      setLoginError('');
      inputRefs.current[Math.min(pasted.length - 1, 3)]?.focus();
      return;
    }
    const digit = cleaned[cleaned.length - 1];
    const updated = [...pinDigits];
    updated[index] = digit;
    setPinDigits(updated);
    setLoginError('');
    if (index < 3 && digit) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pinDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const logAction = (action: string) => {
    setAuditLogs(prev => [
      {
        id: `aud-${Date.now()}`,
        action,
        reviewerId: 'IC Presiding Officer',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      },
      ...prev,
    ]);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const fullPin = pinDigits.join('');
    if (fullPin.length === 4) {
      setIsAuthenticated(true);
      setLoginError('');
      logAction('OFFICER_SESSION_STARTED');
    } else {
      setLoginError('Enter all 4 digits to continue.');
    }
  };

  const handleQuickLogin = () => {
    setPinDigits(['1', '2', '3', '4']);
    setIsAuthenticated(true);
    logAction('OFFICER_SESSION_STARTED');
  };

  const handleAction = (matchId: string, action: 'verified' | 'dismissed') => {
    setMatchStatus(prev => ({ ...prev, [matchId]: action }));
    logAction(action === 'verified' ? `MATCH_${matchId.slice(-6).toUpperCase()}_VERIFIED` : `MATCH_${matchId.slice(-6).toUpperCase()}_DISMISSED`);
  };

  const handleDownloadPdf = (match: MatchRecord) => {
    const report = reports.find(r => r.id === match.reportId);
    if (!report) return;
    logAction(`PDF_DOWNLOADED_MATCH_${match.id.slice(-6).toUpperCase()}`);
    generateComplaintPdf(
      report,
      2,
      currentUser.pseudonym,
      match.timelineSharedWithMe,
      match.peerUserPseudonym || 'Complainant 2'
    );
  };

  // ── Login screen ──────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-soft border border-rose-200/80 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-400 via-blush-400 to-rose-600" />

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
                Secure terminal for certified Presiding Officers. Reports appear here only after both parties have given full consent.
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 flex items-center space-x-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-rose-500" />
                  <span>Enter Security PIN</span>
                </label>
                <span className="text-[11px] font-mono text-slate-400">4-Digit Code</span>
              </div>

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
                <p className="text-[11px] text-red-600 font-medium text-center bg-red-50 py-1.5 px-3 rounded-xl border border-red-200/60">
                  {loginError}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleQuickLogin}
              className="w-full py-2.5 px-4 rounded-xl bg-rose-50/80 hover:bg-rose-100 border border-rose-200/80 text-rose-800 text-xs font-medium flex items-center justify-center space-x-2 transition-colors group"
            >
              <Fingerprint className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
              <span>One-Click Demo Login</span>
            </button>

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md shadow-rose-600/20 active:scale-95 transition-all"
            >
              <span>Verify and Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="p-3 rounded-xl bg-white/70 border border-rose-100 text-[11px] text-slate-500 flex items-start space-x-2 leading-relaxed">
            <Lock className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
            <span>
              DPDPA 2023 and Section 16 compliant. All actions are logged. Survivor identities remain masked unless both parties consent.
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ── Authenticated console ─────────────────────────────────────────────
  // Separate matches by phase
  const readyMatches   = matches.filter(m => getMatchPhase(m) === 'unlocked');
  const pendingMatches = matches.filter(m => getMatchPhase(m) !== 'unlocked');

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-200/60">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-amber-300 flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              <span>Authenticated IC Officer</span>
            </span>
          </div>
          <h2 className="font-serif text-2xl font-semibold text-slate-800 mt-1">
            Pattern Match Reviewer Console
          </h2>
          <p className="text-xs text-slate-500">
            Reports appear here only after both parties give full consent. Identities remain masked under Sec. 16, POSH Act.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <div className="flex items-center space-x-1 p-1 bg-rose-50 rounded-full border border-rose-100">
            <button
              onClick={() => setActiveTab('matches')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === 'matches' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Matches
              {readyMatches.length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white">
                  {readyMatches.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('direct')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === 'direct' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Direct Complaints
              {directComplaints.filter(d => d.status === 'pending').length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white">
                  {directComplaints.filter(d => d.status === 'pending').length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === 'audit' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Audit Log
            </button>
          </div>

          <button
            onClick={() => setIsAuthenticated(false)}
            title="Log out"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-slate-600 bg-white hover:bg-rose-50 border border-slate-200 shadow-xs transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* ── MATCHES TAB ─────────────────────────────────────────────────── */}
      {activeTab === 'matches' && (
        <div className="space-y-5">

          {/* No matches at all */}
          {matches.length === 0 && (
            <div className="glass-card rounded-3xl p-10 shadow-soft text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto">
                <Users className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-700">No pattern matches yet</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Matches appear here when two users independently report the same person. No cases have been filed yet.
              </p>
            </div>
          )}

          {/* Ready for review — both fully consented */}
          {readyMatches.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-emerald-700 uppercase tracking-wider flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Ready for Review — Full Consent Received</span>
              </h3>

              {readyMatches.map(match => {
                const report = reports.find(r => r.id === match.reportId);
                const status = matchStatus[match.id] || 'pending';
                const clusterId = `MC-${match.id.slice(-4).toUpperCase()}`;

                return (
                  <div key={match.id} className="glass-card rounded-3xl p-6 shadow-soft space-y-4 border border-emerald-200/60">
                    {/* Match header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-rose-100">
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                        <span className="text-xs font-semibold text-slate-800">
                          Pattern Cluster: #{clusterId}
                        </span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {match.confidence === 'high' ? 'High Confidence' : 'Possible Match'}
                        </span>
                      </div>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        status === 'verified'  ? 'bg-emerald-100 text-emerald-800' :
                        status === 'dismissed' ? 'bg-slate-100 text-slate-600' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {status}
                      </span>
                    </div>

                    {/* Metadata grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-white border border-rose-100">
                        <p className="text-slate-400 text-[10px] uppercase mb-1">Respondent</p>
                        <p className="font-semibold text-slate-800 truncate">
                          {report?.accusedName || '—'}
                        </p>
                        <p className="text-slate-500 text-[11px]">
                          {report?.accusedOrg} · {report?.accusedRole}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-rose-100">
                        <p className="text-slate-400 text-[10px] uppercase mb-1">Complainants</p>
                        <p className="text-slate-800 text-[11px]">1. {currentUser.pseudonym}</p>
                        <p className="text-slate-800 text-[11px]">2. {match.peerUserPseudonym || 'Peer Complainant'}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-rose-100">
                        <p className="text-slate-400 text-[10px] uppercase mb-1">Incidents on record</p>
                        <p className="font-semibold text-slate-800">
                          {(report?.structuredEvents?.length || 0) + (match.timelineSharedWithMe?.length || 0)} total
                        </p>
                        <p className="text-slate-500 text-[11px]">from 2 independent filings</p>
                      </div>
                    </div>

                    {/* Consent confirmation banner */}
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>
                        Both parties have given full consent. Evidence PDF is unlocked and ready for IC review.
                      </span>
                    </div>

                    {/* Media attachments — images preview, audio/video playable */}
                    {(() => {
                      const items = report?.evidenceItems || [];
                      const images = items.filter(i => i.fileType === 'image' && i.dataUrl);
                      const audios = items.filter(i => i.fileType === 'audio' && i.dataUrl);
                      const videos = items.filter(i => i.fileType === 'video' && i.dataUrl);
                      const others = items.filter(i => i.fileType === 'other' || !i.dataUrl);
                      if (items.length === 0) return null;
                      return (
                        <div className="space-y-3">
                          <p className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider flex items-center space-x-1.5">
                            <Paperclip className="w-3 h-3" />
                            <span>Attached Evidence ({items.length} file{items.length > 1 ? 's' : ''})</span>
                          </p>

                          {/* Images */}
                          {images.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-[10px] text-slate-400 flex items-center space-x-1"><Image className="w-3 h-3" /><span>Screenshots / Images</span></p>
                              <div className="flex flex-wrap gap-3">
                                {images.map(img => (
                                  <div key={img.id} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
                                    <img
                                      src={img.dataUrl}
                                      alt={img.fileName}
                                      className="max-h-40 max-w-[200px] object-contain"
                                    />
                                    <p className="text-[10px] text-slate-500 px-2 py-1 truncate max-w-[200px]">{img.fileName}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Audio */}
                          {audios.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-[10px] text-slate-400 flex items-center space-x-1"><Music className="w-3 h-3" /><span>Audio Recordings</span></p>
                              {audios.map(a => (
                                <div key={a.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                                  <p className="text-xs font-medium text-slate-700">{a.fileName}</p>
                                  <audio controls src={a.dataUrl} className="w-full h-8" />
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Video */}
                          {videos.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-[10px] text-slate-400 flex items-center space-x-1"><Film className="w-3 h-3" /><span>Video Recordings</span></p>
                              {videos.map(v => (
                                <div key={v.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                                  <p className="text-xs font-medium text-slate-700">{v.fileName}</p>
                                  <video controls src={v.dataUrl} className="w-full max-h-48 rounded-lg bg-black" />
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Other files */}
                          {others.length > 0 && (
                            <div className="space-y-1">
                              {others.map(f => (
                                <div key={f.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                                  <span className="text-slate-700 font-medium">{f.fileName}</span>
                                  <span className="text-slate-400 text-[10px]">{(f.fileSize / 1024).toFixed(1)} KB</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <button
                        onClick={() => handleDownloadPdf(match)}
                        disabled={!report}
                        className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white text-xs font-semibold shadow-md shadow-rose-600/20 active:scale-95 transition-all"
                      >
                        <FileDown className="w-3.5 h-3.5" />
                        <span>Download Evidence PDF</span>
                      </button>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleAction(match.id, 'dismissed')}
                          disabled={status !== 'pending'}
                          className="px-4 py-2 rounded-full text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-colors"
                        >
                          Dismiss
                        </button>
                        <button
                          onClick={() => handleAction(match.id, 'verified')}
                          disabled={status !== 'pending'}
                          className="flex items-center space-x-1.5 px-5 py-2 rounded-full bg-slate-900 hover:bg-black disabled:opacity-40 text-white text-xs font-semibold shadow-sm transition-all"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Confirm Pattern Integrity</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pending — consent not yet complete */}
          {pendingMatches.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Awaiting Full Consent — Locked</span>
              </h3>

              {pendingMatches.map(match => {
                const phase = getMatchPhase(match);
                const { label, color } = PHASE_LABEL[phase];
                const clusterId = `MC-${match.id.slice(-4).toUpperCase()}`;

                return (
                  <div key={match.id} className="glass-card rounded-3xl p-5 shadow-soft border border-slate-200/60 opacity-80">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <ShieldOff className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-semibold text-slate-700">Pattern Cluster: #{clusterId}</span>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${color}`}>
                          {label}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-start space-x-2">
                      <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>
                        Evidence PDF and full report will appear here once both complainants complete Step 3 consent. Current status: <strong>{label}</strong>.
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── DIRECT COMPLAINTS TAB ───────────────────────────────────────── */}
      {activeTab === 'direct' && (
        <div className="space-y-4">
          {directComplaints.length === 0 ? (
            <div className="glass-card rounded-3xl p-10 shadow-soft text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto">
                <FileDown className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-700">No direct complaints yet</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Direct complaints appear here when a complainant files one from their dashboard without waiting for a pattern match.
              </p>
            </div>
          ) : (
            directComplaints.map(dc => {
              const report = reports.find(r => r.id === dc.reportId);
              return (
                <div key={dc.id} className="glass-card rounded-3xl p-6 shadow-soft space-y-4 border border-rose-200/60">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-rose-100">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                      <span className="text-xs font-semibold text-slate-800">
                        Direct Complaint — Ref: {dc.id.slice(-6).toUpperCase()}
                      </span>
                    </div>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      dc.status === 'acknowledged' ? 'bg-emerald-100 text-emerald-800' :
                      dc.status === 'dismissed'    ? 'bg-slate-100 text-slate-600' :
                                                     'bg-amber-100 text-amber-800'
                    }`}>
                      {dc.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-white border border-rose-100">
                      <p className="text-slate-400 text-[10px] uppercase mb-1">Complainant</p>
                      <p className="font-semibold text-slate-800">{dc.complainantPseudonym}</p>
                      <p className="text-slate-500 text-[11px]">Identity protected — Sec. 16</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-rose-100">
                      <p className="text-slate-400 text-[10px] uppercase mb-1">Respondent</p>
                      <p className="font-semibold text-slate-800 truncate">{report?.accusedName || '—'}</p>
                      <p className="text-slate-500 text-[11px]">{report?.accusedOrg} · {report?.accusedRole}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-rose-100">
                      <p className="text-slate-400 text-[10px] uppercase mb-1">Filed On</p>
                      <p className="font-semibold text-slate-800">
                        {new Date(dc.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      <p className="text-slate-500 text-[11px]">{report?.structuredEvents?.length || 1} incident(s) on record</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <button
                      onClick={async () => {
                        if (report) {
                          logAction(`DIRECT_PDF_${dc.id.slice(-6).toUpperCase()}`);
                          const { generateComplaintPdf } = await import('../utils/pdfGenerator');
                          generateComplaintPdf(report, 1, dc.complainantPseudonym);
                        }
                      }}
                      disabled={!report}
                      className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white text-xs font-semibold shadow-md shadow-rose-600/20 active:scale-95 transition-all"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      <span>Download Complaint PDF</span>
                    </button>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => { updateDirectComplaintStatus(dc.id, 'dismissed'); logAction(`DIRECT_${dc.id.slice(-6).toUpperCase()}_DISMISSED`); }}
                        disabled={dc.status !== 'pending'}
                        className="px-4 py-2 rounded-full text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-colors"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => { updateDirectComplaintStatus(dc.id, 'acknowledged'); logAction(`DIRECT_${dc.id.slice(-6).toUpperCase()}_ACKNOWLEDGED`); }}
                        disabled={dc.status !== 'pending'}
                        className="flex items-center space-x-1.5 px-5 py-2 rounded-full bg-slate-900 hover:bg-black disabled:opacity-40 text-white text-xs font-semibold shadow-sm transition-all"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Acknowledge</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ── AUDIT LOG TAB ───────────────────────────────────────────────── */}
      {activeTab === 'audit' && (
        <div className="glass-card rounded-3xl p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-base font-semibold text-slate-800">
              Non-PII Immutable Audit Log
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">DPDPA 2023 Compliant</span>
          </div>

          {auditLogs.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">No actions recorded in this session yet.</p>
          ) : (
            <div className="space-y-2 font-mono text-xs">
              {auditLogs.map(log => (
                <div key={log.id} className="p-3 rounded-xl bg-white border border-rose-100 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-rose-700 font-semibold">{log.action}</span>
                    <span className="text-slate-400 ml-2">by {log.reviewerId}</span>
                  </div>
                  <span className="text-slate-500 text-[11px] shrink-0">{log.timestamp}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
