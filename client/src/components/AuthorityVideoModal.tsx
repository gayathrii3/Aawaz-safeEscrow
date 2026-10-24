import React, { useState, useEffect, useRef } from 'react';
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
  FileCheck2, 
  Users2, 
  Sparkles, 
  CheckCircle2, 
  Building2, 
  Award, 
  ChevronRight
} from 'lucide-react';
import { AawazLogo } from './AawazLogo';

interface AuthorityVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Scene {
  id: number;
  timeRange: string;
  chapterTitle: string;
  badge: string;
  badgeColor: string;
  headline: string;
  subheadline: string;
  body: string;
  legalTags: string[];
  graphicType: 'problem' | 'logo' | 'crypto' | 'posh' | 'seal';
}

const SCENES: Scene[] = [
  {
    id: 1,
    timeRange: '0:00 - 0:18',
    chapterTitle: 'The Unseen Barrier',
    badge: 'National Workforce Reality',
    badgeColor: 'bg-rose-950/70 text-rose-300 border-rose-800',
    headline: '70% of Workplace Harassment Goes Unreported',
    subheadline: 'Fear of single-handed retaliation keeps survivors isolated.',
    body: 'Under India\'s corporate and campus ecosystems, junior employees, interns, and contractors fear isolation if they are the only ones to file. Without corroboration, single complaints often result in gaslighting, professional marginalization, or quiet attrition.',
    legalTags: ['Workplace Vulnerability', 'Asymmetric Power Dynamics', 'Retaliation Fear'],
    graphicType: 'problem'
  },
  {
    id: 2,
    timeRange: '0:18 - 0:38',
    chapterTitle: 'Introducing Aawaz',
    badge: 'Aawaz Architecture',
    badgeColor: 'bg-rose-900/70 text-rose-200 border-rose-700',
    headline: 'Aawaz: Safe Reporting & Evidence Vault',
    subheadline: 'Speak without the danger of going first.',
    body: 'Aawaz transforms the reporting dynamic through cryptographic pattern matching. A survivor safely records incident details into a private vault locked with her own keys. Only when another independent report names the same individual does Aawaz alert both that a pattern exists.',
    legalTags: ['Mutual Corroboration', 'Privacy Vault', 'Survivor Agency'],
    graphicType: 'logo'
  },
  {
    id: 3,
    timeRange: '0:38 - 0:58',
    chapterTitle: 'Cryptographic Integrity',
    badge: 'Section 65B Digital Evidence',
    badgeColor: 'bg-amber-950/70 text-amber-300 border-amber-800',
    headline: 'Zero-Knowledge Cryptography & Tamper Hashes',
    subheadline: 'Plaintext names are never stored. Evidence is sealed with SHA-256.',
    body: 'Names and organizations are hashed via Keyed HMAC-SHA256 with phonetic metaphone normalization (VRN_SHRM). Uploaded screenshots and audio receive immutable SHA-256 fingerprints, preserving forensic chain of custody under Section 65B of the Indian Evidence Act.',
    legalTags: ['AES-256-GCM Local Key', 'HMAC Pattern Vault', 'Section 65B Evidence Act'],
    graphicType: 'crypto'
  },
  {
    id: 4,
    timeRange: '0:58 - 1:18',
    chapterTitle: 'POSH Act 2013 Governance',
    badge: 'Statutory Legal Authority',
    badgeColor: 'bg-indigo-950/70 text-indigo-300 border-indigo-800',
    headline: 'Enforcing the POSH Act (2013)',
    subheadline: 'Direct alignment with Internal Committees and statutory rights.',
    body: 'Every workplace with 10+ employees must maintain an Internal Committee presided over by a senior woman advocate with 50%+ women members. Section 9 ensures 3-month filing with extensions, Section 12 provides immediate interim relief, and Section 16 mandates strict confidentiality with penal sanctions.',
    legalTags: ['POSH Act Section 9 (Timeline)', 'Section 12 (Interim Relief)', 'Section 16 (Strict Privacy)'],
    graphicType: 'posh'
  },
  {
    id: 5,
    timeRange: '1:18 - 1:35',
    chapterTitle: 'Authenticated Redress',
    badge: 'DPDPA 2023 & Institutional Seal',
    badgeColor: 'bg-emerald-950/70 text-emerald-300 border-emerald-800',
    headline: 'From Isolated Notes to Certified Redress',
    subheadline: 'Your voice, verified and legally protected.',
    body: 'When both survivors consent on the graduated ladder, Aawaz compiles a verified, timestamped POSH Complaint Document for the Internal Committee. No more isolated whisper networks—now backed by certified pattern evidence and statutory legal power.',
    legalTags: ['DPDPA 2023 Compliant', 'Certified Complaint PDF', 'Adv. Shalini IC Oversight'],
    graphicType: 'seal'
  }
];

