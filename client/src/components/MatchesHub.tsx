import React from 'react';
import { useApp } from '../context/AppContext';
import { generateComplaintPdf } from '../utils/pdfGenerator';
import { PatternRadarVisualizer } from './PatternRadarVisualizer';
import {
  Lock,
  FileDown,
  Calendar,
  MapPin,
  Scale,
  Building2,
  Shield,
  Clock,
  CheckCircle2,
  Send,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
export const MatchesHub: React.FC = () => {
  const {
    matches,
    reports,
    requestStep,
    currentUser,
    setView,
    directComplaints,
    submitDirectComplaint,
  } = useApp();

  const [downloadingPdf, setDownloadingPdf] = React.useState(false);

  const activeMatch = matches[0];
  const primaryReport = reports[0];

  if (!activeMatch) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <PatternRadarVisualizer
          matchesCount={0}
          primaryPseudonym={currentUser.pseudonym}
        />
        <div className="glass-card rounded-3xl p-8 text-center space-y-4 max-w-xl mx-auto border border-rose-200/70 shadow-soft mt-8">
          <div className="w-14 h-14 rounded-full bg-rose-100/80 text-rose-600 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-semibold text-slate-800">
            Your Report is Safe and Encrypted
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
            Your report is sealed and saved safely. You will be notified the moment another person files a report about the same person.
          </p>
          <button
            onClick={() => setView('report_builder')}
            className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md transition-all"
          >
            Record or Update Incident Report
          </button>
        </div>
      </div>
    );
  }

  const peerName = activeMatch.peerUserPseudonym || 'Colleague #2';

  // Derive states
  const step2Unlocked = activeMatch.myConsent === 'timeline' || activeMatch.myConsent === 'full';
  const step3Unlocked = activeMatch.myConsent === 'full';

  const myReqStep2 = activeMatch.myStep2Requested ?? false;
  const peerReqStep2 = activeMatch.peerStep2Requested ?? false;
  const myReqStep3 = activeMatch.myStep3Requested ?? false;
  const peerReqStep3 = activeMatch.peerStep3Requested ?? false;

  const getSimpleCategoryName = (category: string) => {
    switch (category) {
      case 'quid_pro_quo': return 'Unfair Pressure During Reviews';
      case 'unwanted_contact': return 'Unwanted Late-Night Messages';
      case 'verbal_harassment': return 'Inappropriate Comments';
      case 'intimidation': return 'Threats of Retaliation';
      case 'cyber_stalking': return 'Unwanted Online Tracking';
      default: return 'Workplace Misconduct';
    }
  };

  const handleDownloadPdf = () => {
    if (!primaryReport) return;
    setDownloadingPdf(true);
    try {
      generateComplaintPdf(
        primaryReport,
        matches.length + 1,
        currentUser.pseudonym,
        activeMatch.timelineSharedWithMe,
        peerName
      );
    } finally {
      setTimeout(() => setDownloadingPdf(false), 800);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <PatternRadarVisualizer
        matchesCount={matches.length}
        primaryPseudonym={currentUser.pseudonym}
        peerPseudonym={peerName}
        accusedOrg={primaryReport?.accusedOrg || 'Your Organization'}
      />

      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-soft space-y-6">

        {/* Header */}
        <div className="border-b border-rose-100 pb-4">
          <h3 className="font-serif text-xl font-bold text-slate-800">
            How Both of You Can File Together
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Each step only opens when <strong>both of you agree</strong> to proceed. Neither side can be forced.
          </p>
        </div>

        {/* ─────────────── STEP 1 ─────────────── */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Step 1 — Match Confirmed</span>
            </div>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-bold">
              Active
            </span>
          </div>
          <p className="text-xs text-emerald-900 leading-relaxed">
            You and <strong>{peerName}</strong> have both reported the same person. You are not alone.
            At this stage, neither of you can see each other's name, dates, or details.
          </p>

          {/* Step 2 request area */}
          {!step2Unlocked && (
            <div className="pt-3 border-t border-emerald-200 space-y-3">
              <p className="text-xs font-semibold text-slate-700">
                Ready to compare incident dates? Both of you must agree first.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Your action */}
                <div className="rounded-xl bg-white border border-emerald-100 p-3 space-y-2">
                  <span className="text-[11px] font-semibold text-slate-500">Your Action</span>
                  {myReqStep2 ? (
                    <div className="flex items-center space-x-1.5 text-emerald-700 text-xs font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Request sent. Waiting for {peerName}.</span>
                    </div>
                  ) : peerReqStep2 ? (
                    <button
                      onClick={() => requestStep(activeMatch.id, 2)}
                      className="w-full flex items-center justify-center space-x-1.5 px-3 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Agree to Compare Timelines</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => requestStep(activeMatch.id, 2)}
                      className="w-full flex items-center justify-center space-x-1.5 px-3 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Request to Compare Timelines</span>
                    </button>
                  )}
                </div>

                {/* Peer's status — read only */}
                <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 space-y-2">
                  <span className="text-[11px] font-semibold text-slate-500">{peerName}'s Status</span>
                  {peerReqStep2 ? (
                    <div className="flex items-center space-x-1.5 text-emerald-700 text-xs font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>They sent a request to compare timelines.</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1.5 text-slate-400 text-xs">
                      <Clock className="w-4 h-4" />
                      <span>Waiting for their decision…</span>
                    </div>
                  )}
                </div>
              </div>

              {myReqStep2 && !peerReqStep2 && (
                <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  Your request has been sent. Step 2 will unlock as soon as {peerName} also agrees.
                </p>
              )}
            </div>
          )}
        </div>

        {/* ─────────────── STEP 2 ─────────────── */}
        <div className={`rounded-2xl border p-5 space-y-3 transition-all ${
          step2Unlocked
            ? 'border-rose-200 bg-white'
            : 'border-slate-200 bg-slate-50 opacity-60'
        }`}>
          <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-2 font-bold text-xs uppercase tracking-wider ${
              step2Unlocked ? 'text-rose-800' : 'text-slate-500'
            }`}>
              {step2Unlocked
                ? <Sparkles className="w-4 h-4 text-rose-600" />
                : <Lock className="w-4 h-4 text-slate-400" />
              }
              <span>Step 2 — Compare Timelines</span>
            </div>
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
              step2Unlocked
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-slate-200 text-slate-500'
            }`}>
              {step2Unlocked ? 'Unlocked' : 'Locked'}
            </span>
          </div>

          {!step2Unlocked ? (
            <p className="text-xs text-slate-400">
              This step opens only after both you and {peerName} agree to share timelines.
            </p>
          ) : (
            <>
              <p className="text-xs text-slate-600 leading-relaxed">
                Both of you agreed. Below are the compared incident dates. This proves a repeated pattern — not a one-off incident.
              </p>

              {/* Timeline Cards */}
              <div className="space-y-3">
                {activeMatch.timelineSharedWithMe?.map((evt) => (
                  <div key={evt.id} className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 flex items-center space-x-1.5">
                        <Calendar className="w-3.5 h-3.5 text-rose-500" />
                        <span>{evt.dateOrPeriod}</span>
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                        {getSimpleCategoryName(evt.behaviorCategory)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed pt-1">{evt.description}</p>
                    <p className="text-[11px] text-slate-400 flex items-center space-x-1 pt-1">
                      <MapPin className="w-3 h-3" />
                      <span>{evt.location}</span>
                    </p>
                  </div>
                ))}
              </div>

              {/* Request Step 3 */}
              {!step3Unlocked && (
                <div className="pt-3 border-t border-rose-100 space-y-3">
                  <p className="text-xs font-semibold text-slate-700">
                    Ready to file a joint complaint? Both of you must agree to proceed.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Your action */}
                    <div className="rounded-xl bg-white border border-rose-100 p-3 space-y-2">
                      <span className="text-[11px] font-semibold text-slate-500">Your Action</span>
                      {myReqStep3 ? (
                        <div className="flex items-center space-x-1.5 text-emerald-700 text-xs font-semibold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Request sent. Waiting for {peerName}.</span>
                        </div>
                      ) : peerReqStep3 ? (
                        <button
                          onClick={() => requestStep(activeMatch.id, 3)}
                          className="w-full flex items-center justify-center space-x-1.5 px-3 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Agree to File Together</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => requestStep(activeMatch.id, 3)}
                          className="w-full flex items-center justify-center space-x-1.5 px-3 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-all"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Send Request to File Together</span>
                        </button>
                      )}
                    </div>

                    {/* Peer status — read only */}
                    <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 space-y-2">
                      <span className="text-[11px] font-semibold text-slate-500">{peerName}'s Status</span>
                      {peerReqStep3 ? (
                        <div className="flex items-center space-x-1.5 text-emerald-700 text-xs font-semibold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>They sent a request to file together.</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1.5 text-slate-400 text-xs">
                          <Clock className="w-4 h-4" />
                          <span>Waiting for their decision…</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {myReqStep3 && !peerReqStep3 && (
                    <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                      Your request has been sent. Step 3 will unlock as soon as {peerName} also agrees.
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* ─────────────── STEP 3 ─────────────── */}
        <div className={`rounded-2xl border p-5 space-y-4 transition-all ${
          step3Unlocked
            ? 'border-slate-800 bg-slate-950 text-white'
            : 'border-slate-200 bg-slate-50 opacity-60'
        }`}>
          <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-2 font-bold text-xs uppercase tracking-wider ${
              step3Unlocked ? 'text-rose-300' : 'text-slate-500'
            }`}>
              {step3Unlocked
                ? <Scale className="w-4 h-4 text-rose-400" />
                : <Lock className="w-4 h-4 text-slate-400" />
              }
              <span>Step 3 — File Joint Complaint</span>
            </div>
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
              step3Unlocked
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-slate-200 text-slate-500'
            }`}>
              {step3Unlocked ? 'Both Agreed' : 'Locked'}
            </span>
          </div>

          {!step3Unlocked ? (
            <p className="text-xs text-slate-400">
              This step opens only after both you and {peerName} agree to file together.
            </p>
          ) : (
            <>
              <div className="space-y-1">
                <h4 className="font-serif text-base font-bold text-white">
                  Both of You Are Ready to File
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  A joint complaint is harder to dismiss. Two independent accounts prove a pattern, not a misunderstanding.
                </p>
              </div>

              {/* Protections */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { icon: <Scale className="w-4 h-4" />, title: 'Combined Proof', desc: 'Both timelines form one strong case that cannot be dismissed as a single incident.' },
                  { icon: <Building2 className="w-4 h-4" />, title: 'Safety at Work', desc: 'You can both demand a transfer or paid leave for the accused during the inquiry.' },
                  { icon: <Shield className="w-4 h-4" />, title: 'Strict Privacy', desc: 'The law forbids anyone from revealing your names or stories. Leaks carry legal penalties.' },
                ].map((item) => (
                  <div key={item.title} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                    <div className="text-xs font-bold text-rose-300 flex items-center space-x-1.5">
                      {item.icon}
                      <span>{item.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-black/40 border border-white/10 text-xs">
                {[
                  { label: 'Complainant 1', name: currentUser.pseudonym },
                  { label: 'Complainant 2', name: peerName },
                ].map((p) => (
                  <div key={p.label} className="flex items-center justify-between p-2.5 rounded-xl bg-white/5">
                    <div>
                      <span className="text-[10px] text-slate-400 block">{p.label}</span>
                      <span className="font-semibold text-slate-200">{p.name}</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      AGREED
                    </span>
                  </div>
                ))}
              </div>

              {/* Submit to IGC notice */}
              <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                <p className="text-xs text-slate-300">
                  <strong className="text-white">Who receives this complaint?</strong>{' '}
                  Submit the downloaded PDF to the <strong className="text-rose-300">Internal Grievance Committee (IGC)</strong> of your organization — either upload it through the committee portal or email it to the designated IGC address.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                <button
                  onClick={handleDownloadPdf}
                  disabled={downloadingPdf}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-lg transition-all active:scale-95"
                >
                  <FileDown className="w-4 h-4" />
                  <span>{downloadingPdf ? 'Preparing PDF...' : 'Download Joint Complaint (PDF)'}</span>
                </button>

                {(() => {
                  const isFiled = directComplaints?.some(d => d.reportId === primaryReport?.id);
                  return isFiled ? (
                    <div className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-3 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-medium">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Filed to IC Reviewer</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        if (primaryReport?.id) {
                          submitDirectComplaint(primaryReport.id);
                        }
                      }}
                      className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold shadow-md transition-all active:scale-95"
                    >
                      <Send className="w-4 h-4 text-rose-400" />
                      <span>File / Send to IC Reviewer</span>
                    </button>
                  );
                })()}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
