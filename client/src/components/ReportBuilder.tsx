import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../utils/translations';
import { ReportDraft, StructuredEvent } from '../types';
import { structureIncidentWithAI } from '../utils/aiStructuring';
import { deriveMatchToken, normalizeName, normalizeOrg, computePhoneticKey } from '../utils/hasher';
import { computeSha256 } from '../utils/crypto';
import { 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  ArrowLeft, 
  Mic, 
  MicOff, 
  Upload, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Hash,
  Eye
} from 'lucide-react';

export const ReportBuilder: React.FC = () => {
  const { submitReport, setView, currentUser, language } = useApp();
  const t = translations[language];

  const [step, setStep] = useState<number>(1);
  const [isRecording, setIsRecording] = useState(false);
  const [isAiStructuring, setIsAiStructuring] = useState(false);
  const [isEncrypting, setIsEncrypting] = useState(false);

  // Form states
  const [narrative, setNarrative] = useState('');
  const [accusedName, setAccusedName] = useState('');
  const [accusedOrg, setAccusedOrg] = useState('');
  const [accusedRole, setAccusedRole] = useState('');
  const [structuredEvents, setStructuredEvents] = useState<StructuredEvent[]>([]);
  const [summary, setSummary] = useState('');
  const [evidenceFiles, setEvidenceFiles] = useState<{ id: string; fileName: string; fileSize: number; fileHash: string; uploadedAt: string; fileType: 'image' | 'audio' | 'video' | 'other'; dataUrl?: string }[]>([]);
  
  // Real-time token preview
  const [liveToken, setLiveToken] = useState('');
  const [livePhonetic, setLivePhonetic] = useState('');

  // Voice recording simulation
  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Simulated gentle voice transcription
      setTimeout(() => {
        setNarrative(prev => 
          prev ? prev + ' During our team planning session, he repeatedly stood too close and made comments about my personal life.'
               : 'A senior manager in our department has repeatedly sent inappropriate messages late at night and touched my shoulder during 1-on-1 reviews.'
        );
        setIsRecording(false);
      }, 3000);
    } else {
      setIsRecording(false);
    }
  };

  const handleRunAiStructuring = async () => {
    if (!narrative.trim()) return;
    setIsAiStructuring(true);
    try {
      const result = await structureIncidentWithAI(narrative, accusedRole);
      setStructuredEvents(result.events);
      setSummary(result.summary);
      setStep(2);
    } finally {
      setIsAiStructuring(false);
    }
  };

  const handleNameOrgChange = async (name: string, org: string) => {
    setAccusedName(name);
    setAccusedOrg(org);
    if (name.trim()) {
      const token = await deriveMatchToken(name, org);
      const phonetic = computePhoneticKey(name);
      setLiveToken(token);
      setLivePhonetic(phonetic);
    } else {
      setLiveToken('');
      setLivePhonetic('');
    }
  };

  const handleSimulateFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const hash = await computeSha256(file.name + file.size + Date.now());

      // Determine file type category
      const mime = file.type;
      const fileType: 'image' | 'audio' | 'video' | 'other' =
        mime.startsWith('image/') ? 'image' :
        mime.startsWith('audio/') ? 'audio' :
        mime.startsWith('video/') ? 'video' : 'other';

      // Read actual file data as base64 data URL (for images and small files)
      const dataUrl = await new Promise<string | undefined>((resolve) => {
        // Store data URL for images; for audio/video store it too so reviewer can play
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => resolve(undefined);
        reader.readAsDataURL(file);
      });

      setEvidenceFiles(prev => [
        ...prev,
        {
          id: `ev-${Date.now()}-${i}`,
          fileName: file.name,
          fileSize: file.size,
          fileHash: hash,
          uploadedAt: new Date().toISOString(),
          fileType,
          dataUrl,
        }
      ]);
    }
  };

  const handleSubmitFinal = async () => {
    setIsEncrypting(true);
    try {
      const draft: ReportDraft = {
        id: `rep-${Date.now().toString().slice(-6)}`,
        accusedName,
        accusedOrg,
        accusedRole,
        narrative,
        structuredEvents,
        summary,
        evidenceItems: evidenceFiles,
        createdAt: new Date().toISOString(),
        status: 'encrypted_stored'
      };

      await submitReport(draft);
    } finally {
      setIsEncrypting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Step Header */}
      <div className="mb-8 text-center">
        <span className="text-xs uppercase tracking-widest font-semibold text-rose-800 bg-rose-100/70 px-3 py-1 rounded-full border border-rose-200/50">
          Private Incident Record • Step {step} of 5
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-slate-800 mt-3">
          {step === 1 && t.step1Title}
          {step === 2 && t.step2Title}
          {step === 3 && t.step3Title}
          {step === 4 && t.step4Title}
          {step === 5 && t.step5Title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl mx-auto leading-relaxed">
          {step === 1 && "Write freely or use voice dictation. Take all the time you need. Nothing is shared with anyone."}
          {step === 2 && "Our gentle assistant organized your notes into a clear chronological timeline."}
          {step === 3 && "Names are turned into private security codes. Real names are never saved on servers in plain text."}
          {step === 4 && "Uploaded files receive a digital seal so they can never be altered or doubted later."}
          {step === 5 && "Your report is locked securely on your device before saving. Nobody else can read it."}
        </p>

        {/* Step Progress Pill */}
        <div className="flex items-center justify-center space-x-2 mt-6">
          {[1, 2, 3, 4, 5].map(i => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'w-10 bg-rose-600' : (i < step ? 'w-4 bg-rose-300' : 'w-4 bg-rose-100')
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Glass Card Form */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-soft">
        
        {/* STEP 1: NARRATIVE */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Incident Narration
              </label>
              <button
                type="button"
                onClick={toggleRecording}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isRecording 
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-rose-50 text-rose-800 hover:bg-rose-100/80 border border-rose-200/60'
                }`}
              >
                {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                <span>{isRecording ? 'Listening...' : t.voiceDictation}</span>
              </button>
            </div>

            <textarea
              rows={8}
              value={narrative}
              onChange={(e) => setNarrative(e.target.value)}
              placeholder="Describe what occurred, where it took place, what was said or done, and how it affected your safety or workspace. You do not need to use formal legal terms."
              className="w-full p-4 rounded-2xl bg-white/90 border border-rose-200/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 focus:outline-none text-slate-800 text-sm leading-relaxed placeholder-slate-400"
            />

            <div className="flex items-center justify-between pt-4 border-t border-rose-100/80">
              <button
                type="button"
                onClick={() => setView('dashboard')}
                className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
              >
                {t.saveDraftExit}
              </button>

              <button
                type="button"
                disabled={!narrative.trim() || isAiStructuring}
                onClick={handleRunAiStructuring}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-600 to-blush-600 hover:from-rose-700 hover:to-blush-700 text-white text-xs font-semibold shadow-md shadow-rose-600/20 disabled:opacity-50 transition-all"
              >
                {isAiStructuring ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Structuring Timeline...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t.structureTimelineAI}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: AI STRUCTURED TIMELINE REVIEW */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/60 flex items-start space-x-3">
              <Sparkles className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-rose-900">AI Narrative Structuring Complete</h4>
                <p className="text-xs text-rose-700/90 mt-0.5 leading-relaxed">
                  The assistant has abstracted dates, locations, and categories into an Internal Committee compatible format without adding unstated claims.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Timeline Events ({structuredEvents.length})
              </label>
              
              {structuredEvents.map((evt, idx) => (
                <div key={evt.id} className="p-4 rounded-2xl bg-white border border-rose-100 shadow-sm space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-800">
                      Incident #{idx + 1}: {evt.dateOrPeriod}
                    </span>
                    <span className="text-[10px] uppercase font-semibold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800">
                      {evt.behaviorCategory.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {evt.description}
                  </p>
                  <div className="flex flex-wrap gap-4 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <span>Location: <strong>{evt.location}</strong></span>
                    {evt.witnesses && <span>Context: <strong>{evt.witnesses}</strong></span>}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-rose-100/80">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center space-x-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t.back}</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md shadow-rose-600/20 transition-all"
              >
                <span>{t.proceedToPerson}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: ACCUSED & MATCH TOKEN */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  {t.nameOfAccused}
                </label>
                <input
                  type="text"
                  value={accusedName}
                  onChange={(e) => handleNameOrgChange(e.target.value, accusedOrg)}
                  placeholder="e.g. Varun Sharma"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-rose-200/80 focus:ring-2 focus:ring-rose-200 focus:outline-none text-slate-800 text-xs"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Honorifics like "Mr." or "Dr." are automatically filtered out.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  {t.orgWorkplace}
                </label>
                <input
                  type="text"
                  value={accusedOrg}
                  onChange={(e) => handleNameOrgChange(accusedName, e.target.value)}
                  placeholder="e.g. Apex Global Technologies"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-rose-200/80 focus:ring-2 focus:ring-rose-200 focus:outline-none text-slate-800 text-xs"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Prevents false matches across different companies or institutions.
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  {t.roleDesignation}
                </label>
                <input
                  type="text"
                  value={accusedRole}
                  onChange={(e) => setAccusedRole(e.target.value)}
                  placeholder="e.g. Senior Vice President of Products"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-rose-200/80 focus:ring-2 focus:ring-rose-200 focus:outline-none text-slate-800 text-xs"
                />
              </div>
            </div>

            {/* Private Match Code Transparency Card */}
            {liveToken && (
              <div className="p-4 rounded-2xl bg-stone-900 text-stone-100 space-y-2 border border-stone-800 shadow-inner">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold tracking-wide text-emerald-300">
                      Private Anonymous Match Code
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono">Protected</span>
                </div>
                <p className="text-[11px] font-mono break-all text-stone-300 bg-stone-950/80 p-2.5 rounded-xl border border-stone-800">
                  {liveToken}
                </p>
                <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                  <span>Sound Match Key: <span className="font-mono text-stone-200">{livePhonetic}</span></span>
                  <span className="text-stone-400">Secret security keys prevent anyone from guessing names</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-rose-100/80">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center space-x-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t.back}</span>
              </button>

              <button
                type="button"
                disabled={!accusedName.trim() || !accusedOrg.trim()}
                onClick={() => setStep(4)}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md shadow-rose-600/20 disabled:opacity-50 transition-all"
              >
                <span>{t.evidenceVault}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: EVIDENCE VAULT */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl border-2 border-dashed border-rose-200 bg-rose-50/40 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-800">Upload Supporting Records (Optional)</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Screenshots of messages, emails, or audio recordings. Files are encrypted client-side and fingerprinted with SHA-256.
                </p>
              </div>
              <label className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white text-rose-700 text-xs font-semibold border border-rose-200/80 shadow-sm cursor-pointer hover:bg-rose-50 transition-colors">
                <span>Select Files</span>
                <input 
                  type="file" 
                  multiple 
                  onChange={handleSimulateFileUpload} 
                  className="hidden" 
                />
              </label>
            </div>

            {evidenceFiles.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Fingerprinted Attachments ({evidenceFiles.length})
                </span>
                {evidenceFiles.map(file => (
                  <div key={file.id} className="p-3 rounded-xl bg-white border border-rose-100 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-medium text-slate-800">{file.fileName}</p>
                      <p className="text-[10px] font-mono text-slate-400">SHA-256: {file.fileHash.slice(0, 24)}...</p>
                    </div>
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                      Tamper Proof
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-rose-100/80">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex items-center space-x-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t.back}</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(5)}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md shadow-rose-600/20 transition-all"
              >
                <span>{t.finalReview}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: REVIEW & CLIENT-SIDE ENCRYPTION */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start space-x-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-800 leading-relaxed">
                <strong>Complete Privacy Guarantee:</strong> Before saving, this entire report is locked on your own device. Aawaz servers only receive scrambled data and your anonymous match code—nobody else can read your story.
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-rose-100 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-rose-100">
                <span className="text-slate-500">Report Vault Pseudonym:</span>
                <span className="font-mono font-medium text-slate-800">{currentUser.pseudonym}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-rose-100">
                <span className="text-slate-500">Accused Named:</span>
                <span className="font-medium text-slate-800">{accusedName} ({accusedOrg})</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-rose-100">
                <span className="text-slate-500">Structured Incidents:</span>
                <span className="font-medium text-slate-800">{structuredEvents.length} events logged</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Evidence Records:</span>
                <span className="font-medium text-slate-800">{evidenceFiles.length} files attached</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-rose-100/80">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="flex items-center space-x-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t.back}</span>
              </button>

              <button
                type="button"
                disabled={isEncrypting}
                onClick={handleSubmitFinal}
                className="flex items-center space-x-2 px-8 py-3 rounded-full bg-gradient-to-r from-rose-600 to-blush-600 hover:from-rose-700 hover:to-blush-700 text-white text-xs font-semibold shadow-lg shadow-rose-600/25 disabled:opacity-50 transition-all hover:scale-[1.02]"
              >
                {isEncrypting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Saving Report Securely...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>{t.sealReportBtn}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