export const AuthorityVideoModal: React.FC<AuthorityVideoModalProps> = ({ isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [isMuted, setIsMuted] = useState(false);
  const [showCaptions, setShowCaptions] = useState(true);

  // Audio Context Ref for soothing ambient synth tones
  const audioCtxRef = useRef<AudioContext | null>(null);

  const TOTAL_DURATION_SEC = 95; // 1 min 35 sec
  const sceneDurations = [18, 20, 20, 20, 17]; // sum = 95 seconds

  // Handle play/pause & auto-advance timer
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + (100 / (TOTAL_DURATION_SEC * 10));
        if (next >= 100) {
          setIsPlaying(false);
          return 100;
        }

        // Determine scene based on elapsed seconds
        const currentElapsedSec = (next / 100) * TOTAL_DURATION_SEC;
        let cumulative = 0;
        for (let i = 0; i < sceneDurations.length; i++) {
          cumulative += sceneDurations[i];
          if (currentElapsedSec <= cumulative) {
            setCurrentSceneIndex(i);
            break;
          }
        }

        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying]);

  // Ambient sound tone generator on scene change
  useEffect(() => {
    if (!isOpen || isMuted) return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Gentle soft warm chime on scene change
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const frequencies = [261.63, 329.63, 392.00, 440.00, 523.25]; // C, E, G, A, C
      osc.frequency.setValueAtTime(frequencies[currentSceneIndex] || 329.63, ctx.currentTime);
      osc.type = 'sine';

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.3);
    } catch {
      // Audio autoplay gracefully handled if disabled
    }
  }, [currentSceneIndex, isOpen, isMuted]);

  if (!isOpen) return null;

  const currentScene = SCENES[currentSceneIndex];
  const elapsedSeconds = Math.floor((progress / 100) * TOTAL_DURATION_SEC);
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const jumpToScene = (index: number) => {
    let startSec = 0;
    for (let i = 0; i < index; i++) startSec += sceneDurations[i];
    const newProgress = (startSec / TOTAL_DURATION_SEC) * 100;
    setProgress(newProgress);
    setCurrentSceneIndex(index);
    setIsPlaying(true);
  };

  const restartVideo = () => {
    setProgress(0);
    setCurrentSceneIndex(0);
    setIsPlaying(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-300 select-none">
      <div className="relative w-full max-w-5xl bg-stone-950 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col text-stone-100 max-h-[92vh]">
        
        {/* Top Video Header Bar */}
        <div className="px-5 py-3.5 bg-stone-900/90 border-b border-stone-800 flex items-center justify-between z-20">
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
            <div className="flex items-center space-x-2">
              <span className="font-serif font-semibold text-sm sm:text-base text-stone-100">
                Aawaz Official Video Presentation
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800 hidden sm:inline">
                Legal Authority & Redress Architecture
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-rose-400" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors"
              title="Close Video"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Canvas / Screen (16:9 ratio container) */}
        <div className="relative w-full aspect-video bg-gradient-to-b from-stone-950 via-[#140b0e] to-stone-950 flex flex-col justify-between p-6 sm:p-10 overflow-hidden">
          
          {/* Subtle animated background radial echoes */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-rose-950/20 blur-3xl pointer-events-none animate-pulse-gentle"></div>

          {/* Scene Header Badge & Timecode */}
          <div className="relative z-10 flex items-center justify-between">
            <span className={`text-[11px] font-semibold tracking-wide uppercase px-3 py-1 rounded-full border ${currentScene.badgeColor}`}>
              {currentScene.badge}
            </span>
            <span className="text-xs font-mono text-stone-400 tracking-wider bg-stone-900/80 px-3 py-1 rounded-full border border-stone-800">
              Chapter {currentScene.id} of {SCENES.length} • {formattedTime} / 1:35
            </span>
          </div>

          {/* Central Cinematic Graphic & Visual Anchor */}
          <div className="relative z-10 my-auto py-2 text-center max-w-3xl mx-auto space-y-4">
            
            {/* Visual Graphic Representation */}
            <div className="flex justify-center items-center py-2">
              {currentScene.graphicType === 'problem' && (
                <div className="w-20 h-20 rounded-3xl bg-rose-950/80 border border-rose-800 flex items-center justify-center text-rose-400 shadow-lg shadow-rose-950/60 animate-in zoom-in-95 duration-500">
                  <Users2 className="w-10 h-10" />
                </div>
              )}

              {currentScene.graphicType === 'logo' && (
                <div className="animate-in zoom-in-95 duration-500">
                  <AawazLogo size="xl" withEcho={true} />
                </div>
              )}

              {currentScene.graphicType === 'crypto' && (
                <div className="w-20 h-20 rounded-3xl bg-amber-950/80 border border-amber-800 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-950/60 animate-in zoom-in-95 duration-500">
                  <Lock className="w-10 h-10" />
                </div>
              )}

              {currentScene.graphicType === 'posh' && (
                <div className="w-20 h-20 rounded-3xl bg-indigo-950/80 border border-indigo-800 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-950/60 animate-in zoom-in-95 duration-500">
                  <Scale className="w-10 h-10" />
                </div>
              )}

              {currentScene.graphicType === 'seal' && (
                <div className="w-20 h-20 rounded-3xl bg-emerald-950/80 border border-emerald-800 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-950/60 animate-in zoom-in-95 duration-500">
                  <Award className="w-10 h-10" />
                </div>
              )}
            </div>

            {/* Headline with Fade-in Effect */}
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
              {currentScene.headline}
            </h2>

            {/* Subheadline */}
            <p className="text-xs sm:text-sm text-rose-300 font-medium tracking-wide">
              {currentScene.subheadline}
            </p>

            {/* Narrative Body */}
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl mx-auto px-2">
              {currentScene.body}
            </p>

            {/* Legal Tag Pills */}
            <div className="pt-2 flex flex-wrap justify-center gap-2">
              {currentScene.legalTags.map((tag, i) => (
                <span key={i} className="text-[10px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-stone-900 border border-stone-800 text-stone-300 flex items-center space-x-1">
                  <CheckCircle2 className="w-2.5 h-2.5 text-rose-400" />
                  <span>{tag}</span>
                </span>
              ))}
            </div>

          </div>

          {/* Captions Overlay Bar */}
          {showCaptions && (
            <div className="relative z-10 mx-auto max-w-xl text-center py-1.5 px-4 rounded-xl bg-black/60 backdrop-blur border border-white/10 text-[11px] text-stone-200">
              <span className="text-rose-400 font-semibold">[Narration]: </span>
              <span>{currentScene.body.slice(0, 110)}...</span>
            </div>
          )}

        </div>

        {/* Video Scrubber & Playback Controls */}
        <div className="px-5 py-4 bg-stone-900 border-t border-stone-800 space-y-3">
          
          {/* Progress Bar (Clickable Scrubber) */}
          <div 
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const newProgress = Math.min(100, Math.max(0, (clickX / rect.width) * 100));
              setProgress(newProgress);
              const currentElapsedSec = (newProgress / 100) * TOTAL_DURATION_SEC;
              let cumulative = 0;
              for (let i = 0; i < sceneDurations.length; i++) {
                cumulative += sceneDurations[i];
                if (currentElapsedSec <= cumulative) {
                  setCurrentSceneIndex(i);
                  break;
                }
              }
            }}
            className="w-full h-2 bg-stone-800 rounded-full cursor-pointer relative overflow-hidden group"
          >
            <div 
              className="h-full bg-gradient-to-r from-rose-600 via-rose-500 to-blush-400 rounded-full transition-all duration-100" 
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Control Buttons Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-9 h-9 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-md active:scale-95 transition-all"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <button
                onClick={restartVideo}
                className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
                title="Replay from start"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <span className="font-mono text-stone-400 text-xs pl-1">
                {formattedTime} <span className="text-stone-600">/ 1:35</span>
              </span>
            </div>

            {/* Chapter Selection Pills */}
            <div className="hidden md:flex items-center space-x-1.5 overflow-x-auto">
              {SCENES.map((scene, idx) => (
                <button
                  key={scene.id}
                  onClick={() => jumpToScene(idx)}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                    currentSceneIndex === idx
                      ? 'bg-rose-600 text-white font-semibold'
                      : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {scene.id}. {scene.chapterTitle}
                </button>
              ))}
            </div>

            {/* Captions Toggle & Next Button */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowCaptions(!showCaptions)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-mono transition-colors ${
                  showCaptions ? 'bg-stone-800 text-rose-400 font-bold' : 'text-stone-500 hover:text-stone-300'
                }`}
              >
                CC {showCaptions ? 'ON' : 'OFF'}
              </button>

              {currentSceneIndex < SCENES.length - 1 ? (
                <button
                  onClick={() => jumpToScene(currentSceneIndex + 1)}
                  className="flex items-center space-x-1 px-3 py-1 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs transition-colors"
                >
                  <span>Next Scene</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="px-4 py-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  Close & Explore App
                </button>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
