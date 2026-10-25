import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  X, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Scale, 
  Lock, 
  Users2, 
  FileCheck2,
  CheckCircle2, 
  Award,
} from 'lucide-react';
import { AawazLogo } from './AawazLogo';

interface AuthorityVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface VideoSegment {
  startTime: number;
  endTime: number;
  title: string;
  badge: string;
  headline: string;
  subheadline: string;
  body: string;
  graphicType: 'problem' | 'logo' | 'crypto' | 'posh';
}

const SEGMENTS: VideoSegment[] = [
  {
    startTime: 0,
    endTime: 2.5,
    title: 'Workplace Reality',
    badge: 'National Statistics',
    headline: '70% of Workplace Harassment Goes Unreported',
    subheadline: 'Fear of single retaliation keeps survivors isolated.',
    body: 'Power dynamics and fear of speaking first keep many incidents buried and survivors silenced.',
    graphicType: 'problem'
  },
  {
    startTime: 2.5,
    endTime: 5.5,
    title: 'The Safe Sanctuary',
    badge: 'Aawaz Architecture',
    headline: 'Aawaz: Speak Without Danger',
    subheadline: 'A safe place where you can speak without fear of retaliation.',
    body: 'Record your experience confidentially into your private client-side vault.',
    graphicType: 'logo'
  },
  {
    startTime: 5.5,
    endTime: 8.0,
    title: 'Legal & Digital Protection',
    badge: 'Verified & Shielded',
    headline: 'Your Voice is Verified and Legally Protected',
    subheadline: 'Secured under Indian Evidence Act Section 65B & Zero-Knowledge Vaults.',
    body: 'Cryptographically timestamped and fingerprint-sealed evidence that holds up in committee hearings.',
    graphicType: 'crypto'
  },
  {
    startTime: 8.0,
    endTime: 12.0,
    title: 'Statutory Redressal',
    badge: 'POSH Act 2013',
    headline: 'Enforcing the POSH Act 2013',
    subheadline: 'Connecting repeat patterns and demanding organizational accountability.',
    body: 'Facilitating collective courage to escalate joint complaints to the Internal Committee.',
    graphicType: 'posh'
  }
];

export const AuthorityVideoModal: React.FC<AuthorityVideoModalProps> = ({ isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(11);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
      setCurrentTime(0);
      return;
    }

    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, [isOpen]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleRestart = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
    audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
  };

  if (!isOpen) return null;

  const currentSegment = SEGMENTS.find(s => currentTime >= s.startTime && currentTime < s.endTime) || SEGMENTS[SEGMENTS.length - 1];
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <audio 
        ref={audioRef}
        src="/aawaz_presentation.mp3"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        preload="auto"
      />

      <div className="bg-stone-950 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-stone-800 flex flex-col">
        {/* Top Header */}
        <div className="px-5 py-3.5 bg-stone-900/90 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="font-serif font-semibold text-white text-sm">
              Aawaz — Official Audio-Visual Presentation
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Screen / Canvas */}
        <div className="relative w-full aspect-video bg-gradient-to-b from-stone-950 via-[#180b0f] to-stone-950 flex flex-col justify-between p-6 sm:p-10 overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-rose-900/20 blur-3xl pointer-events-none animate-pulse-gentle" />

          {/* Top segment badge */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-[10px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800">
              {currentSegment.badge}
            </span>
            <span className="text-[11px] font-mono text-stone-400 bg-stone-900/80 px-2.5 py-0.5 rounded-full border border-stone-800">
              0:0{Math.floor(currentTime)} / 0:{Math.floor(duration) < 10 ? `0${Math.floor(duration)}` : Math.floor(duration)}
            </span>
          </div>

          {/* Center Visuals & Text */}
          <div className="relative z-10 my-auto py-2 text-center max-w-2xl mx-auto space-y-4">
            <div className="flex justify-center items-center py-1">
              {currentSegment.graphicType === 'problem' && (
                <div className="w-16 h-16 rounded-2xl bg-rose-950/80 border border-rose-800 flex items-center justify-center text-rose-400 shadow-lg shadow-rose-950/60 animate-in zoom-in-95 duration-300">
                  <Users2 className="w-8 h-8" />
                </div>
              )}
              {currentSegment.graphicType === 'logo' && (
                <div className="animate-in zoom-in-95 duration-300">
                  <AawazLogo size="lg" withEcho={true} />
                </div>
              )}
              {currentSegment.graphicType === 'crypto' && (
                <div className="w-16 h-16 rounded-2xl bg-amber-950/80 border border-amber-800 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-950/60 animate-in zoom-in-95 duration-300">
                  <Lock className="w-8 h-8" />
                </div>
              )}
              {currentSegment.graphicType === 'posh' && (
                <div className="w-16 h-16 rounded-2xl bg-indigo-950/80 border border-indigo-800 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-950/60 animate-in zoom-in-95 duration-300">
                  <Scale className="w-8 h-8" />
                </div>
              )}
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
              {currentSegment.headline}
            </h2>

            <p className="text-xs sm:text-sm text-rose-300 font-medium">
              {currentSegment.subheadline}
            </p>

            <p className="text-xs text-stone-300 max-w-xl mx-auto leading-relaxed">
              {currentSegment.body}
            </p>
          </div>

          {/* Subtitle Line Bar */}
          <div className="relative z-10 bg-black/60 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2 text-center text-xs text-white/90">
            {currentTime < 2.5 && "70% of workplace harassment reported. Fear of single retaliatory action keeps survivors isolated."}
            {currentTime >= 2.5 && currentTime < 5.5 && "Aawaz safe is a place where you can speak without danger."}
            {currentTime >= 5.5 && currentTime < 8.0 && "Your voice is verified and legally protected."}
            {currentTime >= 8.0 && "We enforce the POSH Act 2013."}
          </div>
        </div>

        {/* Controls & Scrubber */}
        <div className="p-4 bg-stone-900 border-t border-stone-800 space-y-3">
          {/* Progress bar */}
          <div className="w-full bg-stone-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-rose-500 h-full rounded-full transition-all duration-100 ease-linear"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={togglePlay}
                className="w-9 h-9 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow transition-all active:scale-95"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
              </button>

              <button
                onClick={handleRestart}
                className="p-2 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
                title="Restart"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={toggleMute}
                className="p-2 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <span className="text-xs font-mono text-stone-400">
                0:0{Math.floor(currentTime)} / 0:{Math.floor(duration) < 10 ? `0${Math.floor(duration)}` : Math.floor(duration)}
              </span>
            </div>

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
