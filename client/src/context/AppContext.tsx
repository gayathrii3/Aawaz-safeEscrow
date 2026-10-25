import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount, ReportDraft, MatchRecord, ConsentScope, StructuredEvent, DirectComplaint } from '../types';
import { generateRecoveryPhrase, encryptPayload } from '../utils/crypto';
import { deriveMatchToken, computePhoneticKey } from '../utils/hasher';

const ADJECTIVES = ['Aura', 'Sanctuary', 'Velvet', 'Serene', 'Peony', 'Amber', 'Radiant', 'Dawn', 'Solace', 'Harbor', 'Lotus', 'Breeze'];
const NOUNS = ['Sparrow', 'River', 'Willow', 'Glimmer', 'Horizon', 'Lantern', 'Cradle', 'Echo', 'Haven', 'Falcon', 'Meadow', 'Cascade'];

export const generateRandomPseudonym = (): string => {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(100 + Math.random() * 900);
  return `${adj}-${noun}-${num}`;
};

interface AppContextType {
  currentUser: UserAccount;
  allUsers: UserAccount[];
  createNewUser: (customPseudonym?: string) => UserAccount;
  switchUser: (userId: string) => void;
  reports: ReportDraft[];
  activeReport: ReportDraft | null;
  setActiveReport: (r: ReportDraft | null) => void;
  matches: MatchRecord[];
  notifications: AppNotification[];
  dismissNotification: (id: string) => void;
  disguiseActive: boolean;
  setDisguiseActive: (val: boolean) => void;
  quickExitActive: boolean;
  triggerQuickExit: () => void;
  resetQuickExit: () => void;
  pinCode: string;
  setPinCode: (pin: string) => void;
  view: 'dashboard' | 'report_builder' | 'matches' | 'rights' | 'reviewer';
  setView: (v: 'dashboard' | 'report_builder' | 'matches' | 'rights' | 'reviewer') => void;
  language: 'en' | 'te' | 'hi';
  setLanguage: (lang: 'en' | 'te' | 'hi') => void;
  deleteReport: (reportId: string) => void;
  clearAllLocalData: () => void;
  submitReport: (draft: ReportDraft) => Promise<void>;
  updateConsent: (matchId: string, scope: ConsentScope) => void;
  updatePeerConsent: (matchId: string, scope: ConsentScope) => void;
  requestStep: (matchId: string, step: 2 | 3) => void;
  simulatePeerRequest: (matchId: string, step: 2 | 3) => void;
  resetDemoData: () => void;
  activePersona?: 'keerthi' | 'navya' | 'custom';
  switchPersona?: (persona: 'keerthi' | 'navya' | 'custom') => void;
  directComplaints: DirectComplaint[];
  submitDirectComplaint: (reportId: string) => void;
  updateDirectComplaintStatus: (id: string, status: 'acknowledged' | 'dismissed') => void;
}

export interface AppNotification {
  id: string;
  matchId: string;
  type: 'match_found' | 'step2_requested' | 'step2_unlocked' | 'step3_requested' | 'step3_unlocked';
  fromPseudonym: string;
  message: string;
  createdAt: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'te' | 'hi'>('en');
  const [disguiseActive, setDisguiseActive] = useState<boolean>(false);
  const [quickExitActive, setQuickExitActive] = useState<boolean>(false);
  const [pinCode, setPinCode] = useState<string>('2026');
  const [view, setView] = useState<'dashboard' | 'report_builder' | 'matches' | 'rights' | 'reviewer'>('dashboard');

  // Initialize fresh, dynamic user vault
  const [initialUser] = useState<UserAccount>(() => ({
    id: 'usr-vault-01',
    pseudonym: generateRandomPseudonym(),
    publicKey: 'pk_secp256k1_vault_01',
    recoveryPhrase: generateRecoveryPhrase(),
    createdAt: new Date().toISOString()
  }));

  const [allUsers, setAllUsers] = useState<UserAccount[]>([initialUser]);
  const [currentUser, setCurrentUser] = useState<UserAccount>(initialUser);
  const [vaultStore, setVaultStore] = useState<{ [userId: string]: { reports: ReportDraft[]; matches: MatchRecord[] } }>({
    [initialUser.id]: { reports: [], matches: [] }
  });

  const [reports, setReports] = useState<ReportDraft[]>([]);
  const [activeReport, setActiveReport] = useState<ReportDraft | null>(null);
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [directComplaints, setDirectComplaints] = useState<DirectComplaint[]>([]);

