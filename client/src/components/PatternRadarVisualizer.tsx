import React, { useState } from 'react';
import { 
  Radar, 
  ShieldCheck, 
  Radio, 
  Sparkles, 
  Lock, 
  RotateCw, 
  Activity, 
  Zap,
  CheckCircle2,
  Building2
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
  peerPseudonym = 'Vault #N44',
  accusedOrg = 'Apex Global Technologies'
}) => {
  const [isFastSweeping, setIsFastSweeping] = useState(false);
  const [sweepMessage, setSweepMessage] = useState<string | null>(null);

  const triggerLiveSweep = () => {
    setIsFastSweeping(true);
    setSweepMessage('Scanning for matching reports at your organization...');

    // Play subtle audio radar ping if supported
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 note
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.9);
      }
    } catch {
      // Audio fallback
    }

    setTimeout(() => {
      setIsFastSweeping(false);
      setSweepMessage(
        matchesCount > 0 
          ? '✓ Match Found: Another colleague reported the same person.' 
          : '✓ Check Complete: Your report is safe. We will alert you if another report matches.'
      );
      setTimeout(() => setSweepMessage(null), 4000);
    }, 1800);
  };

  const hasMatch = matchesCount > 0;

  return (
    <div className="rounded-3xl bg-gradient-to-br from-stone-950 via-[#1b070f] to-stone-950 border border-rose-900/60 p-5 sm:p-7 shadow-2xl text-stone-100 space-y-6 relative overflow-hidden select-none">
      
      {/* Background ambient radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-rose-600/10 blur-3xl pointer-events-none" />

      {/* Top Telemetry Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-900/40 pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-950/80 border border-rose-800/80 flex items-center justify-center text-rose-400 shadow-inner">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-rose-200">
                Private Match Radar
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Checking Active
              </span>
            </div>
            <p className="text-[11px] text-stone-400">
              Checks if anyone else named the same person, without exposing your private files
            </p>
          </div>
        </div>

        <button
          onClick={triggerLiveSweep}
          disabled={isFastSweeping}
          className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-rose-600/30 hover:bg-rose-600/50 text-rose-200 border border-rose-500/40 text-xs font-medium transition-all active:scale-95 shadow-sm self-start sm:self-auto"
        >
          <RotateCw className={`w-3.5 h-3.5 text-rose-400 ${isFastSweeping ? 'animate-spin' : ''}`} />
          <span>{isFastSweeping ? 'Scanning...' : 'Check for Matches'}</span>
        </button>
      </div>

      {/* Main Radar Screen Layout */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Radar Circular Screen Container */}
        <div className="md:col-span-6 flex justify-center">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-stone-950/90 border-2 border-rose-800/70 shadow-[0_0_35px_rgba(225,29,72,0.18)] flex items-center justify-center overflow-hidden">
            
            {/* Concentric Sonar Pulse Rings */}
            <div className="absolute inset-0 rounded-full border border-rose-500/20 animate-radar-ping pointer-events-none" />
            <div className="absolute inset-6 rounded-full border border-rose-500/20 pointer-events-none" />
            <div className="absolute inset-16 rounded-full border border-rose-500/30 pointer-events-none" />
            <div className="absolute inset-28 rounded-full border border-rose-500/40 pointer-events-none" />

            {/* Radar Crosshairs */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-px h-px bg-rose-500/20 pointer-events-none" />
            <div className="absolute inset-y-0 left-1/2 -translate-x-px w-px bg-rose-500/20 pointer-events-none" />

            {/* Sweeping Radar Beam (Conic Gradient) */}
            <div 
              className={`absolute inset-0 rounded-full pointer-events-none ${
                isFastSweeping ? 'animate-radar-sweep-fast' : 'animate-radar-sweep'
              }`}
              style={{
                background: 'conic-gradient(from 0deg, rgba(244,63,94,0.45) 0deg, rgba(244,63,94,0.1) 45deg, transparent 90deg, transparent 360deg)'
              }}
            />

            {/* SVG Connecting Signal Beam between You & Peer Blip (When Match Discovered) */}
            {hasMatch && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                <line 
                  x1="50%" 
                  y1="50%" 
                  x2="78%" 
                  y2="28%" 
                  stroke="#fb7185" 
                  strokeWidth="2" 
                  strokeDasharray="4 4"
                  className="animate-signal-flow"
                />
              </svg>
            )}

            {/* Central Node: Current User's Vault */}
            <div className="relative z-20 flex flex-col items-center">
              <div className="relative flex items-center justify-center">
                <span className="absolute w-7 h-7 rounded-full bg-emerald-500/30 animate-ping" />
                <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-lg shadow-emerald-500/50" />
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-black/70 px-2 py-0.5 rounded-full mt-1.5 border border-emerald-500/30">
                You (Your Vault)
              </span>
            </div>

            {/* Detected Peer Blip (When Match Discovered) */}
            {hasMatch && (
              <div 
                className="absolute z-20 flex flex-col items-center cursor-pointer group"
                style={{ top: '22%', right: '16%' }}
              >
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-8 h-8 rounded-full bg-rose-500/40 animate-ping" />
                  <div className="w-4 h-4 rounded-full bg-rose-500 border-2 border-white shadow-lg animate-blip-glow" />
                </div>
                <div className="text-center mt-1">
                  <span className="text-[10px] font-mono font-bold text-rose-300 bg-stone-900/90 px-2 py-0.5 rounded-md border border-rose-500/40 shadow-sm block whitespace-nowrap">
                    Colleague's Report Found
                  </span>
                  <span className="text-[8px] font-mono text-rose-400 block tracking-tight">
                    Same Person Reported
                  </span>
                </div>
              </div>
            )}

            {/* Compass Coordinates Overlay */}
            <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] font-mono text-rose-400/60 font-semibold">000°</span>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-mono text-rose-400/60 font-semibold">090°</span>
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-mono text-rose-400/60 font-semibold">180°</span>
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] font-mono text-rose-400/60 font-semibold">270°</span>
          </div>
        </div>

        {/* Telemetry Readout & Signal Metrics Panel */}
        <div className="md:col-span-6 space-y-3.5 text-xs">
          
          {/* Signal Status Box */}
          <div className={`p-4 rounded-2xl border transition-all ${
            hasMatch 
              ? 'bg-rose-950/40 border-rose-500/50 shadow-md shadow-rose-950/30' 
              : 'bg-stone-900/60 border-stone-800'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-rose-300 flex items-center space-x-1.5">
                <Zap className="w-3.5 h-3.5 text-rose-400" />
                <span>Status</span>
              </span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                hasMatch 
                  ? 'bg-rose-500/30 text-rose-200 border border-rose-400/50' 
                  : 'bg-stone-800 text-stone-400'
              }`}>
                {hasMatch ? 'MATCH FOUND' : 'WAITING FOR MATCH'}
              </span>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              {hasMatch 
                ? 'Another person at the same company reported this individual. Neither of your names or stories have been shared with anyone.'
                : 'Your report is safe and encrypted. We are waiting to see if another colleague reports the same person. If they do, you will both be notified.'}
            </p>
          </div>

          {/* Cryptographic Telemetry Grid */}
          <div className="grid grid-cols-2 gap-2.5 font-mono text-[11px]">
            <div className="p-3 rounded-xl bg-stone-900/80 border border-stone-800 space-y-1">
              <span className="text-[10px] text-stone-400 block uppercase">Privacy</span>
              <span className="font-semibold text-rose-300 block">100% Encrypted</span>
            </div>
            
            <div className="p-3 rounded-xl bg-stone-900/80 border border-stone-800 space-y-1">
              <span className="text-[10px] text-stone-400 block uppercase">Name Matching</span>
              <span className="font-semibold text-rose-300 block">Smart Sound Match</span>
            </div>

            <div className="p-3 rounded-xl bg-stone-900/80 border border-stone-800 space-y-1">
              <span className="text-[10px] text-stone-400 block uppercase">Workplace</span>
              <span className="font-semibold text-rose-300 block truncate">{accusedOrg}</span>
            </div>

            <div className="p-3 rounded-xl bg-stone-900/80 border border-stone-800 space-y-1">
              <span className="text-[10px] text-stone-400 block uppercase">Match Result</span>
              <span className="font-semibold text-emerald-400 block">
                {hasMatch ? 'Confirmed Match' : 'Waiting for Peer'}
              </span>
            </div>
          </div>

          {/* Interactive Live Sweep Notification */}
          {sweepMessage && (
            <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-400/40 text-[11px] text-rose-200 font-mono animate-in fade-in flex items-center space-x-2">
              <Activity className="w-3.5 h-3.5 text-rose-400 animate-pulse shrink-0" />
              <span>{sweepMessage}</span>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
