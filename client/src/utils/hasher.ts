/**
 * Normalization & Keyed Hashing Module for Aawaz
 * Prevents dictionary attacks and ensures privacy-preserving escrow matching.
 */

const DEFAULT_SERVER_PEPPER = "Aawaz_Sacred_Escrow_Pepper_2026_Secure_Key";

const HONORIFICS_REGEX = /^(mr|mrs|ms|miss|dr|prof|professor|sir|shri|smt|madam)\.?\s+/i;
const ORG_SUFFIXES_REGEX = /\b(pvt|ltd|limited|private|inc|corp|corporation|technologies|solutions|group|university|college|inst|institute)\b\.?/gi;

/**
 * Normalizes accused individual's name
 */
export function normalizeName(name: string): string {
  if (!name) return '';
  let cleaned = name.trim().toLowerCase();
  cleaned = cleaned.replace(HONORIFICS_REGEX, '');
  cleaned = cleaned.replace(/[^\w\s]/g, '');
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  return cleaned;
}

/**
 * Normalizes organisation or workplace
 */
export function normalizeOrg(org: string): string {
  if (!org) return '';
  let cleaned = org.trim().toLowerCase();
  cleaned = cleaned.replace(ORG_SUFFIXES_REGEX, '');
  cleaned = cleaned.replace(/[^\w\s]/g, '');
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  return cleaned;
}

/**
 * Simplified Metaphone / phonetic sound key generator for Indian/International names
 */
export function computePhoneticKey(name: string): string {
  const norm = normalizeName(name);
  if (!norm) return '';

  return norm
    .split(' ')
    .map(word => {
      let code = word
        .replace(/ee|ea|e|i|y/g, 'I')
        .replace(/oo|ou|o|u/g, 'U')
        .replace(/aa|a/g, 'A')
        .replace(/sh|ch|c/g, 'S')
        .replace(/ph|f/g, 'F')
        .replace(/th|t/g, 'T')
        .replace(/kh|k|q/g, 'K')
        .replace(/jh|z|j/g, 'J')
        .replace(/bh|b/g, 'B')
        .replace(/dh|d/g, 'D')
        .replace(/gh|g/g, 'G');
      // Collapse identical adjacent characters
      code = code.replace(/(.)\1+/g, '$1');
      return code.slice(0, 6);
    })
    .join('_');
}

/**
 * Derives the HMAC-SHA256 Match Token from normalized name + organization
 */
export async function deriveMatchToken(name: string, org: string, pepper: string = DEFAULT_SERVER_PEPPER): Promise<string> {
  const cleanName = normalizeName(name);
  const cleanOrg = normalizeOrg(org);
  const payload = `${cleanName}|${cleanOrg}`;

  const enc = new TextEncoder();
  const key = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(pepper),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await window.crypto.subtle.sign(
    'HMAC',
    key,
    enc.encode(payload)
  );

  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
