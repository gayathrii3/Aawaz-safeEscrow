import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ConsentScope } from '../types';
import { generateComplaintPdf } from '../utils/pdfGenerator';
import { PatternRadarVisualizer } from './PatternRadarVisualizer';
import { 
  Users2, 
  ShieldCheck, 
  Lock, 
  FileDown, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  Scale, 
  Building2, 
  Shield,
  HeartHandshake,
  Clock,
  ExternalLink,
  FileText,
  Check
} from 'lucide-react';

export const MatchesHub: React.FC = () => {
  const { matches, reports, updateConsent, updatePeerConsent, currentUser, setView } = useApp();
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const activeMatch = matches[0];
  const primaryReport = reports[0];

  const handleDownloadPdf = () => {
    if (!primaryReport) return;
    setDownloadingPdf(true);
    try {
      generateComplaintPdf(primaryReport, matches.length + 1, currentUser.pseudonym);
    } finally {
      setTimeout(() => setDownloadingPdf(false), 800);
    }
  };

  const myConsent: ConsentScope = activeMatch ? activeMatch.myConsent : 'none';
  const peerConsent: ConsentScope = activeMatch ? activeMatch.peerConsent : 'none';

  // Mutual level calculations
  const level1Mutual = true; // Once matched, existence is mutually confirmed
  const level2Mutual = (myConsent === 'timeline' || myConsent === 'full') && (peerConsent === 'timeline' || peerConsent === 'full');
  const level3Mutual = myConsent === 'full' && peerConsent === 'full';

  // Highest mutually unlocked level
  const mutualLevel = level3Mutual ? 3 : level2Mutual ? 2 : 1;

  // Selected level in UI (tracks user's requested level)
  const userSelectedLevel = myConsent === 'full' ? 3 : myConsent === 'timeline' ? 2 : 1;

  // Helper for human-friendly behavior category names
  const getSimpleCategoryName = (category: string) => {
    switch (category) {
      case 'quid_pro_quo':
        return 'Unfair Pressure During Reviews';
      case 'unwanted_contact':
        return 'Unwanted Late-Night Messages';
      case 'verbal_harassment':
        return 'Inappropriate Comments';
      case 'intimidation':
        return 'Threats of Retaliation';
      case 'cyber_stalking':
        return 'Unwanted Online Tracking';
      default:
        return 'Workplace Misconduct';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {/* Live Animated Pattern Radar Component */}
      <PatternRadarVisualizer
        matchesCount={matches.length}
        primaryPseudonym={currentUser.pseudonym}
        peerPseudonym={activeMatch?.peerUserPseudonym}
        accusedOrg={primaryReport?.accusedOrg || 'Apex Global Technologies'}
      />

      {matches.length === 0 ? (
        <div className="glass-card rounded-3xl p-8 sm:p-10 text-center space-y-4 max-w-xl mx-auto border border-rose-200/70 shadow-soft">
          <div className="w-14 h-14 rounded-full bg-rose-100/80 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-semibold text-slate-800">
            Your Report is Safe and Encrypted
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
            Your incident report is sealed and saved safely on your device. We will automatically alert you if another person files a report about the same person.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setView('report_builder')}
              className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md transition-all active:scale-95"
            >
              Record or Update Incident Report
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Match Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-600 via-rose-500 to-blush-600 text-white shadow-float space-y-3 relative overflow-hidden">
            <div className="flex items-center space-x-2 text-rose-100 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-4 h-4 text-rose-200" />
              <span>Colleague Match Found</span>
            </div>
            
            <h3 className="font-serif text-xl sm:text-2xl font-bold leading-snug">
              Another Colleague Reported the Same Person
            </h3>

            <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed max-w-2xl">
              Your identity and story have not been shared with anyone. You and the other person now decide together what to do next. Nothing is shared unless you both agree.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-[11px]">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/20">
                Match: <strong>Confirmed</strong>
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/20">
                Company: <strong>Apex Global Technologies</strong>
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/20">
                Current Step: <strong>Step {mutualLevel}</strong>
              </span>
            </div>
          </div>

          {/* Dynamic Progressive Consent Card */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-soft space-y-6">
            
            {/* Header: Title + Peer Simulator for Judges */}
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-rose-100 gap-4">
              <div>
                <h4 className="font-serif text-lg font-semibold text-slate-800">
                  Choose What You Want to Share
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Information only unlocks when <strong>both of you agree</strong> to that step.
                </p>
              </div>

              {/* Dynamic Peer Simulator Toggle */}
              <div className="flex items-center space-x-2 bg-rose-50/80 border border-rose-200/80 px-3 py-1.5 rounded-2xl text-[11px]">
                <span className="text-slate-600 font-medium">Colleague's Choice:</span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => updatePeerConsent(activeMatch.id, 'existence_only')}
                    className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
                      peerConsent === 'existence_only'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-rose-100'
                    }`}
                    title="Colleague agrees to Step 1 only"
                  >
                    Step 1
                  </button>
                  <button
                    onClick={() => updatePeerConsent(activeMatch.id, 'timeline')}
                    className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
                      peerConsent === 'timeline'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-rose-100'
                    }`}
                    title="Colleague agrees to share timeline"
                  >
                    Step 2
                  </button>
                  <button
                    onClick={() => updatePeerConsent(activeMatch.id, 'full')}
                    className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
                      peerConsent === 'full'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-rose-100'
                    }`}
                    title="Colleague agrees to file together"
                  >
                    Step 3
                  </button>
                </div>
              </div>
            </div>

            {/* Mutual Handshake Status Bar */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50/80 via-white to-rose-50/80 border border-rose-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
              {/* You */}
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  You
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800">
                    Vault: {currentUser.pseudonym}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center space-x-1">
                    <span>Your Choice:</span>
                    <span className="font-semibold text-rose-700">
                      Step {userSelectedLevel} ({myConsent === 'full' ? 'File Together' : myConsent === 'timeline' ? 'Share Timeline' : 'Know Match'})
                    </span>
                  </div>
                </div>
              </div>

              {/* Handshake Indicator */}
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  userSelectedLevel <= (peerConsent === 'full' ? 3 : peerConsent === 'timeline' ? 2 : 1)
                    ? 'bg-emerald-100 text-emerald-700 shadow-sm'
                    : 'bg-amber-100 text-amber-700 animate-pulse'
                }`}>
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">
                  {userSelectedLevel <= (peerConsent === 'full' ? 3 : peerConsent === 'timeline' ? 2 : 1)
                    ? 'Both Agreed ✓'
                    : 'Waiting for Colleague ⏳'}
                </span>
              </div>

              {/* Colleague */}
              <div className="flex items-center space-x-3 text-right sm:text-left">
                <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  Peer
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800">
                    Vault: {activeMatch.peerUserPseudonym || 'Vault #N44'}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center space-x-1">
                    <span>Their Choice:</span>
                    <span className="font-semibold text-slate-800">
                      Step {peerConsent === 'full' ? '3 (File Together)' : peerConsent === 'timeline' ? '2 (Share Timeline)' : '1 (Know Match)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scope Selection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Step 1 Card */}
              <div 
                onClick={() => updateConsent(activeMatch.id, 'existence_only')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  myConsent === 'existence_only'
                    ? 'bg-rose-50/90 border-rose-400 ring-2 ring-rose-200 shadow-sm'
                    : 'bg-white border-rose-100 hover:border-rose-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-800">Step 1</span>
                  {myConsent === 'existence_only' ? (
                    <CheckCircle2 className="w-4 h-4 text-rose-600" />
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">Active</span>
                  )}
                </div>
                <h5 className="font-semibold text-xs text-slate-800 mb-1">Know Someone Else Reported</h5>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Know you are not alone without sharing any dates or details yet.
                </p>
                <div className="mt-3 pt-2 border-t border-rose-100/60 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-emerald-700 font-bold flex items-center space-x-0.5">
                    <Check className="w-3 h-3" />
                    <span>Unlocked</span>
                  </span>
                </div>
              </div>

              {/* Step 2 Card */}
              <div 
                onClick={() => updateConsent(activeMatch.id, 'timeline')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  myConsent === 'timeline'
                    ? 'bg-rose-50/90 border-rose-400 ring-2 ring-rose-200 shadow-sm'
                    : 'bg-white border-rose-100 hover:border-rose-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-800">Step 2</span>
                  {myConsent === 'timeline' && <CheckCircle2 className="w-4 h-4 text-rose-600" />}
                </div>
                <h5 className="font-semibold text-xs text-slate-800 mb-1">Share Incident Timelines</h5>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Compare dates and events to show that this person repeats this behavior.
                </p>
                <div className="mt-3 pt-2 border-t border-rose-100/60 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">Status:</span>
                  {level2Mutual ? (
                    <span className="text-emerald-700 font-bold flex items-center space-x-0.5">
                      <Check className="w-3 h-3" />
                      <span>Unlocked</span>
                    </span>
                  ) : (
                    <span className="text-amber-600 font-medium flex items-center space-x-0.5">
                      <Clock className="w-3 h-3" />
                      <span>Waiting for Colleague</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Step 3 Card */}
              <div 
                onClick={() => updateConsent(activeMatch.id, 'full')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  myConsent === 'full'
                    ? 'bg-rose-50/90 border-rose-400 ring-2 ring-rose-200 shadow-sm'
                    : 'bg-white border-rose-100 hover:border-rose-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-800">Step 3</span>
                  {myConsent === 'full' && <CheckCircle2 className="w-4 h-4 text-rose-600" />}
                </div>
                <h5 className="font-semibold text-xs text-slate-800 mb-1">File Complaint Together</h5>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Join together to submit an official complaint to the Internal Committee.
                </p>
                <div className="mt-3 pt-2 border-t border-rose-100/60 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">Status:</span>
                  {level3Mutual ? (
                    <span className="text-emerald-700 font-bold flex items-center space-x-0.5">
                      <Check className="w-3 h-3" />
                      <span>Agreed by Both</span>
                    </span>
                  ) : (
                    <span className="text-amber-600 font-medium flex items-center space-x-0.5">
                      <Clock className="w-3 h-3" />
                      <span>Needs Both to Agree</span>
                    </span>
                  )}
                </div>
              </div>

            </div>

            {/* STEP 1 VIEW: You Are Not Alone */}
            {myConsent === 'existence_only' && (
              <div className="pt-6 border-t border-rose-100 space-y-4">
                <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                        Step 1 Active: You Are Not Alone
                      </span>
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                      Match Confirmed
                    </span>
                  </div>

                  <p className="text-xs text-emerald-900/90 leading-relaxed">
                    You and <strong>1 other colleague at Apex Global Technologies</strong> have both reported the same person. You are no longer alone or isolated.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-[11px] text-emerald-800">
                    <div className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>100% Private: Your name and details stay locked on your device</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Dates and incident details stay sealed in your vault</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>No one in HR or management knows you saved this report</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Nothing is ever sent without your explicit choice</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-rose-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                  <div className="text-left">
                    <h5 className="text-xs font-semibold text-slate-800">
                      Want to compare incident dates safely?
                    </h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Sharing your timeline helps prove this person repeats the same behavior with others, while keeping your names private.
                    </p>
                  </div>
                  <button
                    onClick={() => updateConsent(activeMatch.id, 'timeline')}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-all shrink-0"
                  >
                    <span>Agree to Share Timeline (Step 2)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2 VIEW: Share Incident Timelines */}
            {myConsent === 'timeline' && (
              <div className="pt-6 border-t border-rose-100 space-y-4">
                
                {/* If colleague hasn't agreed to Step 2 yet */}
                {!level2Mutual ? (
                  <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3">
                    <div className="flex items-center space-x-2 text-amber-900 font-semibold text-xs">
                      <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                      <span>Waiting for Your Colleague to Agree</span>
                    </div>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      You agreed to share timelines. To keep both of you equally safe, timelines are only unlocked when <strong>both people agree</strong>.
                    </p>
                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-[11px] text-amber-700">
                        Colleague's status: <strong>Waiting for their choice</strong>
                      </span>
                      <button
                        onClick={() => updatePeerConsent(activeMatch.id, 'timeline')}
                        className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-semibold transition-all shadow-xs"
                      >
                        Simulate Colleague's Agreement
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <ShieldCheck className="w-5 h-5 text-rose-600" />
                        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                          Step 2 Active: Timelines Shared ({activeMatch.peerRole || 'Colleague'})
                        </h5>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500">
                        Colleague: {activeMatch.peerUserPseudonym}
                      </span>
                    </div>

                    {/* Pattern Summary */}
                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center space-x-2.5">
                      <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                      <p className="text-[11px] leading-relaxed">
                        <strong>Pattern Found:</strong> Both of you reported similar behavior (unwanted late-night messages and threats during reviews) between March 2026 and October 2026.
                      </p>
                    </div>

                    {/* Shared Events */}
                    <div className="space-y-3">
                      {activeMatch.timelineSharedWithMe?.map((evt) => (
                        <div key={evt.id} className="p-4 rounded-2xl bg-white border border-rose-200/80 shadow-xs space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-800 flex items-center space-x-1.5">
                              <Calendar className="w-3.5 h-3.5 text-rose-500" />
                              <span>{evt.dateOrPeriod}</span>
                            </span>
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                              {getSimpleCategoryName(evt.behaviorCategory)}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed pt-1">
                            {evt.description}
                          </p>
                          <p className="text-[11px] text-slate-400 flex items-center space-x-1 pt-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{evt.location}</span>
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Download CTA & Step up to Step 3 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                      <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 flex flex-col justify-between">
                        <div>
                          <h5 className="text-xs font-semibold text-rose-900">
                            Download Incident Report (PDF)
                          </h5>
                          <p className="text-[11px] text-rose-700/90 mt-1">
                            Official summary showing both timelines, ready to give to the committee if you want.
                          </p>
                        </div>
                        <button
                          onClick={handleDownloadPdf}
                          disabled={downloadingPdf}
                          className="mt-3 flex items-center justify-center space-x-2 px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow transition-all"
                        >
                          <FileDown className="w-4 h-4" />
                          <span>{downloadingPdf ? 'Preparing PDF...' : 'Download Stamped PDF'}</span>
                        </button>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">Next Step</span>
                          <h5 className="text-xs font-semibold text-white mt-1">
                            File Together (Step 3)
                          </h5>
                          <p className="text-[11px] text-slate-300 mt-1">
                            Join forces to ask for immediate protection at work (moving the supervisor away) and a fair inquiry.
                          </p>
                        </div>
                        <button
                          onClick={() => updateConsent(activeMatch.id, 'full')}
                          className="mt-3 flex items-center justify-center space-x-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white text-xs font-semibold shadow transition-all"
                        >
                          <span>Agree to File Together (Step 3)</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </>
                )}

              </div>
            )}

            {/* STEP 3 VIEW: JOINT COMPLAINT AGREEMENT */}
            {myConsent === 'full' && (
              <div className="pt-6 border-t border-rose-100 space-y-6">
                
                {/* Check if peer has also consented to Step 3 */}
                {!level3Mutual ? (
                  <div className="p-5 rounded-2xl bg-amber-50/90 border border-amber-200 space-y-3">
                    <div className="flex items-center space-x-2 text-amber-900 font-semibold text-xs">
                      <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                      <span>Waiting for Your Colleague's Digital Signature</span>
                    </div>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      You signed the agreement to file together. A joint complaint requires both people's digital signature to protect your privacy and ensure you both get protection at work.
                    </p>
                    <div className="pt-2 flex items-center justify-between border-t border-amber-200/60">
                      <span className="text-[11px] text-amber-700">
                        Colleague's status: <strong>Reviewing terms</strong>
                      </span>
                      <button
                        onClick={() => updatePeerConsent(activeMatch.id, 'full')}
                        className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold transition-all shadow-xs"
                      >
                        Simulate Colleague's Signature
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* The Mutual Joint Action Agreement Card */}
                    <div className="rounded-3xl bg-gradient-to-br from-rose-950 via-slate-900 to-slate-950 text-white shadow-xl border border-rose-900/40 overflow-hidden">
                      
                      {/* Pact Header */}
                      <div className="p-6 bg-gradient-to-r from-rose-900/60 to-transparent border-b border-rose-800/40 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center space-x-2">
                            <Scale className="w-5 h-5 text-rose-400" />
                            <span className="text-xs font-bold uppercase tracking-wider text-rose-300">
                              Joint Complaint Agreement • Signed by Both
                            </span>
                          </div>
                          <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                            Both Signed
                          </span>
                        </div>

                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                          Why Filing Together Makes You Stronger and Safer
                        </h3>

                        <p className="text-xs text-rose-100/90 leading-relaxed max-w-2xl">
                          When someone reports alone, it is easy for an employer to dismiss it as a "misunderstanding" or "he said, she said". When two people file together, it proves a continuous pattern of harassment that management cannot ignore.
                        </p>
                      </div>

                      {/* 3 Clear Rules You Both Agree To */}
                      <div className="p-6 space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300">
                          3 Important Rules You Both Agree To
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          
                          {/* Rule 1: Combined Proof */}
                          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:bg-white/10 transition-colors">
                            <div className="flex items-center space-x-2 text-rose-300">
                              <Sparkles className="w-4 h-4 shrink-0" />
                              <h5 className="font-semibold text-xs text-white">1. Combined Proof</h5>
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed">
                              Both your timelines are joined into one strong case. Proving that this happened to more than one person makes your complaint undeniable under the law (POSH Act Sec 11).
                            </p>
                            <span className="inline-block text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                              Stronger Together
                            </span>
                          </div>

                          {/* Rule 2: Immediate Safety at Work */}
                          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:bg-white/10 transition-colors">
                            <div className="flex items-center space-x-2 text-rose-300">
                              <Building2 className="w-4 h-4 shrink-0" />
                              <h5 className="font-semibold text-xs text-white">2. Safety at Work</h5>
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed">
                              You both ask the committee to immediately move the supervisor to another team or put them on paid leave (POSH Act Sec 12) so you are safe while they investigate.
                            </p>
                            <span className="inline-block text-[10px] font-mono text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded">
                              Protected from Retaliation
                            </span>
                          </div>

                          {/* Rule 3: Strict Privacy */}
                          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:bg-white/10 transition-colors">
                            <div className="flex items-center space-x-2 text-rose-300">
                              <Shield className="w-4 h-4 shrink-0" />
                              <h5 className="font-semibold text-xs text-white">3. Strict Privacy</h5>
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed">
                              Neither of you can share or leak any details publicly. The law (POSH Act Sec 16) strictly protects your privacy and identity during the whole process.
                            </p>
                            <span className="inline-block text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded">
                              100% Confidential
                            </span>
                          </div>

                        </div>

                        {/* Both Digital Signatures */}
                        <div className="mt-4 p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                          <div className="flex items-center justify-between text-xs text-slate-300">
                            <span className="font-semibold uppercase tracking-wider text-[10px] text-slate-400">
                              Digital Signatures from Both Accounts
                            </span>
                            <span className="text-[10px] font-mono text-emerald-400">
                              Both Accounts Confirmed
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                              <div>
                                <div className="text-slate-400 text-[10px]">You</div>
                                <div className="text-slate-200">{currentUser.pseudonym}</div>
                              </div>
                              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                                SIGNED ✓
                              </span>
                            </div>

                            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                              <div>
                                <div className="text-slate-400 text-[10px]">Colleague</div>
                                <div className="text-slate-200">{activeMatch.peerUserPseudonym || 'Vault #N44'}</div>
                              </div>
                              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                                SIGNED ✓
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/5">
                            <span>Sent to: <strong>Internal Committee (IC), Apex Global</strong></span>
                            <span>Committee Leader: <strong>Adv. Shalini (External Legal Expert)</strong></span>
                          </div>
                        </div>

                        {/* Direct Actions */}
                        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                          <button
                            onClick={handleDownloadPdf}
                            disabled={downloadingPdf}
                            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-lg hover:shadow-rose-600/30 transition-all active:scale-95"
                          >
                            <FileDown className="w-4 h-4" />
                            <span>{downloadingPdf ? 'Preparing Joint PDF...' : 'Download Joint Complaint (PDF)'}</span>
                          </button>

                          <button
                            onClick={() => setView('reviewer')}
                            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all active:scale-95"
                          >
                            <span>Open Committee Reviewer Portal</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>

                      </div>
                    </div>

                    {/* Combined Incident Timeline */}
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-serif text-base font-semibold text-slate-800">
                            Combined Incident Timeline
                          </h5>
                          <p className="text-xs text-slate-500">
                            Shows how the same behavior happened to both people over time.
                          </p>
                        </div>
                        <span className="text-[11px] font-semibold text-rose-800 bg-rose-100 px-3 py-1 rounded-full">
                          2 Reported Incidents
                        </span>
                      </div>

                      {/* Display primary user's event */}
                      {primaryReport?.structuredEvents && primaryReport.structuredEvents.length > 0 && (
                        <div className="p-4 rounded-2xl bg-white border border-rose-200/80 shadow-xs space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-800 flex items-center space-x-2">
                              <span className="w-2 h-2 rounded-full bg-rose-600" />
                              <span>{primaryReport.structuredEvents[0].dateOrPeriod}</span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                                Your Vault ({currentUser.pseudonym})
                              </span>
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                              {getSimpleCategoryName(primaryReport.structuredEvents[0].behaviorCategory)}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {primaryReport.structuredEvents[0].description}
                          </p>
                          <p className="text-[11px] text-slate-400 flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{primaryReport.structuredEvents[0].location}</span>
                          </p>
                        </div>
                      )}

                      {/* Display peer user's events */}
                      {activeMatch.timelineSharedWithMe?.map((evt) => (
                        <div key={evt.id} className="p-4 rounded-2xl bg-white border border-rose-200/80 shadow-xs space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-800 flex items-center space-x-2">
                              <span className="w-2 h-2 rounded-full bg-slate-800" />
                              <span>{evt.dateOrPeriod}</span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                                Colleague's Vault ({activeMatch.peerUserPseudonym})
                              </span>
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800">
                              {getSimpleCategoryName(evt.behaviorCategory)}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {evt.description}
                          </p>
                          <p className="text-[11px] text-slate-400 flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{evt.location}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </>
                )}

              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
};