  const addNotification = (n: Omit<AppNotification, 'id' | 'createdAt'>) => {
    setNotifications(prev => [{
      ...n,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }, ...prev]);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Create a brand new independent user vault
  const createNewUser = (customPseudonym?: string): UserAccount => {
    // 1. Save current active user data
    setVaultStore(prev => ({
      ...prev,
      [currentUser.id]: { reports, matches }
    }));

    const newId = `usr-vault-${Date.now().toString().slice(-5)}`;
    const newAccount: UserAccount = {
      id: newId,
      pseudonym: customPseudonym?.trim() || generateRandomPseudonym(),
      publicKey: `pk_secp256k1_${Date.now()}`,
      recoveryPhrase: generateRecoveryPhrase(),
      createdAt: new Date().toISOString()
    };

    setAllUsers(prev => [...prev, newAccount]);
    setVaultStore(prev => ({
      ...prev,
      [newId]: { reports: [], matches: [] }
    }));

    setCurrentUser(newAccount);
    setReports([]);
    setMatches([]);
    setView('dashboard');
    return newAccount;
  };

  // Switch between existing user vaults in this session
  const switchUser = (userId: string) => {
    if (userId === currentUser.id) return;

    const targetUser = allUsers.find(u => u.id === userId);
    if (!targetUser) return;

    // Save current user's live state into vaultStore, then load the target user.
    // Use the functional form so both updates share the same vaultStore snapshot.
    setVaultStore(prev => {
      const saved = {
        ...prev,
        [currentUser.id]: { reports, matches, notifications } as any,
      };
      // Load target user's data from the already-updated store
      const targetData = (saved[userId] as any) || { reports: [], matches: [], notifications: [] };
      // Schedule the UI state updates synchronously after this render
      setTimeout(() => {
        setCurrentUser(targetUser);
        setReports(targetData.reports || []);
        setMatches(targetData.matches || []);
        setNotifications(targetData.notifications || []);
        setView('dashboard');
      }, 0);
      return saved;
    });
  };

  const submitReport = async (draft: ReportDraft) => {
    const matchToken = await deriveMatchToken(draft.accusedName, draft.accusedOrg);
    const phoneticToken = computePhoneticKey(draft.accusedName);
    const encryptedBlob = await encryptPayload(draft, currentUser.recoveryPhrase);

    const saved: ReportDraft = {
      ...draft,
      matchToken,
      phoneticToken,
      encryptedBlob,
      status: 'encrypted_stored'
    };

    const updatedReports = [saved, ...reports];
    setReports(updatedReports);

    // Save into vault store
    setVaultStore(prev => ({
      ...prev,
      [currentUser.id]: {
        reports: updatedReports,
        matches: matches
      }
    }));

    // 1. Check for matching reports among OTHER local users created in this session!
    let foundLocalMatch: { peerUser: UserAccount; peerReport: ReportDraft } | null = null;
    for (const user of allUsers) {
      if (user.id === currentUser.id) continue;
      const otherUserData = vaultStore[user.id];
      if (otherUserData && otherUserData.reports) {
        for (const rep of otherUserData.reports) {
          if (
            (rep.matchToken && rep.matchToken === matchToken) ||
            (rep.phoneticToken && rep.phoneticToken === phoneticToken) ||
            (rep.accusedName.toLowerCase().trim() === draft.accusedName.toLowerCase().trim() &&
             rep.accusedOrg.toLowerCase().trim() === draft.accusedOrg.toLowerCase().trim())
          ) {
            foundLocalMatch = { peerUser: user, peerReport: rep };
            break;
          }
        }
      }
      if (foundLocalMatch) break;
    }

    if (foundLocalMatch) {
      // Real cross-match found with another local user
      const matchId = `match-${Date.now().toString().slice(-5)}`;
      const peerMatchId = `match-peer-${Date.now().toString().slice(-5)}`;

      const currentMatch: MatchRecord = {
        id: matchId,
        pairedMatchId: peerMatchId,
        peerUserId: foundLocalMatch.peerUser.id,
        reportId: saved.id,
        matchedReportId: foundLocalMatch.peerReport.id,
        peerUserPseudonym: foundLocalMatch.peerUser.pseudonym,
        peerRole: foundLocalMatch.peerReport.accusedRole || 'Colleague',
        confidence: 'high',
        myConsent: 'none',
        peerConsent: 'none',
        createdAt: new Date().toISOString(),
        timelineSharedWithMe: foundLocalMatch.peerReport.structuredEvents || []
      };

      setMatches(prev => [currentMatch, ...prev]);

      // Notify this user of the match
      addNotification({
        matchId,
        type: 'match_found',
        fromPseudonym: foundLocalMatch.peerUser.pseudonym,
        message: `Someone else at your organization has reported the same person. You are not alone.`,
      });

      // Attach matching record to the peer user and notify them
      const peerMatch: MatchRecord = {
        id: peerMatchId,
        pairedMatchId: matchId,
        peerUserId: currentUser.id,
        reportId: foundLocalMatch.peerReport.id,
        matchedReportId: saved.id,
        peerUserPseudonym: currentUser.pseudonym,
        peerRole: saved.accusedRole || 'Colleague',
        confidence: 'high',
        myConsent: 'none',
        peerConsent: 'none',
        createdAt: new Date().toISOString(),
        timelineSharedWithMe: saved.structuredEvents
      };

      // Push a notification into the peer's vault so they see it when they switch
      const peerNotification: AppNotification = {
        id: `notif-peer-${Date.now()}`,
        matchId: peerMatchId,
        type: 'match_found',
        fromPseudonym: currentUser.pseudonym,
        message: `Someone else at your organization has reported the same person. You are not alone.`,
        createdAt: new Date().toISOString(),
      };

      setVaultStore(prev => ({
        ...prev,
        [foundLocalMatch!.peerUser.id]: {
          ...prev[foundLocalMatch!.peerUser.id],
          matches: [peerMatch, ...(prev[foundLocalMatch!.peerUser.id]?.matches || [])],
          notifications: [peerNotification, ...((prev[foundLocalMatch!.peerUser.id] as any)?.notifications || [])],
        }
      }));
    }
    // If no real peer match found, do NOT create any static/benchmark match.
    // The user will simply see a "waiting" state in their dashboard.

    setView('matches');
  };

  const updateConsent = (matchId: string, scope: ConsentScope) => {
    setMatches(prev =>
      prev.map(m => {
        if (m.id === matchId) {
          return { ...m, myConsent: scope };
        }
        return m;
      })
    );
  };

  const updatePeerConsent = (matchId: string, scope: ConsentScope) => {
    setMatches(prev =>
      prev.map(m => {
        if (m.id === matchId) {
          return { ...m, peerConsent: scope };
        }
        return m;
      })
    );
  };

  // User sends a request to proceed to the given step.
  // When the first user requests: write peerStep*Requested on the peer's vault match
  //   so the peer sees the "Agree" button when they switch accounts.
  // When the second user agrees (peer already requested): unlock both sides —
  //   update own match AND write myConsent/peerConsent back to the first user's vault match.
  const requestStep = (matchId: string, step: 2 | 3) => {
    // Read the match synchronously from current state before any async batching
    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    const scope: ConsentScope = step === 2 ? 'timeline' : 'full';
    const myReqField    = step === 2 ? 'myStep2Requested'   : 'myStep3Requested';
    const peerReqField  = step === 2 ? 'peerStep2Requested' : 'peerStep3Requested';
    const unlockType    = step === 2 ? 'step2_unlocked'     : 'step3_unlocked';
    const reqType       = step === 2 ? 'step2_requested'    : 'step3_requested';
    const stepLabel     = step === 2 ? 'compare timelines'  : 'file a joint complaint';

    const peerAlreadySent = !!(match as any)[peerReqField];

    // 1. Update own match
    setMatches(prev => prev.map(m => {
      if (m.id !== matchId) return m;
      const updated = { ...m, [myReqField]: true };
      if (peerAlreadySent) {
        return { ...updated, myConsent: scope, peerConsent: scope };
      }
      return updated;
    }));

    // 2. Notification for self
    if (peerAlreadySent) {
      addNotification({
        matchId,
        type: unlockType,
        fromPseudonym: match.peerUserPseudonym || 'Your colleague',
        message: `Both of you agreed. You can now ${stepLabel}.`,
      });
    } else {
      addNotification({
        matchId,
        type: reqType,
        fromPseudonym: 'You',
        message: `Your request to ${stepLabel} has been sent. Waiting for the other person to agree.`,
      });
    }

    // 3. Update peer's vault
    if (match.pairedMatchId && match.peerUserId) {
      const peerId = match.peerUserId;
      const pairedId = match.pairedMatchId;

      if (peerAlreadySent) {
        // The step is now fully unlocked — update the peer's match so they also see it open
        // From the peer's perspective: "my peer (currentUser) agreed" → peerStep*Requested = true on their match
        const peerNotif: AppNotification = {
          id: `notif-${Date.now()}`,
          matchId: pairedId,
          type: unlockType,
          fromPseudonym: currentUser.pseudonym,
          message: `${currentUser.pseudonym} agreed. Both of you can now ${stepLabel}.`,
          createdAt: new Date().toISOString(),
        };
        setVaultStore(prev => ({
          ...prev,
          [peerId]: {
            ...prev[peerId],
            matches: ((prev[peerId] as any)?.matches || []).map((pm: any) =>
              pm.id === pairedId
                ? { ...pm, [peerReqField]: true, myConsent: scope, peerConsent: scope }
                : pm
            ),
            notifications: [peerNotif, ...((prev[peerId] as any)?.notifications || [])],
          }
        }));
      } else {
        // First request — tell the peer a request came in (peerStep*Requested on their match)
        const peerNotif: AppNotification = {
          id: `notif-${Date.now()}`,
          matchId: pairedId,
          type: reqType,
          fromPseudonym: currentUser.pseudonym,
          message: `${currentUser.pseudonym} wants to ${stepLabel} with you. Open Matches to respond.`,
          createdAt: new Date().toISOString(),
        };
        setVaultStore(prev => ({
          ...prev,
          [peerId]: {
            ...prev[peerId],
            matches: ((prev[peerId] as any)?.matches || []).map((pm: any) =>
              pm.id === pairedId ? { ...pm, [peerReqField]: true } : pm
            ),
            notifications: [peerNotif, ...((prev[peerId] as any)?.notifications || [])],
          }
        }));
      }
    }
  };

  // simulatePeerRequest is no longer needed — no-op stub
  const simulatePeerRequest = (_matchId: string, _step: 2 | 3) => {};

  const triggerQuickExit = () => {
    setDisguiseActive(true);
    setQuickExitActive(false);
  };

  const resetQuickExit = () => {
    setQuickExitActive(false);
  };

  const deleteReport = (reportId: string) => {
    setReports(prev => prev.filter(r => r.id !== reportId));
    setMatches(prev => prev.filter(m => m.reportId !== reportId));
  };

  const clearAllLocalData = () => {
    sessionStorage.clear();
    localStorage.clear();
    setReports([]);
    setMatches([]);
    const freshAccount: UserAccount = {
      id: `usr-fresh-${Date.now().toString().slice(-4)}`,
      pseudonym: generateRandomPseudonym(),
      publicKey: 'pk_new_vault',
      recoveryPhrase: generateRecoveryPhrase(),
      createdAt: new Date().toISOString()
    };
    setCurrentUser(freshAccount);
    setAllUsers([freshAccount]);
    setVaultStore({ [freshAccount.id]: { reports: [], matches: [] } });
    setView('dashboard');
  };

  const resetDemoData = () => {
    clearAllLocalData();
  };

  const submitDirectComplaint = (reportId: string) => {
    const already = directComplaints.find(d => d.reportId === reportId && d.complainantPseudonym === currentUser.pseudonym);
    if (already) return; // already filed
    setDirectComplaints(prev => [
      ...prev,
      {
        id: `dc-${Date.now()}`,
        reportId,
        complainantPseudonym: currentUser.pseudonym,
        submittedAt: new Date().toISOString(),
        status: 'pending',
      }
    ]);
  };

  const updateDirectComplaintStatus = (id: string, status: 'acknowledged' | 'dismissed') => {
    setDirectComplaints(prev => prev.map(d => d.id === id ? { ...d, status } : d));
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        currentUser,
        allUsers,
        createNewUser,
        switchUser,
        reports,
        activeReport,
        setActiveReport,
        matches,
        notifications,
        dismissNotification,
        disguiseActive,
        setDisguiseActive,
        quickExitActive,
        triggerQuickExit,
        resetQuickExit,
        pinCode,
        setPinCode,
        view,
        setView,
        submitReport,
        deleteReport,
        clearAllLocalData,
        updateConsent,
        updatePeerConsent,
        requestStep,
        simulatePeerRequest,
        resetDemoData,
        directComplaints,
        submitDirectComplaint,
        updateDirectComplaintStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
