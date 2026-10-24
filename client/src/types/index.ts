export type ConsentScope = 'none' | 'existence_only' | 'timeline' | 'full';

export interface UserAccount {
  id: string;
  pseudonym: string;
  publicKey: string;
  recoveryPhrase: string;
  createdAt: string;
}

export interface StructuredEvent {
  id: string;
  dateOrPeriod: string;
  location: string;
  description: string;
  behaviorCategory: 'unwanted_contact' | 'verbal_harassment' | 'quid_pro_quo' | 'intimidation' | 'cyber_stalking' | 'other';
  witnesses?: string;
  evidenceMentioned?: string;
}

export interface ReportDraft {
  id: string;
  accusedName: string;
  accusedOrg: string;
  accusedRole: string;
  narrative: string;
  structuredEvents: StructuredEvent[];
  summary: string;
  evidenceItems: {
    id: string;
    fileName: string;
    fileSize: number;
    fileHash: string;
    uploadedAt: string;
  }[];
  createdAt: string;
  matchToken?: string;
  phoneticToken?: string;
  encryptedBlob?: string;
  status: 'draft' | 'encrypted_stored' | 'matched' | 'escalated';
}

export interface MatchRecord {
  id: string;
  reportId: string;
  matchedReportId?: string;
  peerUserPseudonym?: string;
  peerRole?: string;
  confidence: 'high' | 'possible';
  myConsent: ConsentScope;
  peerConsent: ConsentScope;
  createdAt: string;
  timelineSharedWithMe?: StructuredEvent[];
}

export interface PersonaProfile {
  id: string;
  name: string;
  displayTitle: string;
  pseudonym: string;
  avatarSeed: string;
  recoveryPhrase: string;
  sampleReport: ReportDraft;
}
