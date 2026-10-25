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
  RotateCcw,
  Sparkles,
  Calendar,
  Layers,
  Trash2,
  UserPlus,
  X,
  CheckCircle2,
  AlertTriangle,
  Send,
  Clock,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { currentUser, allUsers, createNewUser, switchUser, reports, matches, setView, deleteReport, language, directComplaints, submitDirectComplaint } = useApp();
  const t = translations[language];
  const [showUserModal, setShowUserModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [customPseudonym, setCustomPseudonym] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Restore vault: user enters their vault pseudonym to switch back to it
  const [restorePseudonym, setRestorePseudonym] = useState('');
  const [restoreError, setRestoreError] = useState('');
  const [restoreSuccess, setRestoreSuccess] = useState(false);

  const handleRestore = () => {
    const match = allUsers.find(u => u.pseudonym.toLowerCase() === restorePseudonym.trim().toLowerCase());
    if (!match) {
      setRestoreError('No vault found with that name in this session. If you cleared your browser data, the vault cannot be recovered.');
      return;
    }
    switchUser(match.id);
    setRestoreSuccess(true);
    setTimeout(() => {
      setShowRestoreModal(false);
      setRestoreSuccess(false);
      setRestorePseudonym('');
      setRestoreError('');
    }, 1200);
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

        <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-gradient-to-tr from-rose-200/40 to-blush-100/30 blur-2xl pointer-events-none" />
      </div>

      {/* Vault Identity Strip — no recovery phrase, just pseudonym + actions */}
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
              Your vault ID is your only identity. No email or phone required.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowRestoreModal(true)}
            className="px-4 py-2 rounded-full text-xs font-medium text-slate-700 bg-white hover:bg-rose-50 border border-rose-200/60 shadow-sm transition-colors whitespace-nowrap flex items-center space-x-1.5"
          >
            <RotateCcw className="w-3 h-3 text-rose-500" />
            <span>Restore Vault</span>
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

                {/* Direct IC Complaint button */}
                {(() => {
                  const filed = directComplaints.find(d => d.reportId === rep.id);
                  return filed ? (
                    <div className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Direct complaint filed with IC Reviewer — <span className="font-medium capitalize">{filed.status}</span></span>
                    </div>
                  ) : (
                    <button
                      onClick={() => submitDirectComplaint(rep.id)}
                      className="w-full flex items-center justify-center space-x-2 py-2 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-semibold transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>File Direct Complaint to IC Reviewer</span>
                    </button>
                  );
                })()}

                {confirmDeleteId === rep.id && (
                  <div className="mt-3 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs space-y-2">
                    <p className="font-semibold text-rose-900">{t.confirmDeleteTitle}</p>
                    <p className="text-[11px] text-rose-700">{t.confirmDeleteDesc}</p>
                    <div className="flex items-center justify-end space-x-2 pt-1">
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-3 py-1 rounded-full text-slate-600 hover:bg-white text-xs"
                      >
                        {t.cancel}
                      </button>
                      <button
                        onClick={() => { deleteReport(rep.id); setConfirmDeleteId(null); }}
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

      {/* Restore Vault Modal */}
      {showRestoreModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-rose-100 space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-rose-100">
              <div className="flex items-center space-x-2">
                <RotateCcw className="w-5 h-5 text-rose-600" />
                <h3 className="font-serif text-lg font-semibold text-slate-800">Restore Vault</h3>
              </div>
              <button onClick={() => { setShowRestoreModal(false); setRestoreError(''); setRestorePseudonym(''); }}
                className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Enter the vault name (pseudonym) you used when you created your account. If other vaults exist in this session, you will be switched to them.
            </p>

            <div className="space-y-2">
              <input
                type="text"
                value={restorePseudonym}
                onChange={(e) => { setRestorePseudonym(e.target.value); setRestoreError(''); }}
                placeholder="e.g. Velvet-Harbor-804"
                className="w-full px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50/40 text-xs font-mono text-slate-800 focus:outline-none focus:border-rose-400"
              />
              {restoreError && (
                <p className="text-[11px] text-red-600 flex items-start space-x-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{restoreError}</span>
                </p>
              )}
              {restoreSuccess && (
                <p className="text-[11px] text-emerald-700 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Vault restored.</span>
                </p>
              )}
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 leading-relaxed">
              If you cleared your browser data or are on a new device, the vault data cannot be recovered — it was only stored locally on your previous device.
            </div>

            <button
              onClick={handleRestore}
              disabled={!restorePseudonym.trim()}
              className="w-full py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white text-xs font-semibold shadow transition-all"
            >
              Restore Vault
            </button>
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
                  <h3 className="font-serif text-base font-bold text-slate-900">Vault Account Manager</h3>
                  <p className="text-[11px] text-slate-500">Create a new user or switch between vaults</p>
                </div>
              </div>
              <button onClick={() => setShowUserModal(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800">Active Vault</span>
                <p className="font-mono text-xs font-bold text-slate-800 mt-0.5">{currentUser.pseudonym}</p>
                <p className="text-[10px] text-slate-500">{reports.length} report(s) saved in this vault</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">Current</span>
            </div>

            <div className="space-y-3 pt-1">
              <label className="text-xs font-semibold text-slate-700 block">Create a Brand New Vault User</label>
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
                onClick={() => { createNewUser(customPseudonym); setCustomPseudonym(''); setShowUserModal(false); }}
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow transition-all flex items-center justify-center space-x-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create Fresh Vault and Switch</span>
              </button>
            </div>

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
                          onClick={() => { switchUser(u.id); setShowUserModal(false); }}
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
