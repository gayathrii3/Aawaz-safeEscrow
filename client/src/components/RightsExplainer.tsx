import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../utils/translations';
import { AuthorityVideoModal } from './AuthorityVideoModal';
import { Scale, Clock, ShieldCheck, HeartHandshake, PhoneCall, HelpCircle, CheckCircle2, AlertTriangle, FileText, ArrowRight, ChevronDown, Play } from 'lucide-react';

export const RightsExplainer: React.FC = () => {
  const { language } = useApp();
  const t = translations[language];
  const [isOpen, setIsOpen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const poshSteps = [
    {
      step: '01',
      title: 'Write down what happened',
      desc: 'Note the date, place, what was said or done, and any witnesses. You do not need to be certain — write what you remember.',
    },
    {
      step: '02',
      title: 'File a written complaint with the IC',
      desc: 'Submit a signed written complaint to your Internal Committee within 3 months of the incident. The IC must acknowledge receipt in writing.',
    },
    {
      step: '03',
      title: 'Request interim protection if needed',
      desc: 'You can ask the IC to transfer the respondent, grant you paid leave, or stop them from reviewing your work while the inquiry runs.',
    },
    {
      step: '04',
      title: 'IC conducts a confidential inquiry',
      desc: 'The IC must complete its inquiry within 60 days. Both sides are heard. No identity is published. Proceedings are strictly confidential under Section 16.',
    },
    {
      step: '05',
      title: 'IC submits findings to the employer',
      desc: 'Within 10 days of completing the inquiry, the IC submits its report. The employer must act on it within 60 days.',
    },
    {
      step: '06',
      title: 'You can appeal if unsatisfied',
      desc: 'If you disagree with the outcome, you can appeal to the appropriate court or tribunal within 90 days of receiving the IC decision.',
    },
  ];

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

      {/* Disclaimer */}
      <div className="p-5 rounded-3xl bg-rose-50/80 border border-rose-200/60 flex items-start space-x-3.5 text-xs text-rose-900 leading-relaxed shadow-sm">
        <HelpCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold">Gentle Disclaimer:</strong> Aawaz provides report organising, secure private matching, and informational guidance. This does not constitute formal legal counsel. We encourage speaking with an NGO caseworker or POSH advocate when considering formal filing.
        </div>
      </div>

      {/* POSH Act Steps Card — maroon dark design (accordion / dropdown) */}
      <div className="rounded-3xl shadow-md bg-gradient-to-r from-stone-950 via-rose-950 to-stone-900 border border-stone-800 overflow-hidden transition-all duration-300">
        <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex-1 flex items-start space-x-3.5 text-left focus:outline-none group"
            aria-expanded={isOpen}
          >
            <div className="w-10 h-10 rounded-2xl bg-rose-800/60 text-rose-300 flex items-center justify-center shrink-0 border border-rose-700/40 mt-0.5 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-serif text-base font-semibold text-white group-hover:text-rose-200 transition-colors">
                  How to File a Complaint — Step by Step
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  6 Steps
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-1">
                Under the Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013
              </p>
            </div>
          </button>

          {/* Action buttons: Play Video & Expand dropdown */}
          <div className="flex items-center space-x-2.5 self-end sm:self-auto">
            <button
              onClick={() => setShowVideo(true)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md active:scale-95 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Play Video</span>
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              title={isOpen ? "Collapse steps" : "Expand steps"}
              className={`p-2 rounded-xl bg-white/5 border border-white/10 text-stone-300 hover:text-white transition-all ${isOpen ? 'rotate-180 bg-white/10 text-white' : ''}`}
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="px-6 pb-6 sm:px-8 sm:pb-8 pt-0 space-y-4 border-t border-white/5 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="space-y-2 pt-4">
              {poshSteps.map((s) => (
                <div key={s.step} className="flex items-start space-x-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <span className="font-mono text-xs font-bold text-rose-400 w-5 shrink-0 mt-0.5">{s.step}</span>
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-stone-100">{s.title}</p>
                    <p className="text-xs text-stone-400 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-2 p-3 rounded-xl bg-emerald-900/40 border border-emerald-700/40 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Aawaz helps you with Steps 1 and 2 — organising your account and building a joint complaint when a pattern match is found.</span>
            </div>
          </div>
        )}
      </div>

      {/* Core Legal Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <div className="glass-card rounded-3xl p-6 shadow-soft space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-base font-semibold text-slate-800">
            What is an Internal Committee (IC)?
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            By law, every workplace with 10 or more employees must maintain an Internal Committee headed by a senior woman presiding officer, with over 50% women members and at least one independent external member from an NGO or legal background to prevent internal bias.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-6 shadow-soft space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-base font-semibold text-slate-800">
            Filing Time Limits (Section 9)
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            A complaint should generally be submitted within <strong>3 months</strong> of the incident or the last incident in a series. The IC holds the statutory power to grant an extension of another 3 months if circumstances prevented earlier filing.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-6 shadow-soft space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-base font-semibold text-slate-800">
            Immediate Interim Relief (Section 12)
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            While an inquiry is underway, you have the right to request interim protection: transfer of yourself or the respondent, up to 3 months of paid leave not deducted from your normal balance, or restraint on performance appraisals.
          </p>
        </div>

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

      {/* Helplines */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-soft space-y-4">
        <div className="flex items-center space-x-2">
          <PhoneCall className="w-5 h-5 text-rose-600" />
          <h3 className="font-serif text-base font-semibold text-slate-800">
            Support Helplines and Direct Resources (India)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-white border border-rose-100 text-xs space-y-1">
            <p className="font-semibold text-slate-800">National Women Helpline</p>
            <p className="text-rose-600 font-mono font-bold text-base">1091 / 181</p>
            <p className="text-[11px] text-slate-500">24x7 Emergency and Guidance</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-rose-100 text-xs space-y-1">
            <p className="font-semibold text-slate-800">NCW Harassment Cell</p>
            <p className="text-rose-600 font-mono font-bold text-base">7827170170</p>
            <p className="text-[11px] text-slate-500">National Commission for Women</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-rose-100 text-xs space-y-1">
            <p className="font-semibold text-slate-800">Cyber Crime Portal</p>
            <p className="text-rose-600 font-mono font-bold text-base">1930</p>
            <p className="text-[11px] text-slate-500">Online Harassment and Blackmail</p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-soft space-y-4">
        <h3 className="font-serif text-lg font-semibold text-slate-800">
          Frequently Asked Questions
        </h3>
        <div className="space-y-3">
          {[
            {
              q: 'What stops someone from filing fake reports to target an innocent person?',
              a: 'A match requires independent accounts from distinct individuals. Escalation passes through a trained human reviewer. Nothing is ever published openly — a match is a signal for review, never an automated verdict.',
            },
            {
              q: 'What if two different people share the same name?',
              a: 'The private match checks both the person\'s name and organisation. Reviewers verify extra workplace details, and users are clearly told that a match could be a coincidental namesake until verified.',
            },
            {
              q: 'Can the platform operator or database admin read my report?',
              a: 'No. Reports are locked directly on your device before saving. The server only sees scrambled text and private codes — nobody can view your raw notes or files.',
            },
            {
              q: 'How do you protect survivors from a partner or boss checking their phone?',
              a: 'The app features a disguise mode that looks like a student notes app, a PIN lock, an instant Quick Exit button, and a one-tap option to clear all local data.',
            },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white border border-rose-100 space-y-1">
              <h4 className="text-xs font-semibold text-slate-800">{item.q}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Authority Video Presentation Modal */}
      <AuthorityVideoModal
        isOpen={showVideo}
        onClose={() => setShowVideo(false)}
      />

    </div>
  );
};
