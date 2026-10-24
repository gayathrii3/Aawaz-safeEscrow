import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../utils/translations';
import { AuthorityVideoModal } from './AuthorityVideoModal';
import { Scale, Clock, ShieldCheck, HeartHandshake, PhoneCall, FileText, AlertCircle, HelpCircle, Play } from 'lucide-react';

export const RightsExplainer: React.FC = () => {
  const { language } = useApp();
  const t = translations[language];
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center">
        <span className="text-xs uppercase tracking-widest font-semibold text-rose-800 bg-rose-100/70 px-3 py-1 rounded-full border border-rose-200/50">
          Statutory Protections
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-slate-800 mt-3">
          {t.rightsTitle}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl mx-auto leading-relaxed">
          {t.rightsSubtitle}
        </p>
      </div>

      {/* Warm Explainer Notice */}
      <div className="p-5 rounded-3xl bg-rose-50/80 border border-rose-200/60 flex items-start space-x-3.5 text-xs text-rose-900 leading-relaxed shadow-sm">
        <HelpCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold">Gentle Disclaimer:</strong> Aawaz provides gentle report organizing, secure private matching, and informational guidance. This information does not constitute formal legal counsel. We encourage speaking with an NGO caseworker or POSH advocate when considering formal filing.
        </div>
      </div>

      {/* Authority & Legal Film Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-stone-950 via-rose-950 to-stone-900 text-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md border border-stone-800">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center space-x-2 text-rose-300 text-xs font-semibold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span>Legal Authority & Statutory Governance Film</span>
          </div>
          <h3 className="font-serif text-lg font-semibold text-white">
            Watch: How Aawaz Binds to India's POSH Act (2013)
          </h3>
          <p className="text-xs text-stone-300 max-w-xl leading-relaxed">
            A 90-second audiovisual breakdown of zero-knowledge matching, Section 65B evidence integrity, and Internal Committee powers.
          </p>
        </div>
        <button
          onClick={() => setShowVideo(true)}
          className="flex items-center space-x-2 px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md active:scale-95 transition-all shrink-0"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>Play Official Video</span>
        </button>
      </div>

      {/* Core Legal Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Card 1: What is the IC? */}
        <div className="glass-card rounded-3xl p-6 shadow-soft space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-base font-semibold text-slate-800">
            What is an Internal Committee (IC / ICC)?
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            By law, every workplace with 10 or more employees must maintain an Internal Committee headed by a senior woman presiding officer, with over 50% women members and at least one independent external member (from an NGO or legal background) to prevent internal bias.
          </p>
        </div>

        {/* Card 2: Time Limits & Extensions */}
        <div className="glass-card rounded-3xl p-6 shadow-soft space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-base font-semibold text-slate-800">
            Filing Time Limits (Section 9)
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            A complaint should generally be submitted within <strong>3 months</strong> of the incident (or the last incident in a series). However, the IC holds the statutory power to grant an extension of another 3 months if circumstances prevented earlier filing.
          </p>
        </div>

        {/* Card 3: Interim Relief & Safety */}
        <div className="glass-card rounded-3xl p-6 shadow-soft space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-base font-semibold text-slate-800">
            Immediate Interim Relief (Section 12)
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            While an inquiry is underway, you have the right to request interim protection: transfer of yourself or the respondent to another department, up to 3 months of paid leave (not deducted from normal leave balance), or restraint on performance appraisals.
          </p>
        </div>

        {/* Card 4: Strict Confidentiality */}
        <div className="glass-card rounded-3xl p-6 shadow-soft space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-base font-semibold text-slate-800">
            Statutory Confidentiality (Section 16)
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Workplaces are legally prohibited from publishing or leaking complainant identities, respondent names, witness testimony, or committee recommendations. Violating this attracts strict statutory penalties for the employer.
          </p>
        </div>

      </div>

      {/* Emergency & Helpline Directory */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-soft space-y-4">
        <div className="flex items-center space-x-2">
          <PhoneCall className="w-5 h-5 text-rose-600" />
          <h3 className="font-serif text-base font-semibold text-slate-800">
            Support Helplines & Direct Resources (India)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-white border border-rose-100 text-xs space-y-1">
            <p className="font-semibold text-slate-800">National Women Helpline</p>
            <p className="text-rose-600 font-mono font-bold text-base">1091 / 181</p>
            <p className="text-[11px] text-slate-500">24x7 Emergency & Guidance</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-rose-100 text-xs space-y-1">
            <p className="font-semibold text-slate-800">NCW Harassment Cell</p>
            <p className="text-rose-600 font-mono font-bold text-base">7827170170</p>
            <p className="text-[11px] text-slate-500">National Commission for Women</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-rose-100 text-xs space-y-1">
            <p className="font-semibold text-slate-800">Cyber Crime Portal</p>
            <p className="text-rose-600 font-mono font-bold text-base">1930</p>
            <p className="text-[11px] text-slate-500">Online Harassment & Blackmail</p>
          </div>
        </div>
      </div>

      {/* Trust, Safety, & Ethics Q&A */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-soft space-y-4">
        <h3 className="font-serif text-lg font-semibold text-slate-800">
          Frequently Asked Questions & Trust Architecture
        </h3>

        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-white border border-rose-100 space-y-1">
            <h4 className="text-xs font-semibold text-slate-800">What stops someone from filing fake reports to target an innocent person?</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              A match requires independent accounts from distinct individuals. Escalation passes through a trained human reviewer, account actions are rate limited, and nothing is ever published openly. A match is a signal for review, never an automated verdict.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-rose-100 space-y-1">
            <h4 className="text-xs font-semibold text-slate-800">What if two different people share the same name?</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              The private match code checks both the person's name and organisation. Reviewers verify extra workplace details, and survivors are clearly told that a match could be a coincidental namesake until verified.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-rose-100 space-y-1">
            <h4 className="text-xs font-semibold text-slate-800">Can the platform operator or database admin read my report?</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              No. Reports and proofs are locked directly on your device before saving. The server only sees scrambled text and private codes—nobody can view your raw notes or files.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-rose-100 space-y-1">
            <h4 className="text-xs font-semibold text-slate-800">How do you protect survivors from an abusive partner or boss checking their phone?</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              The application features a disguise mode masquerading as "Notes" (a student study notes & to-do page) with a PIN lock, an instant Quick Exit escape button, neutral system notifications, and a one-tap clear local vault option.
            </p>
          </div>
        </div>
      </div>

      {/* Authority Video Modal */}
      <AuthorityVideoModal 
        isOpen={showVideo} 
        onClose={() => setShowVideo(false)} 
      />

    </div>
  );
};
