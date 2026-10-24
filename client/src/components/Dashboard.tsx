import React, { useState } from 'react';
import { useApp, generateRandomPseudonym } from '../context/AppContext';
import { translations } from '../utils/translations';
import { 
  FileText, 
  ShieldCheck, 
  Lock, 
  Users2, 
  ArrowRight, 
  Key, 
  Scale, 
  CheckCircle2, 
  Copy, 
  Check, 
  Eye, 
  EyeOff,
  Sparkles,
  Calendar,
  Layers,
  Trash2,
  AlertTriangle,
  UserPlus,
  X
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { currentUser, allUsers, createNewUser, switchUser, reports, matches, setView, deleteReport, language } = useApp();
  const t = translations[language];
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [customPseudonym, setCustomPseudonym] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);
  const [revealKey, setRevealKey] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleCopyPhrase = () => {
    navigator.clipboard.writeText(currentUser.recoveryPhrase);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Welcome Sanctuary Card */}
      <div className="relative overflow-hidden glass-card rounded-3xl p-6 sm:p-10 shadow-soft">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-100/80 text-rose-800 text-xs font-semibold border border-rose-200/50">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
            <span>Encrypted Privacy Sanctuary</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-slate-800 tracking-tight leading-snug">
            {t.speakWithoutGoingFirst}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {t.heroSubtitle}
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setView('report_builder')}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-600 to-blush-600 hover:from-rose-700 hover:to-blush-700 text-white text-xs font-semibold shadow-md shadow-rose-600/20 transition-all hover:scale-[1.02]"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{t.recordNewIncident}</span>
            </button>

            <button
              onClick={() => setView('matches')}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-full text-xs font-semibold transition-all border ${
                matches.length > 0
                  ? 'bg-rose-100 text-rose-800 border-rose-300 shadow-sm animate-pulse-gentle'
                  : 'bg-white text-slate-700 border-rose-100 hover:bg-rose-50'
              }`}
            >
              <Users2 className="w-3.5 h-3.5 text-rose-600" />
              <span>
                {matches.length > 0 ? `${t.viewPatternMatches} (${matches.length})` : t.checkEscrowStatus}
              </span>
            </button>
          </div>
        </div>

        {/* Decorative soft glow background circle */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-gradient-to-tr from-rose-200/40 to-blush-100/30 blur-2xl pointer-events-none"></div>
      </div>

      {/* Account Security & Recovery Phrase Strip */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-rose-100/80">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <Key className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-800">{t.anonymousVaultKey}</span>
              <span className="font-mono text-xs text-rose-700 font-medium">{currentUser.pseudonym}</span>
            </div>
            <p className="text-[11px] text-slate-500">
              {t.noEmailOrPhone}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowKeyModal(true)}
            className="px-4 py-2 rounded-full text-xs font-medium text-slate-700 bg-white hover:bg-rose-50 border border-rose-200/60 shadow-sm transition-colors whitespace-nowrap"
          >
            {t.viewRecoveryPhrase}
          </button>

          <button
            onClick={() => setShowUserModal(true)}
            className="px-4 py-2 rounded-full text-xs font-semibold text-rose-800 bg-rose-100/80 hover:bg-rose-200/80 border border-rose-300 shadow-sm transition-all whitespace-nowrap flex items-center space-x-1.5 active:scale-95"
          >
            <UserPlus className="w-3.5 h-3.5 text-rose-600" />
            <span>+ New User / Switch Vault</span>
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold text-slate-800">
            {t.yourPrivateRecords}
          </h2>
          <span className="text-xs text-slate-500">
            {reports.length} {t.reportsSaved}
          </span>
        </div>

        {reports.length === 0 ? (
          <div className="glass-card rounded-3xl p-8 text-center space-y-3">
            <p className="text-xs text-slate-500">You haven't recorded any incidents yet.</p>
            <button
              onClick={() => setView('report_builder')}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 underline underline-offset-4"
            >
              {t.recordIncident}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {reports.map((rep) => (
              <div 
                key={rep.id} 
                className="glass-card glass-card-hover rounded-3xl p-6 shadow-soft space-y-4 relative flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-400 text-[11px]">Ref: {rep.id.toUpperCase()}</span>
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      <Lock className="w-2.5 h-2.5" />
                      <span>{t.zeroKnowledge}</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-base font-semibold text-slate-800">
                      {t.concerning} {rep.accusedName || 'Named Person'}
                    </h3>
                    <p className="text-xs text-slate-500">{rep.accusedOrg} • {rep.accusedRole}</p>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {rep.summary || rep.narrative}
                  </p>

                  <div className="flex flex-wrap gap-2 text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center space-x-1">
                      <Layers className="w-3 h-3 text-rose-400" />
                      <span>{rep.structuredEvents?.length || 1} Timeline Events</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-rose-400" />
                      <span>Filed: {new Date(rep.createdAt).toLocaleDateString()}</span>
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-rose-100/80 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setView('matches')}
                      className="flex items-center space-x-1 text-xs font-semibold text-rose-700 hover:text-rose-800 transition-colors"
                    >
                      <span>{t.checkCrossMatches}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(rep.id)}
                      title="Withdraw and permanently delete this report"
                      className="text-[11px] text-slate-600 hover:text-rose-700 underline underline-offset-2 flex items-center space-x-1"
                    >
                      <Trash2 className="w-3 h-3 text-slate-600 hover:text-rose-600" />
                      <span>{t.withdraw}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setView('matches')}
                    className="p-1.5 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                  >
                    <Users2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Withdraw Confirmation Dialog */}
                {confirmDeleteId === rep.id && (
                  <div className="mt-3 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs space-y-2">
                    <p className="font-semibold text-rose-900">{t.confirmDeleteTitle}</p>
                    <p className="text-[11px] text-rose-700">
                      {t.confirmDeleteDesc}
                    </p>
                    <div className="flex items-center justify-end space-x-2 pt-1">
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-3 py-1 rounded-full text-slate-600 hover:bg-white text-xs"
                      >
                        {t.cancel}
                      </button>
                      <button
                        onClick={() => {
                          deleteReport(rep.id);
                          setConfirmDeleteId(null);
                        }}
                        className="px-3 py-1 rounded-full bg-rose-600 text-white font-medium text-xs shadow-sm hover:bg-rose-700"
                      >
                        {t.confirmDelete}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recovery Phrase Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-rose-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-rose-100">
              <div className="flex items-center space-x-2">
                <Key className="w-5 h-5 text-rose-600" />
                <h3 className="font-serif text-lg font-semibold text-slate-800">
                  Your 12-Word Recovery Vault
                </h3>
              </div>
              <button 
                onClick={() => setShowKeyModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              These 12 words derive your master AES-256 decryption key. Keep them in a private place. Aawaz never transmits your recovery phrase to any server.
            </p>

            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/60 relative">
              <div className="grid grid-cols-3 gap-2">
                {currentUser.recoveryPhrase.split(' ').map((word, i) => (
                  <div key={i} className="text-xs bg-white px-2 py-1.5 rounded-lg border border-rose-100 font-mono text-center text-slate-700">
                    <span className="text-[10px] text-slate-400 mr-1">{i + 1}.</span>
                    {word}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleCopyPhrase}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-medium transition-colors"
              >
                {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey ? 'Copied to Clipboard' : 'Copy Words'}</span>
              </button>

              <button
                onClick={() => setShowKeyModal(false)}
                className="px-5 py-2 rounded-full bg-slate-900 hover:bg-black text-white text-xs font-semibold transition-colors"
              >
                I Have Saved Them
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New User / Vault Switcher Modal */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-100 space-y-5">
            <div className="flex items-center justify-between border-b border-rose-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-slate-900">
                    Vault Account Manager
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Create a new user or switch between vaults
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUserModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current Vault Indicator */}
            <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800">Active Vault</span>
                <p className="font-mono text-xs font-bold text-slate-800 mt-0.5">{currentUser.pseudonym}</p>
                <p className="text-[10px] text-slate-500">{reports.length} report(s) saved in this vault</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                Current
              </span>
            </div>

            {/* Create Brand New Vault Form */}
            <div className="space-y-3 pt-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Create a Brand New Vault User
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={customPseudonym}
                  onChange={(e) => setCustomPseudonym(e.target.value)}
                  placeholder="e.g. Velvet-Harbor-804"
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-mono focus:outline-none focus:border-rose-400"
                />
                <button
                  type="button"
                  onClick={() => setCustomPseudonym(generateRandomPseudonym())}
                  title="Generate Random Pseudonym"
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-rose-600" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  createNewUser(customPseudonym);
                  setCustomPseudonym('');
                  setShowUserModal(false);
                }}
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow transition-all flex items-center justify-center space-x-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create Fresh Vault & Switch</span>
              </button>
            </div>

            {/* Switch to Existing Vaults in Session */}
            {allUsers.length > 1 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-700 block">
                  Other Vaults in This Session ({allUsers.length})
                </span>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {allUsers.map((u) => (
                    <div
                      key={u.id}
                      className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                        u.id === currentUser.id
                          ? 'bg-rose-50 border-rose-300 font-semibold text-rose-900'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-mono text-xs">{u.pseudonym}</div>
                      {u.id === currentUser.id ? (
                        <span className="text-[10px] text-rose-600 font-bold">Active</span>
                      ) : (
                        <button
                          onClick={() => {
                            switchUser(u.id);
                            setShowUserModal(false);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-black text-white text-[10px] font-medium transition-colors"
                        >
                          Switch
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
