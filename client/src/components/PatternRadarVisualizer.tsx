import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  RotateCw, 
  Users2, 
  Building2, 
  CheckCircle2,
  HeartHandshake
} from 'lucide-react';

interface PatternRadarVisualizerProps {
  matchesCount: number;
  primaryPseudonym: string;
  peerPseudonym?: string;
  accusedOrg?: string;
}

export const PatternRadarVisualizer: React.FC<PatternRadarVisualizerProps> = ({
  matchesCount,
  primaryPseudonym,
  peerPseudonym = 'Colleague #2',
  accusedOrg = 'Apex Global Technologies'
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleCheckNow = () => {
    setIsChecking(true);
    setStatusMessage('Checking for matching reports at your organization...');

    setTimeout(() => {
      setIsChecking(false);
      setStatusMessage(
        matchesCount > 0 
          ? 'Match confirmed: Another person filed a report about the same supervisor.' 
          : 'Your report is safe and encrypted. We will alert you the moment a match appears.'
      );
      setTimeout(() => setStatusMessage(null), 4000);
    }, 1200);
  };

  const hasMatch = matchesCount > 0;

  return (
    <div className="glass-card rounded-3xl p-5 sm:p-7 border border-rose-200/80 shadow-soft space-y-5 bg-gradient-to-br from-rose-50/70 via-white to-blush-50/50">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-100 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-xs">
            <Users2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-serif text-base sm:text-lg font-bold text-slate-800">
                Pattern Matching
              </h3>
              <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                hasMatch 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                  : 'bg-rose-100 text-rose-800 border border-rose-200'
              }`}>
                {hasMatch ? 'Match Found' : 'Watching for Matches'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Checks if anyone else reported the same person, without reading your private files.
            </p>
          </div>
        </div>

        <button
          onClick={handleCheckNow}
          disabled={isChecking}
          className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold shadow-xs transition-all active:scale-95 self-start sm:self-auto shrink-0"
        >
          <RotateCw className={`w-3.5 h-3.5 text-rose-600 ${isChecking ? 'animate-spin' : ''}`} />
          <span>{isChecking ? 'Checking...' : 'Check Status'}</span>
        </button>
      </div>

      {/* Visual Matching Representation (Clean & Simple) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white/90 border border-rose-100 shadow-xs space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          
          {/* Node 1: Your Report */}
          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 text-center space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">Your Report</span>
            <div className="text-xs font-bold text-slate-800 truncate">{primaryPseudonym}</div>
            <div className="inline-flex items-center space-x-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
              <CheckCircle2 className="w-3 h-3" />
              <span>Encrypted & Sealed</span>
            </div>
          </div>

          {/* Center: The Connection */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-rose-600 text-white shadow-md mx-auto">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                {hasMatch ? 'Same Person Identified' : 'No Overlap Yet'}
              </span>
              <span className="text-[11px] text-slate-500 block truncate">
                {accusedOrg}
              </span>
            </div>
          </div>

          {/* Node 2: Colleague's Report */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Colleague's Report</span>
            <div className="text-xs font-bold text-slate-800 truncate">
              {hasMatch ? peerPseudonym : 'Waiting for report...'}
            </div>
            <div className="inline-flex items-center space-x-1 text-[11px] text-slate-600 font-semibold bg-slate-200/60 px-2 py-0.5 rounded-md">
              <Lock className="w-3 h-3 text-slate-500" />
              <span>{hasMatch ? 'Encrypted & Sealed' : 'Listening'}</span>
            </div>
          </div>

        </div>

        {/* Reassurance Banner */}
        <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200/60 flex items-center justify-between text-xs text-rose-900 gap-2">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0" />
            <p className="text-[11px] leading-relaxed">
              <strong>100% Confidential:</strong> Neither person's name or story has been shared. You both control what happens next.
            </p>
          </div>
          {hasMatch && (
            <span className="text-[10px] font-mono font-semibold bg-white px-2 py-0.5 rounded border border-rose-200 shrink-0">
              {matchesCount + 1} Reports Matched
            </span>
          )}
        </div>

      </div>

      {/* Status Feedback Message */}
      {statusMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium animate-in fade-in flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

    </div>
  );
};
