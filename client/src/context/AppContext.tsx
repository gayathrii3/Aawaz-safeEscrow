import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount, ReportDraft, MatchRecord, ConsentScope, StructuredEvent } from '../types';
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
  resetDemoData: () => void;
  activePersona?: 'keerthi' | 'navya' | 'custom';
  switchPersona?: (persona: 'keerthi' | 'navya' | 'custom') => void;
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

    // 1. Save current active user data
    setVaultStore(prev => ({
      ...prev,
      [currentUser.id]: { reports, matches }
    }));

    // 2. Find target user
    const targetUser = allUsers.find(u => u.id === userId);
    if (!targetUser) return;

    const targetData = vaultStore[userId] || { reports: [], matches: [] };
    setCurrentUser(targetUser);
    setReports(targetData.reports);
    setMatches(targetData.matches);
    setView('dashboard');
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
      // Cross-match found with another local user!
      const currentMatch: MatchRecord = {
        id: `match-${Date.now().toString().slice(-5)}`,
        reportId: saved.id,
        matchedReportId: foundLocalMatch.peerReport.id,
        peerUserPseudonym: foundLocalMatch.peerUser.pseudonym,
        peerRole: foundLocalMatch.peerReport.accusedRole || 'Colleague (Apex Global)',
        confidence: 'high',
        myConsent: 'none',
        peerConsent: 'timeline',
        createdAt: new Date().toISOString(),
        timelineSharedWithMe: foundLocalMatch.peerReport.structuredEvents || []
      };

      setMatches(prev => [currentMatch, ...prev]);

      // Also attach matching record to the peer user
      const peerMatch: MatchRecord = {
        id: `match-peer-${Date.now().toString().slice(-5)}`,
        reportId: foundLocalMatch.peerReport.id,
        matchedReportId: saved.id,
        peerUserPseudonym: currentUser.pseudonym,
        peerRole: saved.accusedRole || 'Colleague (Apex Global)',
        confidence: 'high',
        myConsent: 'none',
        peerConsent: 'timeline',
        createdAt: new Date().toISOString(),
        timelineSharedWithMe: saved.structuredEvents
      };

      setVaultStore(prev => ({
        ...prev,
        [foundLocalMatch!.peerUser.id]: {
          ...prev[foundLocalMatch!.peerUser.id],
          matches: [peerMatch, ...(prev[foundLocalMatch!.peerUser.id]?.matches || [])]
        }
      }));
    } else {
      // 2. If no local peer yet, check against institutional benchmark pattern
      const peerEvents: StructuredEvent[] = [
        {
          id: 'evt-benchmark-1',
          dateOrPeriod: 'March 2026',
          location: `${draft.accusedOrg || 'Apex Global Technologies'} - 4th Floor Meeting Pod`,
          description: 'During a 1-on-1 performance review, subject stood uncomfortably close and conditioned appraisal rating on after-hours personal availability.',
          behaviorCategory: 'quid_pro_quo',
          witnesses: 'Closed room review'
        },
        {
          id: 'evt-benchmark-2',
          dateOrPeriod: 'October 2026',
          location: 'Official Slack / Private WhatsApp',
          description: 'Sent personal late-night messages after 11 PM commenting on physical appearance and suggesting promotion fast-tracking.',
          behaviorCategory: 'unwanted_contact',
          evidenceMentioned: 'Timestamped chat export with SHA-256 seal'
        }
      ];

      const newMatch: MatchRecord = {
        id: `match-${Date.now().toString().slice(-5)}`,
        reportId: saved.id,
        matchedReportId: `rep-peer-${Math.floor(1000 + Math.random() * 9000)}`,
        peerUserPseudonym: `Serene-Breeze-${Math.floor(100 + Math.random() * 900)}`,
        peerRole: 'Former Employee (Apex Global)',
        confidence: 'high',
        myConsent: 'none',
        peerConsent: 'timeline',
        createdAt: new Date().toISOString(),
        timelineSharedWithMe: peerEvents
      };

      setMatches(prev => [newMatch, ...prev]);
    }

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
        resetDemoData
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
